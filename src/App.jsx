import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Phone, X, Check, Clock, ChevronLeft, ChevronRight, Wallet, CalendarDays, AlertCircle, Trash2, Settings, Car, Users, Printer, Search, ArrowLeft } from "lucide-react";
import { supabase } from "./supabaseClient";

// Logo: buraya kendi logonuzun data URI'sini (veya barındırdığınız bir URL'yi) yapıştırın.
// Boş bırakılırsa varsayılan araba ikonu gösterilir.
const LOGO_URL = "data:image/png;base64,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";

const TAAHHUTNAME_INTRO = (companyName) =>
  `${companyName} Psikoteknik Değerlendirme Merkezi'ne kendi isteğimle başvurdum.`;

const TAAHHUTNAME_BODY = [
  "Uygulamaya katılmadan önce bana Psikoteknik Değerlendirme konusunda sözlü bilgi verildi. Test esnasında T.C. Sağlık Bakanlığı tarafından yayınlanan 4 Sayılı Cetvel gereği görüntülerimin kaydedileceği, test cihazı tarafından fotoğraflarımın çekileceği bilgisi verildi. Uygulamanın bir bilgisayar testi olduğu, ardından psikolog ve 45 gün içinde psikiyatristle görüşme yapılacağı belirtildi. Şu anda alkol veya benzeri keyif verici maddelerin, psikolojik ve fizyolojik durumumu olumsuz etkileyecek reçeteli ve reçetesiz ilaçların etkisi altında olmadığımı, testler sırasında performansımı etkileyebilecek herhangi bir sağlık problemim, yorgunluk, uykusuzluk veya benzeri başka bir etkinin olmadığını kabul ederim.",
  "Bu uygulama sonunda elde edilen bulguları ve bu değerlendirmenin olumlu veya olumsuz tüm sonuçlarını peşinen kabul edeceğimi; test uygulamasını kendi isteğim ile yarıda bırakmam halinde psikoteknik değerlendirme hakkımı kaybetmiş olacağımı kabul ederim.",
  "Bu taahhütnameyi herhangi bir baskı altında olmadan kendi irademle okuyup imzaladığımı ve yukarıda bulunan bilgilerin doğruluğunu, bilgilerin hatalı olmasından kaynaklanacak sonuçlar nedeni ile uygulamayı yapan kuruluştan maddi herhangi bir zarar ziyan talebim olmayacağımı ve teste yukarıdaki tarihte katıldığımı taahhüt ederim.",
];

const KVKK_TEXT = (companyName) => [
  "Sayın Veri Sahibi;",
  `6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, gerçek bir kişinin kimliğini belirli ya da belirlenebilir bir hale getirmeye yarayan her türlü bilgi kişisel veri kapsamındadır. İşbu bağlamda, kişisel verileriniz ve özel nitelikli kişisel verileriniz; ${companyName} Psikoteknik değerlendirme merkezi tarafından Veri Sorumlusu sıfatıyla işlenecek, depolanacak, muhafaza edilecek, gerektiğinde güncellenecek, belirtilen haller ile mevzuat ve yasal sınırlar dahilinde 3.kişilere, Psikoteknik test sisteminin lisans ve yazılım kullanım hakkı sahibi ve norm güncelleme sorumlusu olan ilgili yazılım sağlayıcı firma ve bağlı bulunan İl Sağlık Müdürlüğü, T.C. Sağlık Bakanlığı ve resmi yazı ile talep edilmesi halinde diğer kamu kurum ve kuruluşlarına iletilmek üzere açıklanabilecek/aktarılabilecek ve KVK Kanunu'nda belirtilen şekillerde işlenebilecektir.`,
  `KVK Kanunu'nun 11. maddesi gereğince ${companyName} Psikoteknik Değerlendirme Merkezi'ne başvurarak, kişisel verilerinizin; a) İşlenip işlenmediğini öğrenme, b) İşlenmişse bilgi talep etme, c) İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, d) Yurt içinde veya yurt dışında aktarıldığı 3. kişileri bilme, e) Verileriniz eksik veya yanlış işlenmişse düzeltilmesini isteme, f) KVK Kanunu'nun 7. maddesi çerçevesinde silinmesini/yok edilmesini isteme, g) Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme hakkına sahipsiniz.`,
  "6698 sayılı Kişisel Verilerin Korunması Kanunu (\"Kişisel Veri Kanunu\") kapsamında; Psikoteknik uygulama ve araştırma Merkezi olarak veri sorumlusu sıfatıyla sizlere, gereken psikoteknik testleri yapmak doğrultusunda hizmet sunabilmek için, gerekli olan kişisel bilgilerinizi kaydederek arşivlerimizde saklayacağımızı, işleyeceğimizi, sizlere test hizmetini sunabilmemiz için Kimlik Bilgileriniz, ehliyet bilgileriniz, mesleki ve eğitim bilgilerinizi, yılda kat edilen kilometre bilgileriniz, kullanılan araç bilgileriniz, yapılan kaza bilgileriniz, daha önceki psikoteknik değerlendirme bilgileriniz, alınan trafik cezaları bilgileriniz, Psikoteknik test sonucunda elde edilecek test bulgularınızı, fotoğraf ve video kaydınızı ve diğer gerekli tüm bilgileri almak, kaydetmek, elektronik veya kağıt ortamında işleme dayanak olacak sürücü dosyasında bulunmak üzere tüm kayıt ve belgeleri düzenlemekle yükümlü olduğumuzu, mevzuat gereği T.C. Sağlık Bakanlığı ile bağlı sair birimler ancak bu kurumlar ile sınırlı olmamak üzere yetkili makamlar tarafından talep edilmesi, yetkili makamlar tarafından görevlendirilen kişiler tarafından ya da kurulan kurum ve benzeri sistemler kapsamında talep edilmesi halinde ya da tarafımıza yüklenen bildirim ve/veya raporlama yükümlülüğümüz kapsamında kişisel verilerinizin ilgili makamlar ve kişiler ile paylaşacağımızı bildiririz.",
  `Ben, (veri sahibinin adı-soyadı) yukarıda belirtilen Kişisel Verilerin Korunması ve İşlenmesi Hakkında Aydınlatma Metnini okuduğumu, anladığımı ve iş bu açık rıza formu ile KVKK ve ilgili mevzuatlar kapsamında yukarıda belirtilen kişisel verilerimin doğru olduğunu, paylaşmış olduğum bilgilerimin değişmesi halinde güncel bilgilerimi değişiklik tarihinden itibaren 1 hafta içerisinde merkeziniz ile paylaşacağımı, bu kişisel verilerimin tarafınızdan işlenmesi, korunması ve gerektiğinde yetkili kuruluş, kamu kurum ve kuruluşlarına aktarılmasına açıkça rıza gösterdiğimi kabul ve beyan ederim.`,
].join("\n\n");

// Taahhütname/KVKK formunda kullanılan danışan bilgi kartı alanları
const EXTRA_FIELDS = [
  { key: "kayitNo", label: "Kayıt No" },
  { key: "tcNo", label: "T.C. Kimlik No" },
  { key: "babaAdi", label: "Baba Adı" },
  { key: "dogumTarihi", label: "Doğum Tarihi", type: "date" },
  { key: "dogumYeri", label: "Doğum Yeri" },
  { key: "egitim", label: "Eğitim" },
  { key: "medeniHali", label: "Medeni Hali" },
  { key: "meslek", label: "Meslek" },
  { key: "gozlukYakin", label: "Gözlük Yakın No" },
  { key: "gozlukUzak", label: "Gözlük Uzak No" },
  { key: "renkKorlugu", label: "Renk Körlüğü" },
  { key: "isitmeCihazi", label: "İşitme Cihazı" },
  { key: "ozurlulukHali", label: "Özürlülük Hali" },
  { key: "ehliyetTipi", label: "Ehliyet Tipi" },
  { key: "ehliyetVerilis", label: "Ehliyet Veriliş Yeri/Tarihi" },
  { key: "ehliyetNo", label: "Ehliyet No" },
  { key: "testSebebi", label: "Test Sebebi" },
  { key: "trafikKazasi", label: "Trafik Kazası Yapmış mı?" },
  { key: "kazaNedeni", label: "Kaza Nedeni" },
  { key: "adliSuc", label: "Adli Suçu Var mı?" },
  { key: "son3YilKaza", label: "Son 3 Yıldaki Kaza Sayısı ve Nedeni" },
  { key: "alkol", label: "Alkol Kullanıyor mu?" },
  { key: "sigara", label: "Sigara Kullanıyor mu?" },
  { key: "adres", label: "Adres" },
];

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
  return `Sayın ${appt.clientName}, ${fmtDateShortTR(dateIso)} tarihinde saat ${slot}'de Rota'daki randevunuz onaylanmıştır. Bilgi için: Rota Psikoteknik`;
}
function expirySMS(appt) {
  return `Sayın ${appt.clientName}, ${fmtDateShortTR(appt.issueDate)} tarihinde aldığınız psikoteknik belgenizin geçerlilik süresi ${fmtDateShortTR(appt.expiryDate)} tarihinde sona ermektedir. Yenileme randevusu için bizi arayabilirsiniz. Rota`;
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
    extraInfo: row.extra_info || {},
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
    extra_info: appt.extraInfo || {},
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
  const [allAppts, setAllAppts] = useState([]);
  const [view, setView] = useState("takvim"); // "takvim" | "danisanlar" | "taahhutname"
  const [taahhutClient, setTaahhutClient] = useState(null);
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
    const all = [];
    (data || []).forEach((row) => {
      const appt = rowToAppt(row);
      const withMeta = { ...appt, date: row.date, slot: row.slot };
      all.push(withMeta);
      if (appt.payStatus !== "odendi") unpaid.push(withMeta);
      if (appt.documentIssued && appt.issueDate) documented.push(withMeta);
    });
    setPendingList(unpaid);
    setAllDocuments(documented);
    setAllAppts(all);
    setPendingLoading(false);
  }, []);

  const clients = useMemo(() => {
    const map = {};
    allAppts.forEach((a) => {
      const name = (a.clientName || "").trim();
      if (!name) return;
      if (!map[name]) map[name] = { clientName: name, phone: "", visits: [], totalPaid: 0, totalPending: 0, documents: [] };
      const c = map[name];
      if (a.phone) c.phone = a.phone;
      c.visits.push(a);
      if (a.payStatus === "odendi") c.totalPaid += a.price;
      else if (a.payStatus === "kismi") { c.totalPaid += (a.paidAmount || 0); c.totalPending += Math.max(a.price - (a.paidAmount || 0), 0); }
      else c.totalPending += a.price;
      if (a.documentIssued && a.issueDate) c.documents.push(a);
    });
    const list = Object.values(map);
    list.forEach((c) => {
      c.visits.sort((x, y) => (y.date + y.slot).localeCompare(x.date + x.slot));
      // En güncelden en eskiye doğru gidip boş olmayan alanları birleştir
      const merged = {};
      for (let i = c.visits.length - 1; i >= 0; i--) {
        const ei = c.visits[i].extraInfo || {};
        Object.entries(ei).forEach(([k, v]) => { if (v) merged[k] = v; });
      }
      c.extraInfo = merged;
    });
    list.sort((a, b) => a.clientName.localeCompare(b.clientName, "tr"));
    return list;
  }, [allAppts]);

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
            {LOGO_URL ? (
              <img src={LOGO_URL} alt="Rota" style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, objectFit: "cover" }} />
            ) : (
              <div style={{ width: 34, height: 34, borderRadius: "50%", border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Car size={16} color={GOLD} />
              </div>
            )}
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: 0.3 }}>ROTA</div>
              <div style={{ fontSize: 10, color: GOLD, letterSpacing: 1.2, fontWeight: 600 }}>RANDEVU &amp; ÖDEME TAKİBİ</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setView(view === "danisanlar" ? "takvim" : "danisanlar")} style={{ background: view === "danisanlar" ? GOLD : "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: 9, color: view === "danisanlar" ? NAVY : "white", cursor: "pointer" }} title="Danışanlar">
              <Users size={17} />
            </button>
            <button onClick={() => { setTaahhutClient(null); setView(view === "taahhutname" ? "takvim" : "taahhutname"); }} style={{ background: view === "taahhutname" ? GOLD : "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: 9, color: view === "taahhutname" ? NAVY : "white", cursor: "pointer" }} title="Taahhütname">
              <Printer size={17} />
            </button>
            <button onClick={() => setShowSettings(true)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: 9, color: "white", cursor: "pointer" }}>
              <Settings size={17} />
            </button>
          </div>
        </div>

        {view === "takvim" && (
          <>
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
          </>
        )}
        {view === "danisanlar" && (
          <div style={{ marginTop: 18, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>Tüm danışanlarınız ve geçmiş randevuları</div>
        )}
        {view === "taahhutname" && (
          <div style={{ marginTop: 18, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>Yazdırılabilir taahhütname belgesi</div>
        )}
      </div>

      {view === "danisanlar" && (
        <ClientsView clients={clients} onOpenTaahhutname={(c) => { setTaahhutClient(c); setView("taahhutname"); }} />
      )}

      {view === "taahhutname" && (
        <TaahhutnameView prefill={taahhutClient} onBack={() => setView(taahhutClient ? "danisanlar" : "takvim")} />
      )}

      {view === "takvim" && (
      <>
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
      </>
      )}

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

function ClientsView({ clients, onOpenTaahhutname }) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLocaleLowerCase("tr");
    if (!term) return clients;
    return clients.filter((c) => c.clientName.toLocaleLowerCase("tr").includes(term));
  }, [clients, q]);

  return (
    <div style={{ maxWidth: 640, margin: "18px auto 0", padding: "0 16px 32px" }}>
      <div style={{ position: "relative", marginBottom: 14 }}>
        <Search size={15} color="#8a8474" style={{ position: "absolute", left: 12, top: 12 }} />
        <input
          value={q}
          onChange={(e)) => /> setQ(e.target.value)}
          placeholder="Danışan ara..."
          style={{ ...inputStyle, paddingLeft: 34 }}
        />
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: "white", borderRadius: 14, border: "1px solid #ece7d8", padding: 16, fontSize: 13, color: "#8a8474" }}>
          {clients.length === 0 ? "Henüz danışan kaydı yok." : "Eşleşen danışan bulunamadı."}
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: 14, border: "1px solid #ece7d8", overflow: "hidden" }}>
          {filtered.map((c, i) => (
            <button
              key={c.clientName}
              onClick={() => setSelected(c)}
              style={{
                width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
                padding: "12px 14px", borderTop: i === 0 ? "none" : "1px solid #f0ece0",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8
              }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{c.clientName}</div>
                <div style={{ fontSize: 11, color: "#8a8474", marginTop: 1 }}>
                  {c.visits.length} randevu{c.phone ? ` · ${c.phone}` : ""}
                </div>
              </div>
              {c.totalPending > 0 && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, color: PAY_STATUS.bekliyor.color, background: PAY_STATUS.bekliyor.bg, flexShrink: 0 }}>
                  {currency(c.totalPending)} bekliyor
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <ClientDetailModal
          client={selected}
          onClose={() => setSelected(null)}
          onTaahhutname={() => { onOpenTaahhutname(selected); setSelected(null); }}
        />
      )}
    </div>
  );
}

function ClientDetailModal({ client, onClose, onTaahhutname }) {
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={sheetStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: NAVY }}>{client.clientName}</span>
          <button onClick={onClose} style={iconBtnStyle}><X size={18} color={NAVY} /></button>
        </div>

        {client.phone && (
          <div style={{ fontSize: 13, color: "#8a8474", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
            <Phone size={13} /> {client.phone}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
          <div style={{ flex: 1, background: "#E7F2ED", borderRadius: 10, padding: "8px 10px" }}>
            <div style={{ fontSize: 10, color: "#3D7A5C", fontWeight: 700 }}>TAHSİL EDİLEN</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#3D7A5C" }}>{currency(client.totalPaid)}</div>
          </div>
          <div style={{ flex: 1, background: "#FBEAEA", borderRadius: 10, padding: "8px 10px" }}>
            <div style={{ fontSize: 10, color: "#B23B3B", fontWeight: 700 }}>BEKLEYEN</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#B23B3B" }}>{currency(client.totalPending)}</div>
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 800, color: "#8a8474", textTransform: "uppercase", letterSpacing: 0.4, margin: "14px 0 6px" }}>Randevu Geçmişi</div>
        <div style={{ border: "1px solid #ece7d8", borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
          {client.visits.map((v, i) => (
            <div key={v.date + v.slot} style={{ padding: "9px 12px", borderTop: i === 0 ? "none" : "1px solid #f0ece0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{fmtDateShortTR(v.date)} · {v.slot}</div>
                <div style={{ fontSize: 11, color: "#8a8474" }}>
                  {SERVICES.find(s => s.id === v.service)?.label || v.service}
                  {v.documentIssued && <span style={{ color: "#B2811F", fontWeight: 700 }}> · Belge Verildi</span>}
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, color: PAY_STATUS[v.payStatus].color, background: PAY_STATUS[v.payStatus].bg, flexShrink: 0 }}>
                {PAY_STATUS[v.payStatus].label}
              </span>
            </div>
          ))}
        </div>

        <button onClick={onTaahhutname} style={{ ...primaryBtn, width: "100%" }}>
          <Printer size={15} /> Taahhütname Hazırla
        </button>
      </div>
    </div>
  );
}

function TaahhutnameView({ prefill, onBack }) {
  const pv = prefill?.visits?.[0];
  const [clientName, setClientName] = useState(prefill?.clientName || "");
  const [phone, setPhone] = useState(prefill?.phone || "");
  const [extra, setExtra] = useState(prefill?.extraInfo || {});
  const [docDate, setDocDate] = useState(() => dateKey(new Date()));
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [savedData, setSavedData] = useState(null);

  function setField(key, val) {
    setExtra((prev) => ({ ...prev, [key]: val }));
  }

  function handleSave() {
    setSavedData({ clientName, phone, extra, docDate });
    setSaved(true);
    setEditMode(false);
  }

  function handleEdit() {
    setEditMode(true);
    setSaved(false);
  }

  function handleDelete() {
    if (!window.confirm("Bu taahhütnameyi silmek istediğinizden emin misiniz?")) return;
    setClientName("");
    setPhone("");
    setExtra({});
    setDocDate(dateKey(new Date()));
    setSaved(false);
    setEditMode(true);
    setSavedData(null);
  }

  const companyName = "ROTA PSİKOTEKNİK";

  return (
    <div style={{ maxWidth: 640, margin: "18px auto 0", padding: "0 16px 40px" }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #taahhutname-print, #taahhutname-print * { visibility: visible; }
          #taahhutname-print { position: absolute; top: 0; left: 0; width: 100%; padding: 0; }
          .no-print { display: none !important; }
          .print-page { page-break-after: always; padding: 24px; }
        }
      `}</style>

      <button onClick={onBack} className="no-print" style={{ ...ghostBtn, marginBottom: 14 }}>
        <ArrowLeft size={14} /> Geri
      </button>

      {saved && !editMode && (
        <div className="no-print" style={{ background: "#E7F2ED", border: "1px solid #b2d9c5", borderRadius: 12, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Check size={15} color="#3D7A5C" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#3D7A5C" }}>Taahhütname kaydedildi</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={handleEdit} style={{ background: NAVY, color: "white", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              ✏️ Düzenle
            </button>
            <button onClick={handleDelete} style={{ background: "#FBEAEA", color: "#B23B3B", border: "1px solid #f0d3d3", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              <Trash2 size={13} /> Sil
            </button>
          </div>
        </div>
      )}

      <div className="no-print" style={{ background: "white", border: "1px solid #ece7d8", borderRadius: 14, padding: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#8a8474", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 10 }}>Temel Bilgiler</div>
        <Field label="Ad Soyad">
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Örn. Ahmet Yılmaz" style={{ ...inputStyle, background: editMode ? "white" : "#f7f5f0", pointerEvents: editMode ? "auto" : "none" }} readOnly={!editMode} />
        </Field>
        <Field label="Telefon">
          <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ ...inputStyle, background: editMode ? "white" : "#f7f5f0", pointerEvents: editMode ? "auto" : "none" }} readOnly={!editMode} />
        </Field>
        <Field label="Tarih">
          <input type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} style={{ ...inputStyle, background: editMode ? "white" : "#f7f5f0", pointerEvents: editMode ? "auto" : "none" }} readOnly={!editMode} />
        </Field>

        <div style={{ fontSize: 11, fontWeight: 800, color: "#8a8474", textTransform: "uppercase", letterSpacing: 0.4, margin: "16px 0 10px" }}>Danışan Bilgi Kartı</div>
        {EXTRA_FIELDS.map((f) => (
          <Field key={f.key} label={f.label}>
            <input type={f.type || "text"} value={extra[f.key] || ""} onChange={(e) => setField(f.key, e.target.value)} style={{ ...inputStyle, background: editMode ? "white" : "#f7f5f0", pointerEvents: editMode ? "auto" : "none" }} readOnly={!editMode} />
          </Field>
        ))}

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {editMode && (
            <button onClick={handleSave} style={{ ...primaryBtn, flex: 1 }}>
              <Check size={15} /> Kaydet
            </button>
          )}
          {!editMode && (
            <button onClick={handleEdit} style={{ ...ghostBtn, flex: 1, justifyContent: "center" }}>
              ✏️ Düzenle
            </button>
          )}
          <button onClick={() => window.print()} style={{ ...primaryBtn, flex: 1 }}>
            <Printer size={15} /> Yazdır
          </button>
        </div>
        {saved && !editMode && (
          <button onClick={handleDelete} style={{ ...ghostBtn, width: "100%", marginTop: 8, justifyContent: "center", color: "#B23B3B", borderColor: "#f0d3d3" }}>
            <Trash2 size={14} /> Taahhütnameyi Sil
          </button>
        )}
      </div>

      <div id="taahhutname-print">
        {/* Sayfa 1: EK 2 Psikoteknik Değerlendirme Taahhütnamesi */}
        <div className="print-page" style={{ background: "white", border: "1px solid #ece7d8", borderRadius: 14, padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            {LOGO_URL && <img src={LOGO_URL} alt="logo" style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover" }} />}
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: NAVY }}>{companyName}</div>
              <div style={{ fontSize: 10, color: "#8a8474", letterSpacing: 0.6 }}>PSİKOTEKNİK DEĞERLENDİRME MERKEZİ</div>
            </div>
          </div>

          <div style={{ textAlign: "center", fontWeight: 800, fontSize: 15, color: NAVY, marginBottom: 4 }}>EK 2) PSİKOTEKNİK DEĞERLENDİRME TAAHHÜTNAMESİ</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: NAVY, margin: "10px 0 16px" }}>
            <span><strong>Kayıt No:</strong> {extra.kayitNo || "…………"}</span>
            <span><strong>Tarih:</strong> {fmtDateShortTR(docDate)}</span>
          </div>

          <InfoTable
            title="ADAYA İLİŞKİN KİMLİK BİLGİLERİ"
            rows={[
              ["T.C. Kimlik No", extra.tcNo],
              ["Adı-Soyadı", clientName],
              ["Baba Adı", extra.babaAdi],
              ["Doğum Tarihi", fmtDateShortTR(extra.dogumTarihi) || extra.dogumTarihi],
              ["Doğum Yeri", extra.dogumYeri],
            ]}
          />

          <InfoTable
            title="ADAYA İLİŞKİN DİĞER BİLGİLER"
            rows={[
              ["Eğitim", extra.egitim],
              ["Medeni Hali", extra.medeniHali],
              ["Meslek", extra.meslek],
              ["Gözlük Kullanımı (Yakın/Uzak No)", [extra.gozlukYakin, extra.gozlukUzak].filter(Boolean).join(" / ")],
              ["Renk Körlüğü", extra.renkKorlugu],
              ["İşitme Cihazı", extra.isitmeCihazi],
              ["Özürlülük Hali", extra.ozurlulukHali],
              ["Ehliyet Tipi", extra.ehliyetTipi],
              ["Ehliyet Veriliş Yeri/Tarihi", extra.ehliyetVerilis],
              ["Ehliyet No", extra.ehliyetNo],
              ["Test Sebebi", extra.testSebebi],
              ["Trafik Kazası Yapmış mı? / Kaza Nedeni", [extra.trafikKazasi, extra.kazaNedeni].filter(Boolean).join(" / ")],
              ["Adli Suçu Var mı?", extra.adliSuc],
              ["Son 3 Yıldaki Kaza Sayısı ve Nedeni", extra.son3YilKaza],
              ["Alkol Kullanıyor mu?", extra.alkol],
              ["Sigara Kullanıyor mu?", extra.sigara],
              ["Adres", extra.adres],
              ["Telefon", phone],
            ]}
          />

          <div style={{ fontSize: 12, color: "#2a2a2a", lineHeight: 1.7, marginTop: 18 }}>
            <p>{TAAHHUTNAME_INTRO(companyName)}</p>
            {TAAHHUTNAME_BODY.map((p, i) => <p key={i} style={{ marginTop: 10 }}>{p}</p>)}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 40 }}>
            <div style={{ textAlign: "center", fontSize: 12, color: NAVY }}>
              <div>{clientName || "…………………………………"} – {fmtDateShortTR(docDate)}</div>
              <div style={{ borderTop: "1px solid #ccc", width: 180, marginTop: 34, paddingTop: 4, color: "#8a8474" }}>Ad-Soyad – Tarih – Saat – İmza</div>
            </div>
          </div>
        </div>

        {/* Sayfa 2: KVKK Rıza Beyanı */}
        <div className="print-page" style={{ background: "white", border: "1px solid #ece7d8", borderRadius: 14, padding: 28 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: NAVY, marginBottom: 16 }}>
            KİŞİSEL VERİLERİN İŞLENMESİNE, KULLANIMINA VE PAYLAŞIMINA DAİR RIZA BEYANI
          </div>
          <div style={{ fontSize: 11.5, color: "#2a2a2a", lineHeight: 1.65, whiteSpace: "pre-line" }}>
            {KVKK_TEXT(companyName)}
          </div>
          <div style={{ marginTop: 24, fontSize: 12, color: NAVY }}>
            <div style={{ fontWeight: 700 }}>{clientName || "…………………………………"}</div>
            <div style={{ marginTop: 18 }}>Tarih: {fmtDateShortTR(docDate)}</div>
            <div style={{ marginTop: 18 }}>İmza:</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoTable({ title, rows }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: NAVY, marginBottom: 4 }}>{title}:</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <td style={{ border: "1px solid #ccc", padding: "5px 8px", width: "42%", color: "#444", background: "#faf9f6" }}>{label}</td>
              <td style={{ border: "1px solid #ccc", padding: "5px 8px", color: NAVY }}>{value || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
  const [extraInfo, setExtraInfo] = useState(existing?.extraInfo || {});
  const [extraOpen, setExtraOpen] = useState(false);
  const [error, setError] = useState("");

  function setExtra(key, val) {
    setExtraInfo((prev) => ({ ...prev, [key]: val }));
  }

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
      extraInfo,
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
          <input value={clientName} onChange={(e)) => setClientName(e.target.value)} placeholder="Örn. Ahmet Yılmaz" style={inputStyle} />
        </Field>
        <Field label="Telefon">
          <input value={phone} onChange={(e)) => setPhone(e.target.value)} placeholder="05xx xxx xx xx" style={inputStyle} />
        </Field>
        <Field label="Hizmet Türü">
          <select value={service} onChange={(e) => setService(e.target.value)} style={inputStyle}>
            {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="Ücret (₺)">
          <input type="number" value={price} onChange={(e)) => setPrice(e.target.value)} placeholder="0" style={inputStyle} />
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
            <input type="number" value={paidAmount} onChange={(e)) => setPaidAmount(e.target.value)} placeholder="0" style={inputStyle} />
          </Field>
        )}
        <Field label="Not (opsiyonel)">
          <input value={note} onChange={(e)) => setNote(e.target.value)} placeholder="Kurum, sevk vb." style={inputStyle} />
        </Field>

        <div style={{ background: "white", border: "1px solid #ece7d8", borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <button
            onClick={() => setExtraOpen((v) => !v)}
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0 }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Danışan Bilgi Kartı (Taahhütname İçin)</span>
            <span style={{ fontSize: 11, color: GOLD, fontWeight: 700 }}>{extraOpen ? "Gizle" : "Genişlet"}</span>
          </button>
          {extraOpen && (
            <div style={{ marginTop: 12 }}>
              {EXTRA_FIELDS.map((f) => (
                <Field key={f.key} label={f.label}>
                  <input
                    type={f.type || "text"}
                    value={extraInfo[f.key] || ""}
                    onChange={(e)) => /> setExtra(f.key, e.target.value)}
                    style={inputStyle}
                  />
                </Field>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: "white", border: "1px solid #ece7d8", borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={documentIssued} onChange={(e)) => setDocumentIssued(e.target.checked)} style={{ width: 16, height: 16 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Belge Teslim Edildi</span>
          </label>
          {documentIssued && (
            <div style={{ marginTop: 10 }}>
              <Field label="Belge Teslim Tarihi">
                <input type="date" value={issueDate} onChange={(e)) => setIssueDate(e.target.value)} style={inputStyle} />
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
          <input type="number" min={0} max={23} value={startHour} onChange={(e)) => setStartHour(Number(e.target.value))} style={inputStyle} />
        </Field>
        <Field label="Bitiş Saati">
          <input type="number" min={1} max={24} value={endHour} onChange={(e)) => setEndHour(Number(e.target.value))} style={inputStyle} />
        </Field>
        <Field label="Randevu Süresi (dakika)">
          <input type="number" min={10} step={5} value={stepMin} onChange={(e)) => setStepMin(Number(e.target.value))} style={inputStyle} />
        </Field>

        <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, textTransform: "uppercase", letterSpacing: 0.6, margin: "16px 0 8px" }}>Belge Geçerliliği</div>
        <Field label="Belge Geçerlilik Süresi (yıl)">
          <input type="number" min={1} step={1} value={validityYears} onChange={(e)) => setValidityYears(Number(e.target.value))} style={inputStyle} />
        </Field>
        <Field label="Kaç Gün Kala Hatırlatma Gösterilsin">
          <input type="number" min={1} step={5} value={reminderWindowDays} onChange={(e)) => setReminderWindowDays(Number(e.target.value))} style={inputStyle} />
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
