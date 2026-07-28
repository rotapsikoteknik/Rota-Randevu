import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Phone, X, Check, Clock, ChevronLeft, ChevronRight, Wallet, CalendarDays, AlertCircle, Trash2, Settings, Car, Users, Printer, Search, ArrowLeft, BarChart2, TrendingUp, Filter } from "lucide-react";
import { supabase } from "./supabaseClient";

// Logo: buraya kendi logonuzun data URI'sini (veya barındırdığınız bir URL'yi) yapıştırın.
// Boş bırakılırsa varsayılan araba ikonu gösterilir.
const LOGO_URL = "data:image/png;base64,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mWc+/PDD9957b8eOHW+44Yb9+/dns9lisai1NsbE127cuDFepe/7WutCodCvX794H6MoiqIoDMM4i7jttts2b948bdq0bDabTCZ9389kMtls9tRTT423ftu2bbEXiCsKADx6xJB25YkgDFEwI5IGz6GN23Zv2LSNUAIASiAAsARsGQA+37Rz376DSkoABEBAGZWK5ZVlJwweRCQ8122F4Yhaa6XU/v37p06dGqto165dx4wZ065du65du/70pz89/fTTb7zxxoaGhmQyWSqV4nDCzK+//nptbW0URcuWLVuyZAkzV1VVxXYR4xDP8xDxxhtvfP/99++4447q6urYHSSTyVQq5XleTU2NUoqZm5tzuZYWBEMAhKSN6d694wlH9wvyTVI4BAhsBGKupJet3QIAbCJAIkDm2AUBLFu7xYQRCsmCEYiktC2HBvTq3KF9+xAsYJxMseVWRDVr1qwuXbqMHj06DMN+/foppdLpdDqd1lpfeumlxx133JVXXrlx48Z0Op1MJo0xM2bMiKLoqKOOchxn/vz5kyZNqq6uTqVSscDGmHQ6vXfv3h/+8IfLli27++67e/bsKaVMJBLJZHLdunUPPPDAXXfdNX/+/CAIMpnMqFEjo6BoARgFIFpGJcWIYYOQI0CBQEzAQOSllq/fElfoULNsLaggM8C6jduABKNANJYQJIKOhp80sl1FRRQFrK0FEEKytY7j7Nq1a+3atT/96U8PHjy4ffv2fv36bd++PZFIKKWklNbaq666CgCmTp1aW1vred7atWsRccaMGTH2vPrqqwcOHHjKKadoraMo8jzP9/0FCxbce++93bt3v//++6uqquLYBgDPPPPMPffc0759+0wms3Dhwqeeeuq2224bMGDAgQP7S6UokVBWa2KD6J40ckj2T0sCNnF7lQmUn/5i575iEPmuwqBJMgIyoMCmyGzfdRCUBI4bkqg1q6ouG+rMu59vGdi7czrpOgAAEAWhkt6WLVu6du1aW1uLiMuXL58wYYLruvl8PpVKISIRlUqlSZMmDRgw4Pnnn9+wYcOxxx47YcKEbt26AQAR9e7du2vXrlprRCwvL9+5c+dvfvObhQsXnnfeeRdffLHjODHkWLNmTalUmjVr1iWXXBL76l27dj311FPXXXfdY4891qFjp6b6+oSnhFQAcmtdy0ertzqJZDFvCAmBAVh5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";

const TAAHHUTNAME_INTRO = (companyName) =>
  `${companyName} Psikoteknik Değerlendirme Merkezi'ne kendi isteğimle başvurdum.`;

const TAAHHUTNAME_BODY = [
  "Uygulamaya katılmadan önce bana Psikoteknik Değerlendirme konusunda sözlü bilgi verildi. Test esnasında T.C. Sağlık Bakanlığı tarafından yayınlanan 4 Sayılı Cetvel gereği görüntülerimin kaydedileceği, test cihazı tarafından fotoğraflarımın çekileceği bilgisi verildi. Uygulamanın bir bilgisayar testi olduğu, ardından psikolog ve 45 gün içinde psikiyatristle görüşme yapılacağı belirtildi. Şu anda alkol veya benzeri keyif verici maddelerin, psikolojik ve fizyolojik durumumu olumsuz etkileyecek reçeteli ve reçetesiz ilaçların etkisi altında olmadığımı, testler sırasında performansımı etkileyebilecek herhangi bir sağlık problemim, yorgunluk, uykusuzluk veya benzeri başka bir etkinin olmadığını kabul ederim.",
  "Bu uygulama sonunda elde edilen bulguları ve bu değerlendirmenin olumlu veya olumsuz tüm sonuçlarını peşinen kabul edeceğimi; test uygulamasını kendi isteğim ile yarıda bırakmam halinde psikoteknik değerlendirme hakkımı kaybetmiş olacağımı kabul ederim.",
  "Bu taahhütnameyi herhangi bir baskı altında olmadan kendi irademle okuyup imzaladığımı ve yukarıda bulunan bilgilerin doğruluğunu, bilgilerin hatalı olmasından kaynaklanacak sonuçlar nedeni ile uygulamayı yapan kuruluştan maddi herhangi bir zarar ziyan talebim olmayacağımı ve teste yukarıdaki tarihte katıldığımı taahhüt ederim.",
];

const KVKK_TEXT = (companyName, clientName) => [
  "Sayın Veri Sahibi;",
  `6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, gerçek bir kişinin kimliğini belirli ya da belirlenebilir bir hale getirmeye yarayan her türlü bilgi kişisel veri kapsamındadır. İşbu bağlamda, kişisel verileriniz ve özel nitelikli kişisel verileriniz; ${companyName} Psikoteknik değerlendirme merkezi tarafından Veri Sorumlusu sıfatıyla işlenecek, depolanacak, muhafaza edilecek, gerektiğinde güncellenecek, belirtilen haller ile mevzuat ve yasal sınırlar dahilinde 3.kişilere, Psikoteknik test sisteminin lisans ve yazılım kullanım hakkı sahibi ve norm güncelleme sorumlusu olan ilgili yazılım sağlayıcı firma ve bağlı bulunan İl Sağlık Müdürlüğü, T.C. Sağlık Bakanlığı ve resmi yazı ile talep edilmesi halinde diğer kamu kurum ve kuruluşlarına iletilmek üzere açıklanabilecek/aktarılabilecek ve KVK Kanunu'nda belirtilen şekillerde işlenebilecektir.`,
  `KVK Kanunu'nun 11. maddesi gereğince ${companyName} Psikoteknik Değerlendirme Merkezi'ne başvurarak, kişisel verilerinizin; a) İşlenip işlenmediğini öğrenme, b) İşlenmişse bilgi talep etme, c) İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, d) Yurt içinde veya yurt dışında aktarıldığı 3. kişileri bilme, e) Verileriniz eksik veya yanlış işlenmişse düzeltilmesini isteme, f) KVK Kanunu'nun 7. maddesi çerçevesinde silinmesini/yok edilmesini isteme, g) Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme hakkına sahipsiniz.`,
  "6698 sayılı Kişisel Verilerin Korunması Kanunu (\"Kişisel Veri Kanunu\") kapsamında; Psikoteknik uygulama ve araştırma Merkezi olarak veri sorumlusu sıfatıyla sizlere, gereken psikoteknik testleri yapmak doğrultusunda hizmet sunabilmek için, gerekli olan kişisel bilgilerinizi kaydederek arşivlerimizde saklayacağımızı, işleyeceğimizi, sizlere test hizmetini sunabilmemiz için Kimlik Bilgileriniz, ehliyet bilgileriniz, mesleki ve eğitim bilgilerinizi, yılda kat edilen kilometre bilgileriniz, kullanılan araç bilgileriniz, yapılan kaza bilgileriniz, daha önceki psikoteknik değerlendirme bilgileriniz, alınan trafik cezaları bilgileriniz, Psikoteknik test sonucunda elde edilecek test bulgularınızı, fotoğraf ve video kaydınızı ve diğer gerekli tüm bilgileri almak, kaydetmek, elektronik veya kağıt ortamında işleme dayanak olacak sürücü dosyasında bulunmak üzere tüm kayıt ve belgeleri düzenlemekle yükümlü olduğumuzu, mevzuat gereği T.C. Sağlık Bakanlığı ile bağlı sair birimler ancak bu kurumlar ile sınırlı olmamak üzere yetkili makamlar tarafından talep edilmesi, yetkili makamlar tarafından görevlendirilen kişiler tarafından ya da kurulan kurum ve benzeri sistemler kapsamında talep edilmesi halinde ya da tarafımıza yüklenen bildirim ve/veya raporlama yükümlülüğümüz kapsamında kişisel verilerinizin ilgili makamlar ve kişiler ile paylaşacağımızı bildiririz.",
  `Ben, ${clientName || "(veri sahibinin adı-soyadı)"} yukarıda belirtilen Kişisel Verilerin Korunması ve İşlenmesi Hakkında Aydınlatma Metnini okuduğumu, anladığımı ve iş bu açık rıza formu ile KVKK ve ilgili mevzuatlar kapsamında yukarıda belirtilen kişisel verilerimin doğru olduğunu, paylaşmış olduğum bilgilerimin değişmesi halinde güncel bilgilerimi değişiklik tarihinden itibaren 1 hafta içerisinde merkeziniz ile paylaşacağımı, bu kişisel verilerimin tarafınızdan işlenmesi, korunması ve gerektiğinde yetkili kuruluş, kamu kurum ve kuruluşlarına aktarılmasına açıkça rıza gösterdiğimi kabul ve beyan ederim.`,
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
  { id: "psikoteknik_belgesi", label: "Psikoteknik Belgesi" },
  { id: "ehliyet", label: "Sürücü Belgesi (Ehliyet)" },
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
  const [view, setView] = useState("takvim"); // "takvim" | "danisanlar" | "taahhutname" | "rapor" | "muhasebe"
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
            <button onClick={() => setView(view === "rapor" ? "takvim" : "rapor")} style={{ background: view === "rapor" ? GOLD : "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: 9, color: view === "rapor" ? NAVY : "white", cursor: "pointer" }} title="Raporlar">
              <Filter size={17} />
            </button>
            <button onClick={() => setView(view === "muhasebe" ? "takvim" : "muhasebe")} style={{ background: view === "muhasebe" ? GOLD : "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: 9, color: view === "muhasebe" ? NAVY : "white", cursor: "pointer" }} title="Muhasebe">
              <BarChart2 size={17} />
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
        {view === "rapor" && (
          <div style={{ marginTop: 18, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>Gelişmiş filtreleme ve raporlar</div>
        )}
        {view === "muhasebe" && (
          <div style={{ marginTop: 18, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>Gelir takibi ve ön muhasebe</div>
        )}
      </div>

      {view === "danisanlar" && (
        <ClientsView clients={clients} onOpenTaahhutname={(c) => { setTaahhutClient(c); setView("taahhutname"); }} />
      )}

      {view === "taahhutname" && (
        <TaahhutnameView prefill={taahhutClient} onBack={() => setView(taahhutClient ? "danisanlar" : "takvim")} />
      )}

      {view === "rapor" && (
        <RaporView appointments={Object.values(appointments).flatMap(dayAppts =>
          Object.entries(dayAppts).map(([slot, appt]) => ({ ...appt, slot }))
        )} />
      )}

      {view === "muhasebe" && (
        <MuhasebeView appointments={Object.entries(appointments).flatMap(([date, dayAppts]) =>
          Object.entries(dayAppts).map(([slot, appt]) => ({ ...appt, slot, date }))
        )} />
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
            {KVKK_TEXT(companyName, clientName)}
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

// ─── RAPOR VIEW ───────────────────────────────────────────────────────────────
function RaporView({ appointments }) {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0,10);
  const [dateFrom, setDateFrom] = useState(firstOfMonth);
  const [dateTo, setDateTo] = useState(today.toISOString().slice(0,10));
  const [filterService, setFilterService] = useState("");
  const [filterPayStatus, setFilterPayStatus] = useState("");
  const [filterPayMethod, setFilterPayMethod] = useState("");
  const [filterTestResult, setFilterTestResult] = useState("");
  const [filterApptStatus, setFilterApptStatus] = useState("");
  const [filterReferans, setFilterReferans] = useState("");

  const filtered = appointments.filter(a => {
    if (!a.date) return false;
    if (dateFrom && a.date < dateFrom) return false;
    if (dateTo && a.date > dateTo) return false;
    if (filterService && a.service !== filterService) return false;
    if (filterPayStatus && a.payStatus !== filterPayStatus) return false;
    if (filterPayMethod && a.payMethod !== filterPayMethod) return false;
    if (filterTestResult && a.testResult !== filterTestResult) return false;
    if (filterApptStatus && a.apptStatus !== filterApptStatus) return false;
    if (filterReferans && a.referans !== filterReferans) return false;
    return true;
  });

  const totalGelir = filtered.reduce((s, a) => s + (a.payStatus === "odendi" ? (a.price || 0) : a.payStatus === "kismi" ? (a.paidAmount || 0) : 0), 0);
  const bekleyenGelir = filtered.reduce((s, a) => s + (a.payStatus === "bekliyor" ? (a.price || 0) : 0), 0);

  const sel = { width: "100%", padding: "8px 10px", borderRadius: 9, border: "1px solid #e3ded0", fontSize: 12, fontFamily: "inherit", color: NAVY, background: "white", marginBottom: 6 };

  return (
    <div style={{ padding: "0 16px 40px", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ background: "white", borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: NAVY, marginBottom: 10 }}>📅 Tarih Aralığı</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ ...sel, flex: 1 }} />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ ...sel, flex: 1 }} />
        </div>

        <div style={{ fontSize: 13, fontWeight: 800, color: NAVY, margin: "10px 0 6px" }}>🔍 Filtreler</div>
        <select value={filterService} onChange={e => setFilterService(e.target.value)} style={sel}>
          <option value="">Tüm Hizmet Türleri</option>
          {SERVICES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select value={filterPayStatus} onChange={e => setFilterPayStatus(e.target.value)} style={sel}>
          <option value="">Tüm Ödeme Durumları</option>
          {Object.entries(PAY_STATUS).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterPayMethod} onChange={e => setFilterPayMethod(e.target.value)} style={sel}>
          <option value="">Tüm Ödeme Şekilleri</option>
          {PAY_METHODS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>
        <select value={filterTestResult} onChange={e => setFilterTestResult(e.target.value)} style={sel}>
          <option value="">Tüm Test Sonuçları</option>
          {Object.entries(TEST_RESULTS).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterApptStatus} onChange={e => setFilterApptStatus(e.target.value)} style={sel}>
          <option value="">Tüm Randevu Durumları</option>
          {Object.entries(APPT_STATUS).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterReferans} onChange={e => setFilterReferans(e.target.value)} style={sel}>
          <option value="">Tüm Referanslar</option>
          {REFERANS_SOURCES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <button onClick={() => { setFilterService(""); setFilterPayStatus(""); setFilterPayMethod(""); setFilterTestResult(""); setFilterApptStatus(""); setFilterReferans(""); }}
          style={{ fontSize: 11, color: "#B23B3B", background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
          Filtreleri Temizle
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div style={{ background: "white", borderRadius: 14, padding: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 11, color: "#8a8474", fontWeight: 700 }}>TOPLAM KİŞİ</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: NAVY }}>{filtered.length}</div>
        </div>
        <div style={{ background: "white", borderRadius: 14, padding: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 11, color: "#8a8474", fontWeight: 700 }}>TAHSİL EDİLEN</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#3D7A5C" }}>{currency(totalGelir)}</div>
        </div>
        <div style={{ background: "white", borderRadius: 14, padding: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 11, color: "#8a8474", fontWeight: 700 }}>GEÇEN</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#3D7A5C" }}>{filtered.filter(a => a.testResult === "gecti").length}</div>
        </div>
        <div style={{ background: "white", borderRadius: 14, padding: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 11, color: "#8a8474", fontWeight: 700 }}>KALAN</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#B23B3B" }}>{filtered.filter(a => a.testResult === "kaldi").length}</div>
        </div>
      </div>

      {bekleyenGelir > 0 && (
        <div style={{ background: "#FBF2DF", borderRadius: 12, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#B2811F", fontWeight: 700 }}>
          ⏳ Bekleyen tahsilat: {currency(bekleyenGelir)}
        </div>
      )}

      <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: NAVY, marginBottom: 10 }}>Sonuçlar ({filtered.length} randevu)</div>
        {filtered.length === 0 ? (
          <div style={{ color: "#8a8474", fontSize: 13, textAlign: "center", padding: 20 }}>Sonuç bulunamadı</div>
        ) : (
          filtered.map((a, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: i < filtered.length - 1 ? "1px solid #f0ebe0" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{a.clientName}</div>
                  <div style={{ fontSize: 11, color: "#8a8474" }}>
                    {a.date} · {a.slot} · {SERVICES.find(s => s.id === a.service)?.label || a.service}
                  </div>
                  {a.referans && <div style={{ fontSize: 10, color: "#b0aa98" }}>📍 {a.referans}</div>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-end" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{currency(a.price)}</span>
                  {a.testResult && TEST_RESULTS[a.testResult] && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, color: TEST_RESULTS[a.testResult].color, background: TEST_RESULTS[a.testResult].bg }}>
                      {TEST_RESULTS[a.testResult].label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── MUHASEBE VIEW ────────────────────────────────────────────────────────────
function MuhasebeView({ appointments }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [mode, setMode] = useState("aylik"); // "aylik" | "yillik" | "ozel" | "toplam"

  const getRange = () => {
    if (mode === "aylik") {
      const from = `${year}-${String(month).padStart(2,"0")}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const to = `${year}-${String(month).padStart(2,"0")}-${lastDay}`;
      return { from, to };
    }
    if (mode === "yillik") return { from: `${year}-01-01`, to: `${year}-12-31` };
    if (mode === "ozel") return { from: customFrom, to: customTo };
    return { from: "", to: "" };
  };

  const { from, to } = getRange();

  const filtered = appointments.filter(a => {
    if (!a.date) return false;
    if (from && a.date < from) return false;
    if (to && a.date > to) return false;
    return true;
  });

  const tahsilEdilen = filtered.filter(a => a.payStatus === "odendi").reduce((s,a) => s + (a.price||0), 0);
  const kismi = filtered.filter(a => a.payStatus === "kismi").reduce((s,a) => s + (a.paidAmount||0), 0);
  const bekleyen = filtered.filter(a => a.payStatus === "bekliyor").reduce((s,a) => s + (a.price||0), 0);
  const toplamTahsilat = tahsilEdilen + kismi;

  // Ödeme şekline göre dağılım
  const payMethodTotals = {};
  PAY_METHODS.forEach(m => { payMethodTotals[m.id] = 0; });
  filtered.forEach(a => {
    if (a.payStatus === "odendi") payMethodTotals[a.payMethod || "nakit"] = (payMethodTotals[a.payMethod || "nakit"] || 0) + (a.price || 0);
    else if (a.payStatus === "kismi") payMethodTotals[a.payMethod || "nakit"] = (payMethodTotals[a.payMethod || "nakit"] || 0) + (a.paidAmount || 0);
  });

  // Aylık özet (yıllık modda)
  const monthlyData = Array.from({length:12}, (_,i) => {
    const m = String(i+1).padStart(2,"0");
    const monthAppts = appointments.filter(a => a.date && a.date.startsWith(`${year}-${m}`));
    const total = monthAppts.filter(a => a.payStatus === "odendi").reduce((s,a) => s+(a.price||0),0)
                + monthAppts.filter(a => a.payStatus === "kismi").reduce((s,a) => s+(a.paidAmount||0),0);
    return { month: i+1, label: ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"][i], total, count: monthAppts.length };
  });
  const maxMonthly = Math.max(...monthlyData.map(d => d.total), 1);

  const tabStyle = (active) => ({
    flex: 1, padding: "8px 4px", borderRadius: 9, fontSize: 11, fontWeight: 700, cursor: "pointer", border: "none",
    background: active ? NAVY : "#f0ebe0", color: active ? "white" : "#8a8474"
  });

  const AYLAR = ["","Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

  return (
    <div style={{ padding: "0 16px 40px", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ background: "white", borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          {[["aylik","Aylık"],["yillik","Yıllık"],["ozel","Özel"],["toplam","Tümü"]].map(([k,l]) => (
            <button key={k} onClick={() => setMode(k)} style={tabStyle(mode===k)}>{l}</button>
          ))}
        </div>

        {(mode === "aylik" || mode === "yillik") && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setYear(y => y-1)} style={{ background: "#f0ebe0", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontWeight: 700 }}>‹</button>
            <span style={{ flex: 1, textAlign: "center", fontWeight: 700, color: NAVY, fontSize: 14 }}>{year}</span>
            <button onClick={() => setYear(y => y+1)} style={{ background: "#f0ebe0", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontWeight: 700 }}>›</button>
          </div>
        )}
        {mode === "aylik" && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            {Array.from({length:12},(_,i) => (
              <button key={i} onClick={() => setMonth(i+1)} style={{
                padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
                border: "none", background: month===i+1 ? GOLD : "#f0ebe0", color: month===i+1 ? NAVY : "#8a8474"
              }}>{["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"][i]}</button>
            ))}
          </div>
        )}
        {mode === "ozel" && (
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} style={{ flex: 1, padding: "8px 10px", borderRadius: 9, border: "1px solid #e3ded0", fontSize: 12, fontFamily: "inherit" }} />
            <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} style={{ flex: 1, padding: "8px 10px", borderRadius: 9, border: "1px solid #e3ded0", fontSize: 12, fontFamily: "inherit" }} />
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div style={{ background: "#E7F2ED", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 10, color: "#3D7A5C", fontWeight: 800 }}>TAHSİL EDİLEN</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#3D7A5C" }}>{currency(toplamTahsilat)}</div>
          <div style={{ fontSize: 10, color: "#3D7A5C" }}>{filtered.filter(a=>a.payStatus==="odendi").length} tam + {filtered.filter(a=>a.payStatus==="kismi").length} kısmi</div>
        </div>
        <div style={{ background: "#FBF2DF", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 10, color: "#B2811F", fontWeight: 800 }}>BEKLEYEN</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#B2811F" }}>{currency(bekleyen)}</div>
          <div style={{ fontSize: 10, color: "#B2811F" }}>{filtered.filter(a=>a.payStatus==="bekliyor").length} randevu</div>
        </div>
        <div style={{ background: "white", borderRadius: 14, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 10, color: "#8a8474", fontWeight: 800 }}>TOPLAM RANDEVU</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: NAVY }}>{filtered.length}</div>
        </div>
        <div style={{ background: "white", borderRadius: 14, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 10, color: "#8a8474", fontWeight: 800 }}>ORT. ÜCRET</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: NAVY }}>{filtered.length ? currency(Math.round(toplamTahsilat / filtered.length)) : "—"}</div>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: NAVY, marginBottom: 10 }}>💳 Ödeme Şekli Dağılımı</div>
        {PAY_METHODS.map(m => (
          <div key={m.id} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
              <span style={{ color: "#8a8474" }}>{m.label}</span>
              <span style={{ fontWeight: 700, color: NAVY }}>{currency(payMethodTotals[m.id] || 0)}</span>
            </div>
            <div style={{ background: "#f0ebe0", borderRadius: 6, height: 8 }}>
              <div style={{ background: NAVY, borderRadius: 6, height: 8, width: `${toplamTahsilat ? Math.round((payMethodTotals[m.id]||0)/toplamTahsilat*100) : 0}%`, transition: "width 0.3s" }} />
            </div>
          </div>
        ))}
      </div>

      {mode === "yillik" && (
        <div style={{ background: "white", borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: NAVY, marginBottom: 12 }}>📊 {year} Aylık Gelir</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 100 }}>
            {monthlyData.map(d => (
              <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div style={{ width: "100%", background: NAVY, borderRadius: "4px 4px 0 0", height: `${Math.round((d.total/maxMonthly)*80)+4}px`, minHeight: 4, transition: "height 0.3s" }} title={currency(d.total)} />
                <div style={{ fontSize: 9, color: "#8a8474" }}>{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: NAVY, marginBottom: 10 }}>
          {mode === "aylik" ? `${AYLAR[month]} ${year}` : mode === "yillik" ? `${year} Yılı` : mode === "ozel" ? "Seçilen Aralık" : "Tüm Zamanlar"} — Son İşlemler
        </div>
        {filtered.slice().sort((a,b) => (b.date||"").localeCompare(a.date||"")).slice(0,20).map((a,i,arr) => (
          <div key={i} style={{ padding: "9px 0", borderBottom: i < arr.length-1 ? "1px solid #f0ebe0" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{a.clientName}</div>
              <div style={{ fontSize: 10, color: "#8a8474" }}>{a.date} · {PAY_METHODS.find(m=>m.id===a.payMethod)?.label || "Nakit"}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: a.payStatus==="odendi" ? "#3D7A5C" : a.payStatus==="bekliyor" ? "#B2811F" : NAVY }}>
                {a.payStatus==="odendi" ? currency(a.price) : a.payStatus==="kismi" ? currency(a.paidAmount||0) : `(${currency(a.price)})`}
              </div>
              <div style={{ fontSize: 10, color: "#8a8474" }}>{PAY_STATUS[a.payStatus]?.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
