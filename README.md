# Rota Psikoteknik — Randevu & Ödeme Takibi

Bu, Claude'da hazırladığımız uygulamanın bağımsız (claude.ai dışında, kendi adresinde çalışan) versiyonudur. Veriler artık tarayıcıya değil, ücretsiz bir Supabase veritabanına kaydediliyor.

## 1. Supabase projesi oluştur (ücretsiz)

1. https://supabase.com adresine git, ücretsiz hesap aç.
2. "New Project" ile yeni proje oluştur (bölge olarak Frankfurt/EU seçebilirsin, Türkiye'ye en yakın).
3. Proje açılınca sol menüden **SQL Editor**'e gir, bu klasördeki `schema.sql` dosyasının tüm içeriğini yapıştır ve **Run** butonuna bas. Bu, gerekli tabloları oluşturur.
4. Sol menüden **Project Settings > API** sayfasına git. Orada:
   - **Project URL**
   - **anon public** anahtarı
   bulacaksın. Bu ikisini bir sonraki adımda kullanacağız.

## 2. Ortam değişkenlerini ayarla

Bu klasörde `.env.example` dosyasını `.env` olarak kopyala ve içine Supabase bilgilerini yaz:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 3. Bilgisayarında dene

Node.js kurulu olmalı (https://nodejs.org, LTS sürüm yeterli). Sonra terminalde:

```bash
npm install
npm run dev
```

Terminalde çıkan adresi (genelde `http://localhost:5173`) tarayıcıda aç — uygulamayı test et.

## 4. İnternete yayınla (ücretsiz — Vercel ile)

1. Bu klasörü bir GitHub deposuna yükle (GitHub Desktop ile kolayca yapılabilir).
2. https://vercel.com adresine GitHub hesabınla giriş yap.
3. "Add New Project" > GitHub deposunu seç > "Import".
4. Vercel otomatik olarak Vite projesini tanır. **Environment Variables** kısmına `.env` dosyandaki iki değeri ekle (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
5. "Deploy" tuşuna bas. Birkaç dakika içinde `https://senin-projen.vercel.app` gibi bir adres alırsın — bunu telefonuna ana ekrana ekleyip bir uygulama gibi kullanabilirsin.

Bu adımların hiçbirini kendin yapmak zorunda değilsin — bir yazılımcıya bu klasörü ve bu README'yi göndermen, "bu talimatları takip edip yayına al" demen yeterli.

## Güvenlik notu (önemli)

Şu anki kurulumda uygulama adresini bilen **herkes** randevu/ödeme verilerini görüp değiştirebilir (basitlik için `schema.sql` içinde tüm erişime izin veren bir politika var). Bu, sadece sen kullandığın ve linki paylaşmadığın sürece sorun değildir.

İleride resepsiyonist gibi başka biri de kullanacaksa veya adresi paylaşacaksan, bir sonraki adım Supabase Auth ile basit bir giriş ekranı (e-posta + şifre) koymak olur. İstediğinde bu adımı da birlikte ekleyebiliriz.

## Neyi değiştirdik (Claude versiyonundan farkı)

- `window.storage` (Claude'a özel) yerine gerçek bir Postgres veritabanı (Supabase) kullanılıyor — `src/supabaseClient.js` ve `src/App.jsx` içindeki veri okuma/yazma fonksiyonları buna göre güncellendi.
- Arayüz, renk paleti, randevu/ödeme/belge takibi mantığı tamamen aynı kaldı.
