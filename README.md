# Haci Simsek - Kişisel Portfolyo

Profesyonel, hızlı ve erişilebilir bir kişisel portfolyo sitesi. Bu proje, Next.js + TypeScript + Tailwind CSS kullanılarak modern web standartlarına uygun şekilde geliştirilmiştir. Amacı, projelerimi, makalelerimi ve iletişim bilgilerini temiz ve performanslı bir kullanıcı arayüzüyle sergilemektir.

## İçindekiler

- Proje Hakkında
- Özellikler
- Teknoloji Yığını
- Proje Yapısı
- Kurulum ve Çalıştırma
- Üretim (Build) ve Dağıtım
- Katkıda Bulunma
- Lisans
- İletişim

## Proje Hakkında

Bu depo, Haci Simsek'in kişisel portfolyo web sitesinin kaynak kodunu içerir. Minimal, performans odaklı ve erişilebilir bir tasarım hedeflenmiştir. Site, içeriklerin (makaleler, projeler, iletişim) kolayca yönetilebilmesi için Next.js uygulaması şeklinde düzenlenmiştir.

## Özellikler

- Next.js ile sunucu tarafı ve statik üretim desteği
- TypeScript ile tip güvenliği
- Tailwind CSS ile hızlı stil geliştirme
- Bileşen tabanlı, yeniden kullanılabilir UI
- Erişilebilirlik ve performans optimizasyonları

## Teknoloji Yığını

- Next.js
- React
- TypeScript
- Tailwind CSS
- Sonner / Custom UI bileşenleri

## Proje Yapısı (kısa)

Öne çıkan klasörler:

- `app/` — Next.js uygulama dizini (sayfalar, düzen)
- `components/` — Kullanılan yeniden kullanılabilir bileşenler
- `public/` — Statik varlıklar (görseller, favicon)
- `hooks/`, `lib/` — Yardımcı fonksiyonlar ve özel hooklar

Tam dosya yapısını depoda inceleyebilirsiniz.

## Kurulum ve Çalıştırma

Gereksinimler:

- Node.js (LTS önerilir)
- npm veya yarn

Yerel geliştirme için adımlar:

```bash
# Depoyu klonlayın (zaten klonluysa bu adımı atlayın)
git clone https://github.com/hacisimsek/haci-simsek-portfolio.git
cd haci-simsek-portfolio

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcıda http://localhost:3000 adresini açın.

Yaygın npm script'leri (package.json içinde tanımlıdır):

- `dev` — Geliştirme sunucusunu başlatır
- `build` — Üretim için uygulamayı derler
- `start` — Üretim yapısını çalıştırır

## Üretim (Build) ve Dağıtım

Üretim yapısı oluşturmak için:

```bash
npm run build
npm run start
```

Bu proje Vercel veya benzeri bir hosting sağlayıcısına kolayca dağıtılabilir. Vercel kullanıyorsanız, repository'i bağlıyorsunuz ve otomatik deploy işlemleri etkinleşiyor.

## Çevresel Değişkenler

Bu repoda hassas bilgi gerektiren bir env dosyası yoktur; eğer özel API anahtarı veya benzeri bir yapı eklenirse, `.env.local` dosyasında saklanmalı ve `.gitignore` içine eklenmelidir.

## Katkıda Bulunma

Katkılar için teşekkürler. Küçük düzeltmeler veya öneriler için pull request açabilirsiniz. Büyük değişikliklerden önce issue ile tartışmak daha hızlı sonuç verir.

Önerilen akış:

1. Fork
2. Yeni bir branch oluşturun: `git checkout -b feat/özellik-adi`
3. Değişiklikleri commitleyin
4. Pull request oluşturun

## Lisans

Bu proje açık kaynak olarak sunulmuştur — lisans dosyası yoksa varsayılan olarak MIT lisansını kullanabilirsiniz. (Lisansı netleştirmek için repository'ye bir `LICENSE` dosyası ekleyin.)

## İletişim

Haci Simsek

- GitHub: https://github.com/hacisimsek

---

Eğer README'de özel bilgiler (ör. canlı demo linki, iletişim e-posta adresi, lisans türü) eklememi isterseniz, lütfen bana iletin; README'yi buna göre güncelleyeyim.
