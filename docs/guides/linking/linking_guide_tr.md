# WhatsApp ve Telegram Hesaplarınızı Nasıl Bağlayacaksınız

**Not: Çapraz platform bahsetmeleri şu anda geliştirme aşamasındadır ve düzgün çalışmayabilir. Bağlama işlemi çalışır, ancak platformlar arası bahsetme bildirimlerinde bilinen sorunlar vardır.**

Bu kılavuz, WhatsApp ve Telegram hesaplarınızı bağlayarak bahsetmelerin (@etiketler) her iki platformda da çalışmasını nasıl yapacağınızı açıklar. Bir kez bağlandıktan sonra, bir platformda birini etiketlemek onları diğerinde bilgilendirecektir!

## Ön Koşullar

- BridgeBOT çalışıyor ve WhatsApp ile Telegram gruplarınızı birbirine bağlıyor.
- Her iki grupta da hesaplarınız var.
- Kısa adınız ayarlandı (aşağıya bakın).

## Adım 1: Telegram'da Kısa Adınızı Ayarlayın

Öncelikle, benzersiz bir kısa ad seçin (1-9 alfanümerik karakter, boşluk yok).

1. Telegram grubunuza gidin.
2. Gönderin: `/link <telefon-numaranız> <kısaisim>`
   - Örnek: `/link 1234567890 john`
   - Telefon numarası: Ülke kodunu dahil edin, + veya boşluk yok.
3. Bot onay veya hatalarla yanıt verecektir.

Kısa adınız şimdi Telegram hesabınıza bağlandı.

## Adım 2: WhatsApp'tan Bağlayın

1. WhatsApp grubunuzda gönderin: `!iam <kısaisim>`
   - Adım 1'deki aynı kısa adı kullanın.
   - Örnek: `!iam john`

2. Bot, onay istemek için Telegram hesabınıza özel bir mesaj gönderecektir.

3. Telegram'da (botla özel sohbet) yanıtlayın: `yes`
   - Bu 30 saniye içinde tamamlanmalıdır.

4. Her iki uygulamada da onay mesajları alacaksınız.

## Adım 3: Bağlamayı Test Edin

**Not: Mevcut sınırlamalar nedeniyle, çapraz platform bahsetmeleri beklenildiği gibi çalışmayabilir.**

- WhatsApp'ta birini etiketleyerek mesaj gönderin: `@kısaadları`
- Telegram'da görünmelidir (bahsetme işlevi sınırlı olabilir).
- Telegram'da birini etiketleyerek mesaj gönderin: `@kullanıcıadları`
- WhatsApp'ta görünmelidir (bahsetme işlevi sınırlı olabilir).

## Sorun Giderme

### "Eşleşen Telegram kullanıcısı bulunamadı"
- Kısa adınızın doğru ve benzersiz olduğundan emin olun.
- Telegram kullanıcısının `/link` ile kısa adını ayarladığını kontrol edin.

### "Onay süresi doldu"
- 30 saniyelik pencere geçti. `!iam <kısaisim>` tekrar deneyin.

### "Telefon numarası zaten bağlandı"
- Başka biri o numarayı kullandı. Gerekirse önce `/unlink` kullanın.

### Bahsetmeler çalışmıyor
- Çapraz platform bahsetmeleri şu anda deneyseldir ve hatalar içerebilir.
- Her iki kullanıcının da bağlandığından emin olun (bağlama çalışır, ancak bahsetmeler çalışmayabilir).
- Hatalar için bot günlüklerini kontrol edin.
- Eşlemeler yüklenmezse botu yeniden başlatın.

### Komutlar çalışmıyor
- Komutları doğru yerlere gönderdiğinizden emin olun:
  - `/link` ve `yes`: Botla Telegram özel sohbetinde.
  - `!iam`: WhatsApp grubunda.

## Bağlamanızı Yönetin

- **Durumu kontrol edin**: Doğrudan komut yok, bahsetmelerle test edin.
- **Bağlantıyı kaldırın**: Telegram özel sohbetinde `/unlink` gönderin, sonra onay için `yes` yanıtlayın.
- **Kısa adı değiştirin**: Önce bağlantıyı kaldırın, sonra yeni kısa adla bağlayın.

## İpuçları

- **Kısa ad kuralları**: 1-9 karakter, sadece harf ve rakamlar.
- **Telefon biçimi**: 10-15 rakam, sembol yok (örneğin, ABD için 1234567890).
- **Gizlilik**: Çapraz platform bahsetmelerinin çalışması için bağlama gereklidir.
- **Grup yöneticileri**: Botun mesajları okuma iznine sahip olduğundan emin olun.

## Destek

Sorunlarla karşılaşırsanız:
1. Tüm adımları iki kez kontrol edin.
2. Botun çevrimiçi olduğunu doğrulayın: Mesajların yönlendirilip yönlendirilmediğini kontrol edin.
3. Grup yöneticilerine başvurun veya bot günlüklerini kontrol edin.

Artık platformlar arası arkadaşlarınızı sorunsuz bir şekilde bahsedebilirsiniz! 🎉