import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Phone, X, Check, Clock, ChevronLeft, ChevronRight, Wallet, CalendarDays, AlertCircle, Trash2, Settings, Car } from "lucide-react";
import { supabase } from "./supabaseClient";

const SERVICES = [
  { id: "ehliyet", label: "Sürücü Belgesi (Ehliyet)" },
  { id: "src", label: "SRC Sertifikası" },
  { id: "silah", label: "Silah Ruhsatı" },
  { id: "is_makinesi", label: "İş Makinesi Operatörlüğü" },
  { id: "diger", label: "Diğer" },
];

const PAY_STATUS = {
  odendi: { label: "Ödendi", color: "#3D7A5C", bg: "#E7F2ED" },
  bekliyor: { label: "Bekliyor", color: "#B23B3B", bg: "#FBEAEA" },
  kismi: { label: "Kısmi", color: "#B2811F", bg: "#FBF2DF" },
};

const NAVY = "#0F2244";
const GOLD = "#D4AF37";
const CREAM = "#F7F5F0";

function pad(n) { return n.toString().padStart(2, "0"); }
function dateKey(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function fmtDateTR(d) {
  const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} · ${days[d.getDay()]}`;
}
function addDays(d, n) { const nd = new Date(d); nd.setDate(nd.getDate() + n); return nd; }
function genSlots(startH, endH, stepMin) {
  const slots = [];
  let cur = startH * 60;
  const end = endH * 60;
  while (cur < end) {
    const h = Math.floor(cur / 60), m = cur % 60;
    slots.push(`${pad(h)}:${pad(m)}`);
    cur += stepMin;
  }
  return slots;
}
function currency(n) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n || 0);
}
function fmtDateShortTR(isoStr) {
  if (!isoStr) return "";
  const [y, m, d] = isoStr.split("-").map(Number);
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  return `${d} ${months[m - 1]} ${y}`;
}
function addYears(isoStr, years) {
  const [y, m, d] = isoStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setFullYear(dt.getFullYear() + years);
  return dateKey(dt);
}
function daysBetween(fromDate, toIso) {
  const [y, m, d] = toIso.split("-").map(Number);
  const to = new Date(y, m - 1, d);
  const ms = to.getTime() - fromDate.getTime();
  return Math.round(ms / 86400000);
}
function smsHref(phone, text) {
  const cleanPhone = (phone || "").replace(/\s+/g, "");
  return `sms:${cleanPhone}?body=${encodeURIComponent(text)}`;
}
function apptReminderSMS(appt, dateIso, slot) {
  return `Sayın ${appt.clientName}, ${fmtDateShortTR(dateIso)} tarihinde saat ${slot}'de Rota Psikoteknik'teki randevunuz onaylanmıştır. Bilgi için: Rota Psikoteknik`;
}
function expirySMS(appt) {
  return `Sayın ${appt.clientName}, ${fmtDateShortTR(appt.issueDate)} tarihinde aldığınız psikoteknik belgenizin geçerlilik süresi ${fmtDateShortTR(appt.expiryDate)} tarihinde sona ermektedir. Yenileme randevusu için bizi arayabilirsiniz. Rota Psikoteknik`;
}

// --- Supabase <-> JS alan eşleme yardımcıları ---
function rowToAppt(row) {
  return {
    clientName: row.client_name,
    phone: row.phone || "",
    service: row.service,
    price: Number(row.price) || 0,
    payStatus: row.pay_status,
    paidAmount: row.paid_amount != null ? Number(row.paid_amount) : undefined,
    note: row.note || "",
    documentIssued: !!row.document_issued,
    issueDate: row.issue_date || undefined,
    expiryDate: row.expiry_date || undefined,
  };
}
function apptToRow(dateStr, slot, appt) {
  return {
    date: dateStr,
    slot,
    client_name: appt.clientName,
    phone: appt.phone || null,
    service: appt.service,
    price: appt.price,
    pay_status: appt.payStatus,
    paid_amount: appt.paidAmount ?? null,
    note: appt.note || null,
    document_issued: !!appt.documentIssued,
    issue_date: appt.issueDate || null,
    expiry_date: appt.expiryDate || null,
    updated_at: new Date().toISOString(),
  };
}
function rowToSettings(row) {
  return {
    startHour: row.start_hour,
    endHour: row.end_hour,
    stepMin: row.step_min,
    validityYears: row.validity_years,
    reminderWindowDays: row.reminder_window_days,
  };
}
function settingsToRow(s) {
  return {
    id: 1,
    start_hour: s.startHour,
    end_hour: s.endHour,
    step_min: s.stepMin,
    validity_years: s.validityYears,
    reminder_window_days: s.reminderWindowDays,
  };
}

export default function App() {
  const [today] = useState(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; });
  const [selectedDate, setSelectedDate] = useState(today);
  const [settings, setSettings] = useState({ startHour: 9, endHour: 18, stepMin: 45, validityYears: 5, reminderWindowDays: 60 });
  const [dayData, setDayData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null);
  const [pendingList, setPendingList] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [allDocuments, setAllDocuments] = useState([]);
  const [toast, setToast] = useState(null);
  const [connError, setConnError] = useState(null);

  const key = dateKey(selectedDate);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const loadSettings = useCallback(async () => {
    const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
    if (error) { setConnError(error.message); return; }
    if (data) setSettings(rowToSettings(data));
  }, []);

  const loadDay = useCallback(async (k) => {
    setLoading(true);
    const { data, error } = await supabase.from("appointments").select("*").eq("date", k);
    if (error) { setConnError(error.message); setLoading(false); return; }
    const obj = {};
    (data || []).forEach((row) => { obj[row.slot] = rowToAppt(row); });
    setDayData((prev) => ({ ...prev, [k]: obj }));
    setLoading(false);
  }, []);

  const loadAll = useCallback(async () => {
    setPendingLoading(true);
    const { data, error } = await supabase.from("appointments").select("*").order("date").order("slot");
    if (error) { setConnError(error.message); setPendingLoading(false); return; }
    const unpaid = [];
    const documented = [];
    (data || []).forEach((row) => {
      const appt = rowToAppt(row);
      if (appt.payStatus !== "odendi") unpaid.push({ ...appt, date: row.date, slot: row.slot });
      if (appt.documentIssued && appt.issueDate) documented.push({ ...appt, date: row.date, slot: row.slot });
    });
    setPendingList(unpaid);
    setAllDocuments(documented);
    setPendingLoading(false);
  }, []);

  useEffect(() => { loadSettings(); loadAll(); }, []);
  useEffect(() => { loadDay(key); }, [key, loadDay]);

  const slots = useMemo(() => genSlots(settings.startHour, settings.endHour, settings.stepMin), [settings]);
  const todaysAppts = dayData[key] || {};

  const dayStats = useMemo(() => {
    const list = Object.values(todaysAppts);
    const count = list.length;
    const collected = list.reduce((s, a) => s + (a.payStatus === "odendi" ? a.price : a.payStatus === "kismi" ? (a.paidAmount || 0) : 0), 0);
    const pending = list.reduce((s, a) => s + (a.payStatus === "bekliyor" ? a.price : a.payStatus === "kismi" ? Math.max(a.price - (a.paidAmount || 0), 0) : 0), 0);
    return { count, collected, pending, capacity: slots.length };
  }, [todaysAppts, slots]);

  const expiringList = useMemo(() => {
    const withExpiry = allDocuments.map((d) => ({ ...d, expiryDate: d.expiryDate || addYears(d.issueDate, settings.validityYears || 5) }));
    const withinWindow = withExpiry
      .map((d) => ({ ...d, daysLeft: daysBetween(today, d.expiryDate) }))
      .filter((d) => d.daysLeft <= (settings.reminderWindowDays || 60));
    withinWindow.sort((a, b) => a.daysLeft - b.daysLeft);
    return withinWindow;
  }, [allDocuments, settings.validityYears, settings.reminderWindowDays, today]);

  async function upsertAppointment(slot, appt) {
    const row = apptToRow(key, slot, appt);
    const { error } = await supabase.from("appointments").upsert(row, { onConflict: "date,slot" });
    if (error) { showToast("Kaydedilemedi: " + error.message); return; }
    setDayData((prev) => ({ ...prev, [key]: { ...prev[key], [slot]: appt } }));
    setActiveSlot(null);
    showToast(appt.clientName ? `${appt.clientName} kaydedildi.` : "Randevu kaydedildi.");
    loadAll();
  }

  async function removeAppointment(slot) {
    const { error } = await supabase.from("appointments").delete().eq("date", key).eq("slot", slot);
    if (error) { showToast("Silinemedi: " + error.message); return; }
    setDayData((prev) => {
      const next = { ...(prev[key] || {}) };
      delete next[slot];
      return { ...prev, [key]: next };
    });
    setActiveSlot(null);
    showToast("Randevu silindi.");
    loadAll();
  }

  async function saveSettings(next) {
    const { error } = await supabase.from("settings").upsert(settingsToRow(next));
    if (error) { showToast("Ayarlar kaydedilemedi: " + error.message); return; }
    setSettings(next);
    setShowSettings(false);
  }

  const isToday = dateKey(selectedDate) === dateKey(today);

  return (
    <div style={{ background: CREAM, minHeight: "100vh", fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {connError && (
        <div style={{ background: "#B23B3B", color: "white", padding: "10px 16px", fontSize: 13, textAlign: "center" }}>
          Bağlantı hatası: {connError}. .env dosyanızdaki Supabase bilgilerini kontrol edin.
        </div>
      )}

      {/* Header */}
      <div style={{ background: NAVY, color: "white", padding: "20px 20px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Car size={16} color={GOLD} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: 0.3 }}>ROTA PSİKOTEKNİK</div>
              <div style={{ fontSize: 10, color: GOLD, letterSpacing: 1.2, fontWeight: 600 }}>RANDEVU &amp; ÖDEME TAKİBİ</div>
            </div>
          </div>
          <button onClick={() => setShowSettings(true)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: 9, color: "white", cursor: "pointer" }}>
            <Settings size={17} />
          </button>
        </div>

        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setSelectedDate((d) => addDays(d, -1))} style={navBtn}><ChevronLeft size={18} color="white" /></button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{fmtDateTR(selectedDate)}</div>
            {isToday ? <div style={{ fontSize: 11, color: GOLD, fontWeight: 600, marginTop: 2 }}>BUGÜN</div> :
              <button onClick={() => setSelectedDate(today)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2, cursor: "pointer", textDecoration: "underline" }}>bugüne dön</button>}
          </div>
          <button onClick={() => setSelectedDate((d) => addDays(d, 1))} style={navBtn}><ChevronRight size={18} color="white" /></button>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <StatCard icon={<CalendarDays size={15} color={GOLD} />} label="Randevu" value={`${dayStats.count}/${dayStats.capacity}`} />
          <StatCard icon={<Wallet size={15} color={GOLD} />} label="Tahsil Edilen" value={currency(dayStats.collected)} />
          <StatCard icon={<AlertCircle size={15} color={GOLD} />} label="Bekleyen" value={currency(dayStats.pending)} />
        </div>
      </div>

      {/* Time grid */}
      <div style={{ padding: "18px 16px 8px", maxWidth: 640, margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#8a8474", padding: 30, fontSize: 13 }}>Yükleniyor...</div>
        ) : (
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 27, top: 6, bottom: 6, width: 2, background: "repeating-linear-gradient(to bottom, #d8c98e 0, #d8c98e 6px, transparent 6px, transparent 12px)" }} />
            {slots.map((slot) => {
              const appt = todaysAppts[slot];
              return (
                <div key={slot} style={{ display: "flex", alignItems: "stretch", marginBottom: 8, position: "relative" }}>
                  <div style={{ width: 56, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 10, flexShrink: 0 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: appt ? GOLD : "#e4ddc9", border: `2px solid ${appt ? GOLD : "#cfc7ae"}`, zIndex: 1 }} />
                    <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginTop: 4 }}>{slot}</div>
                  </div>
                  <button
                    onClick={() => setActiveSlot(slot)}
                    style={{
                      flex: 1, textAlign: "left", borderRadius: 12, padding: "12px 14px",
                      background: appt ? "white" : "rgba(255,255,255,0.5)",
                      boxShadow: appt ? "0 1px 4px rgba(15,34,68,0.08)" : "none",
                      border: appt ? "1px solid #ece7d8" : "1px dashed #d9d2bd",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8
                    }}>
                    {appt ? (
                      <>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: NAVY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{appt.clientName}</div>
                          <div style={{ fontSize: 12, color: "#8a8474", marginTop: 1 }}>
                            {SERVICES.find(s => s.id === appt.service)?.label || appt.service}
                            {appt.documentIssued && <span style={{ color: GOLD, fontWeight: 700 }}> · Belge Verildi</span>}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{currency(appt.price)}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, color: PAY_STATUS[appt.payStatus].color, background: PAY_STATUS[appt.payStatus].bg }}>{PAY_STATUS[appt.payStatus].label}</span>
                        </div>
                      </>
                    ) : (
                      <span style={{ fontSize: 13, color: "#b0a98f", display: "flex", alignItems: "center", gap: 6 }}>
                        <Plus size={14} /> Randevu ekle
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pending payments panel */}
      <div style={{ maxWidth: 640, margin: "20px auto 0", padding: "0 16px 32px" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: NAVY, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <AlertCircle size={14} color="#B23B3B" /> Tüm Bekleyen Ödemeler
        </div>
        <div style={{ background: "white", borderRadius: 14, border: "1px solid #ece7d8", overflow: "hidden" }}>
          {pendingLoading ? (
            <div style={{ padding: 16, fontSize: 13, color: "#8a8474" }}>Yükleniyor...</div>
          ) : pendingList.length === 0 ? (
            <div style={{ padding: 16, fontSize: 13, color: "#8a8474" }}>Bekleyen ödeme yok. Tüm hesaplar temiz.</div>
          ) : (
            pendingList.map((p, i) => (
              <div key={p.date + p.slot} style={{ padding: "11px 14px", borderTop: i === 0 ? "none" : "1px solid #f0ece0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{p.clientName}</div>
                  <div style={{ fontSize: 11, color: "#8a8474" }}>{p.date} · {p.slot}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#B23B3B" }}>{currency(p.payStatus === "kismi" ? Math.max(p.price - (p.paidAmount || 0), 0) : p.price)}</div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: PAY_STATUS[p.payStatus].color }}>{PAY_STATUS[p.payStatus].label}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Expiring documents panel */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px 32px" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: NAVY, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={14} color={GOLD} /> Yaklaşan Belge Yenilemeleri
        </div>
        <div style={{ background: "white", borderRadius: 14, border: "1px solid #ece7d8", overflow: "hidden" }}>
          {expiringList.length === 0 ? (
            <div style={{ padding: 16, fontSize: 13, color: "#8a8474" }}>Yaklaşan belge yenileme yok.</div>
          ) : (
            expiringList.map((d, i) => {
              const overdue = d.daysLeft < 0;
              const urgent = d.daysLeft >= 0 && d.daysLeft <= 14;
              const badgeColor = overdue ? "#B23B3B" : urgent ? "#B2811F" : "#3D7A5C";
              const badgeBg = overdue ? "#FBEAEA" : urgent ? "#FBF2DF" : "#E7F2ED";
              const label = overdue ? `${Math.abs(d.daysLeft)} gün önce doldu` : `${d.daysLeft} gün kaldı`;
              return (
                <div key={d.date + d.slot} style={{ padding: "11px 14px", borderTop: i === 0 ? "none" : "1px solid #f0ece0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{d.clientName}</div>
                    <div style={{ fontSize: 11, color: "#8a8474" }}>{SERVICES.find(s => s.id === d.service)?.label} · son geçerlilik {fmtDateShortTR(d.expiryDate)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, color: badgeColor, background: badgeBg }}>{label}</span>
                    {d.phone && (
                      <a href={smsHref(d.phone, expirySMS(d))} title="SMS gönder" style={{ background: NAVY, borderRadius: 8, padding: 7, display: "flex", color: "white" }}>
                        <Phone size={13} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {activeSlot && (
        <ApptModal
          slot={activeSlot}
          dateIso={key}
          validityYears={settings.validityYears || 5}
          existing={todaysAppts[activeSlot]}
          onClose={() => setActiveSlot(null)}
          onSave={(appt) => upsertAppointment(activeSlot, appt)}
          onDelete={() => removeAppointment(activeSlot)}
        />
      )}

      {showSettings && (
        <SettingsModal settings={settings} onClose={() => setShowSettings(false)} onSave={saveSettings} />
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: NAVY, color: "white", padding: "10px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 6 }}>
          <Check size={14} color={GOLD} /> {toast}
        </div>
      )}
    </div>
  );
}

const navBtn = { background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" };

function StatCard({ icon, label, value }) {
  return (
    <div style={{ flex: 1, background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "10px 10px", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>{icon}<span style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{label}</span></div>
      <div style={{ fontSize: 14, fontWeight: 800, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</div>
    </div>
  );
}

function ApptModal({ slot, dateIso, validityYears, existing, onClose, onSave, onDelete }) {
  const [clientName, setClientName] = useState(existing?.clientName || "");
  const [phone, setPhone] = useState(existing?.phone || "");
  const [service, setService] = useState(existing?.service || "ehliyet");
  const [price, setPrice] = useState(existing?.price ?? "");
  const [payStatus, setPayStatus] = useState(existing?.payStatus || "bekliyor");
  const [paidAmount, setPaidAmount] = useState(existing?.paidAmount ?? "");
  const [note, setNote] = useState(existing?.note || "");
  const [documentIssued, setDocumentIssued] = useState(existing?.documentIssued || false);
  const [issueDate, setIssueDate] = useState(existing?.issueDate || dateIso);
  const [error, setError] = useState("");

  const expiryPreview = documentIssued && issueDate ? addYears(issueDate, validityYears) : null;

  function handleSave() {
    if (!clientName.trim()) { setError("Ad soyad gerekli."); return; }
    if (price === "" || isNaN(Number(price)) || Number(price) < 0) { setError("Geçerli bir ücret girin."); return; }
    onSave({
      clientName: clientName.trim(),
      phone: phone.trim(),
      service,
      price: Number(price),
      payStatus,
      paidAmount: payStatus === "kismi" ? Number(paidAmount || 0) : undefined,
      note: note.trim(),
      documentIssued,
      issueDate: documentIssued ? issueDate : undefined,
      expiryDate: documentIssued ? addYears(issueDate, validityYears) : undefined,
    });
  }

  const canSendReminder = phone.trim().length > 0;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={sheetStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={16} color={GOLD} />
            <span style={{ fontWeight: 800, fontSize: 15, color: NAVY }}>{slot} Randevusu</span>
          </div>
          <button onClick={onClose} style={iconBtnStyle}><X size={18} color={NAVY} /></button>
        </div>

        <Field label="Ad Soyad">
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Örn. Ahmet Yılmaz" style={inputStyle} />
        </Field>
        <Field label="Telefon">
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05xx xxx xx xx" style={inputStyle} />
        </Field>
        <Field label="Hizmet Türü">
          <select value={service} onChange={(e) => setService(e.target.value)} style={inputStyle}>
            {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="Ücret (₺)">
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" style={inputStyle} />
        </Field>
        <Field label="Ödeme Durumu">
          <div style={{ display: "flex", gap: 6 }}>
            {Object.entries(PAY_STATUS).map(([k, v]) => (
              <button key={k} onClick={() => setPayStatus(k)} style={{
                flex: 1, padding: "8px 6px", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer",
                border: payStatus === k ? `2px solid ${v.color}` : "1px solid #e3ded0",
                background: payStatus === k ? v.bg : "white", color: payStatus === k ? v.color : "#8a8474"
              }}>{v.label}</button>
            ))}
          </div>
        </Field>
        {payStatus === "kismi" && (
          <Field label="Ödenen Tutar (₺)">
            <input type="number" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} placeholder="0" style={inputStyle} />
          </Field>
        )}
        <Field label="Not (opsiyonel)">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Kurum, sevk vb." style={inputStyle} />
        </Field>

        <div style={{ background: "white", border: "1px solid #ece7d8", borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={documentIssued} onChange={(e) => setDocumentIssued(e.target.checked)} style={{ width: 16, height: 16 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Belge Teslim Edildi</span>
          </label>
          {documentIssued && (
            <div style={{ marginTop: 10 }}>
              <Field label="Belge Teslim Tarihi">
                <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} style={inputStyle} />
              </Field>
              <div style={{ fontSize: 12, color: "#8a8474" }}>
                Geçerlilik süresi <strong style={{ color: NAVY }}>{fmtDateShortTR(expiryPreview)}</strong> tarihinde sona erecek ({validityYears} yıl).
              </div>
            </div>
          )}
        </div>

        {error && <div style={{ color: "#B23B3B", fontSize: 12, marginBottom: 8, fontWeight: 600 }}>{error}</div>}

        {canSendReminder && (
          <a href={smsHref(phone, apptReminderSMS({ clientName: clientName.trim() || "Değerli Danışanımız" }, dateIso, slot))}
             style={{ ...ghostBtn, width: "100%", justifyContent: "center", marginBottom: 8, textDecoration: "none", boxSizing: "border-box" }}>
            <Phone size={14} /> Randevu SMS Hatırlatması Gönder
          </a>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          {existing && (
            <button onClick={onDelete} style={{ ...ghostBtn, color: "#B23B3B", borderColor: "#f0d3d3" }}>
              <Trash2 size={14} /> Sil
            </button>
          )}
          <button onClick={handleSave} style={{ ...primaryBtn, flex: 1 }}>
            <Check size={15} /> Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsModal({ settings, onClose, onSave }) {
  const [startHour, setStartHour] = useState(settings.startHour);
  const [endHour, setEndHour] = useState(settings.endHour);
  const [stepMin, setStepMin] = useState(settings.stepMin);
  const [validityYears, setValidityYears] = useState(settings.validityYears ?? 5);
  const [reminderWindowDays, setReminderWindowDays] = useState(settings.reminderWindowDays ?? 60);

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={sheetStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: NAVY }}>Ayarlar</span>
          <button onClick={onClose} style={iconBtnStyle}><X size={18} color={NAVY} /></button>
        </div>

        <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Çalışma Saatleri</div>
        <Field label="Başlangıç Saati">
          <input type="number" min={0} max={23} value={startHour} onChange={(e) => setStartHour(Number(e.target.value))} style={inputStyle} />
        </Field>
        <Field label="Bitiş Saati">
          <input type="number" min={1} max={24} value={endHour} onChange={(e) => setEndHour(Number(e.target.value))} style={inputStyle} />
        </Field>
        <Field label="Randevu Süresi (dakika)">
          <input type="number" min={10} step={5} value={stepMin} onChange={(e) => setStepMin(Number(e.target.value))} style={inputStyle} />
        </Field>

        <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, textTransform: "uppercase", letterSpacing: 0.6, margin: "16px 0 8px" }}>Belge Geçerliliği</div>
        <Field label="Belge Geçerlilik Süresi (yıl)">
          <input type="number" min={1} step={1} value={validityYears} onChange={(e) => setValidityYears(Number(e.target.value))} style={inputStyle} />
        </Field>
        <Field label="Kaç Gün Kala Hatırlatma Gösterilsin">
          <input type="number" min={1} step={5} value={reminderWindowDays} onChange={(e) => setReminderWindowDays(Number(e.target.value))} style={inputStyle} />
        </Field>

        <button onClick={() => onSave({ startHour, endHour, stepMin, validityYears, reminderWindowDays })} style={{ ...primaryBtn, width: "100%", marginTop: 6 }}>
          <Check size={15} /> Kaydet
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#8a8474", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
      {children}
    </div>
  );
}

const overlayStyle = { position: "fixed", inset: 0, background: "rgba(15,34,68,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50 };
const sheetStyle = { background: CREAM, width: "100%", maxWidth: 480, borderRadius: "20px 20px 0 0", padding: "20px 18px 24px", maxHeight: "88vh", overflowY: "auto" };
const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e3ded0", fontSize: 14, fontFamily: "inherit", color: NAVY, background: "white" };
const iconBtnStyle = { background: "white", border: "1px solid #ece7d8", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" };
const primaryBtn = { background: NAVY, color: "white", border: "none", borderRadius: 11, padding: "12px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 };
const ghostBtn = { background: "white", border: "1px solid #e3ded0", borderRadius: 11, padding: "12px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 };
