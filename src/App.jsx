import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Phone, X, Check, Clock, ChevronLeft, ChevronRight, Wallet, CalendarDays, AlertCircle, Trash2, Settings, Car, Users, Printer, Search, ArrowLeft } from "lucide-react";
import { supabase } from "./supabaseClient";

// Logo: buraya kendi logonuzun data URI'sini (veya barındırdığınız bir URL'yi) yapıştırın.
// Boş bırakılırsa varsayılan araba ikonu gösterilir.
const LOGO_URL = "data:image/jpeg;base64,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";

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
  { id: "psikoteknik_belgesi", label: "Psikoteknik Belgesi" },
  { id: "src", label: "SRC Sertifikası" },
  { id: "silah", label: "Silah Ruhsatı" },
  { id: "is_makinesi", label: "İş Makinesi Operatörlüğü" },
  { id: "diger", label: "Diğer" },
];

const PAY_METHODS = [
  { id: "nakit", label: "Nakit" },
  { id: "kredi_karti", label: "Kredi Kartı (Pos)" },
  { id: "eft_havale", label: "EFT/Havale" },
];

const TEST_RESULTS = {
  gecti: { label: "Geçti", color: "#3D7A5C", bg: "#E7F2ED" },
  kaldi: { label: "Kaldı", color: "#B23B3B", bg: "#FBEAEA" },
};

const APPT_STATUS = {
  bekliyor: { label: "Bekliyor", color: "#B2811F", bg: "#FBF2DF" },
  geldi: { label: "Teste Geldi", color: "#3D7A5C", bg: "#E7F2ED" },
  iptal: { label: "İptal", color: "#B23B3B", bg: "#FBEAEA" },
};

const REFERANS_SOURCES = [
  "İnternet / Google",
  "Sosyal Medya",
  "Tavsiye / Arkadaş",
  "Kurum / Sevk",
  "Tekrar Başvuru",
  "Diğer",
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
    extraInfo: row.extra_info || {},
    payMethod: row.pay_method || "nakit",
    testResult: row.test_result || "",
    apptStatus: row.appt_status || "bekliyor",
    referans: row.referans || "",
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
    pay_method: appt.payMethod || "nakit",
    test_result: appt.testResult || null,
    appt_status: appt.apptStatus || "bekliyor",
    referans: appt.referans || null,
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
              <img src={LOGO_URL} alt="Rota Psikoteknik" style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, objectFit: "cover" }} />
            ) : (
              <div style={{ width: 34, height: 34, borderRadius: "50%", border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Car size={16} color={GOLD} />
              </div>
            )}
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: 0.3 }}>ROTA PSİKOTEKNİK</div>
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
                        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{currency(appt.price)}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, color: PAY_STATUS[appt.payStatus].color, background: PAY_STATUS[appt.payStatus].bg }}>{PAY_STATUS[appt.payStatus].label}</span>
                          {appt.apptStatus && appt.apptStatus !== "bekliyor" && APPT_STATUS[appt.apptStatus] && (
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, color: APPT_STATUS[appt.apptStatus].color, background: APPT_STATUS[appt.apptStatus].bg }}>{APPT_STATUS[appt.apptStatus].label}</span>
                          )}
                          {appt.testResult && TEST_RESULTS[appt.testResult] && (
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, color: TEST_RESULTS[appt.testResult].color, background: TEST_RESULTS[appt.testResult].bg }}>{TEST_RESULTS[appt.testResult].label}</span>
                          )}
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
          onGoToTaahhutname={(data) => {
            setTaahhutClient({ clientName: data.clientName, phone: data.phone, extraInfo: data.extraInfo, visits: [] });
            setActiveSlot(null);
            setView("taahhutname");
          }}
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
          onChange={(e) => setQ(e.target.value)}
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
                  {v.referans && <span style={{ color: "#8a8474" }}> · {v.referans}</span>}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-end", flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, color: PAY_STATUS[v.payStatus].color, background: PAY_STATUS[v.payStatus].bg }}>
                  {PAY_STATUS[v.payStatus].label}
                </span>
                {v.testResult && TEST_RESULTS[v.testResult] && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, color: TEST_RESULTS[v.testResult].color, background: TEST_RESULTS[v.testResult].bg }}>
                    {TEST_RESULTS[v.testResult].label}
                  </span>
                )}
              </div>
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

  function setField(key, val) {
    setExtra((prev) => ({ ...prev, [key]: val }));
  }

  const companyName = "ROTA";

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

      <div className="no-print" style={{ background: "white", border: "1px solid #ece7d8", borderRadius: 14, padding: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#8a8474", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 10 }}>Temel Bilgiler</div>
        <Field label="Ad Soyad">
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Örn. Ahmet Yılmaz" style={inputStyle} />
        </Field>
        <Field label="Telefon">
          <input value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Tarih">
          <input type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} style={inputStyle} />
        </Field>

        <div style={{ fontSize: 11, fontWeight: 800, color: "#8a8474", textTransform: "uppercase", letterSpacing: 0.4, margin: "16px 0 10px" }}>Danışan Bilgi Kartı</div>
        {EXTRA_FIELDS.map((f) => (
          <Field key={f.key} label={f.label}>
            <input type={f.type || "text"} value={extra[f.key] || ""} onChange={(e) => setField(f.key, e.target.value)} style={inputStyle} />
          </Field>
        ))}

        <button onClick={() => window.print()} style={{ ...primaryBtn, width: "100%", marginTop: 10 }}>
          <Printer size={15} /> Her İki Belgeyi Yazdır
        </button>
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

function ApptModal({ slot, dateIso, validityYears, existing, onClose, onSave, onDelete, onGoToTaahhutname }) {
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
  const [payMethod, setPayMethod] = useState(existing?.payMethod || "nakit");
  const [testResult, setTestResult] = useState(existing?.testResult || "");
  const [apptStatus, setApptStatus] = useState(existing?.apptStatus || "bekliyor");
  const [referans, setReferans] = useState(existing?.referans || "");

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
      payMethod,
      testResult,
      apptStatus,
      referans,
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

        <Field label="Ödeme Şekli">
          <div style={{ display: "flex", gap: 6 }}>
            {PAY_METHODS.map((m) => (
              <button key={m.id} onClick={() => setPayMethod(m.id)} style={{
                flex: 1, padding: "8px 4px", borderRadius: 9, fontSize: 11, fontWeight: 700, cursor: "pointer",
                border: payMethod === m.id ? `2px solid ${NAVY}` : "1px solid #e3ded0",
                background: payMethod === m.id ? NAVY : "white", color: payMethod === m.id ? "white" : "#8a8474"
              }}>{m.label}</button>
            ))}
          </div>
        </Field>

        <Field label="Randevu Durumu">
          <div style={{ display: "flex", gap: 6 }}>
            {Object.entries(APPT_STATUS).map(([k, v]) => (
              <button key={k} onClick={() => setApptStatus(k)} style={{
                flex: 1, padding: "8px 4px", borderRadius: 9, fontSize: 11, fontWeight: 700, cursor: "pointer",
                border: apptStatus === k ? `2px solid ${v.color}` : "1px solid #e3ded0",
                background: apptStatus === k ? v.bg : "white", color: apptStatus === k ? v.color : "#8a8474"
              }}>{v.label}</button>
            ))}
          </div>
        </Field>

        <Field label="Test Sonucu">
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setTestResult(testResult === "gecti" ? "" : "gecti")} style={{
              flex: 1, padding: "8px 6px", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer",
              border: testResult === "gecti" ? `2px solid #3D7A5C` : "1px solid #e3ded0",
              background: testResult === "gecti" ? "#E7F2ED" : "white", color: testResult === "gecti" ? "#3D7A5C" : "#8a8474"
            }}>✓ Geçti</button>
            <button onClick={() => setTestResult(testResult === "kaldi" ? "" : "kaldi")} style={{
              flex: 1, padding: "8px 6px", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer",
              border: testResult === "kaldi" ? `2px solid #B23B3B` : "1px solid #e3ded0",
              background: testResult === "kaldi" ? "#FBEAEA" : "white", color: testResult === "kaldi" ? "#B23B3B" : "#8a8474"
            }}>✗ Kaldı</button>
            {testResult && <button onClick={() => setTestResult("")} style={{
              padding: "8px 10px", borderRadius: 9, fontSize: 11, fontWeight: 700, cursor: "pointer",
              border: "1px solid #e3ded0", background: "white", color: "#8a8474"
            }}>Temizle</button>}
          </div>
        </Field>

        <Field label="Referans / Nereden Geldi">
          <select value={referans} onChange={(e) => setReferans(e.target.value)} style={inputStyle}>
            <option value="">— Seçiniz —</option>
            {REFERANS_SOURCES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
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
                    onChange={(e) => setExtra(f.key, e.target.value)}
                    style={inputStyle}
                  />
                </Field>
              ))}
            </div>
          )}
        </div>

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

        {onGoToTaahhutname && clientName.trim() && (
          <button
            onClick={() => onGoToTaahhutname({ clientName: clientName.trim(), phone: phone.trim(), extraInfo })}
            style={{ ...ghostBtn, width: "100%", justifyContent: "center", marginBottom: 8, boxSizing: "border-box", color: NAVY, borderColor: GOLD }}
          >
            <Printer size={14} /> Taahhütnameye Aktar
          </button>
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
