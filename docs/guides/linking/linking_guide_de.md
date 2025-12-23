# So Verbinden Sie Ihre WhatsApp- und Telegram-Konten

**Hinweis: Cross-Plattform-Mentions sind derzeit in Arbeit und funktionieren möglicherweise nicht korrekt. Der Verknüpfungsprozess funktioniert, aber Mention-Benachrichtigungen zwischen Plattformen haben bekannte Probleme.**

Dieser Leitfaden erklärt, wie Sie Ihre WhatsApp- und Telegram-Konten verknüpfen, damit Mentions (@Tags) auf beiden Plattformen funktionieren. Sobald verknüpft, jemanden auf einer Plattform zu taggen, benachrichtigt sie auf der anderen!

## Voraussetzungen

- BridgeBOT läuft und verbindet Ihre WhatsApp- und Telegram-Gruppen.
- Sie haben Konten in beiden Gruppen.
- Ihr Kurzname ist eingestellt (siehe unten).

## Schritt 1: Stellen Sie Ihren Kurznamen in Telegram ein

Wählen Sie zuerst einen einzigartigen Kurznamen (1-9 alphanumerische Zeichen, keine Leerzeichen).

1. Gehen Sie zu Ihrer Telegram-Gruppe.
2. Senden: `/link <ihre-telefonnummer> <kurzname>`
   - Beispiel: `/link 1234567890 john`
   - Telefonnummer: Ländercode einschließen, kein + oder Leerzeichen.
3. Der Bot antwortet mit Bestätigung oder Fehlern.

Ihr Kurzname ist jetzt mit Ihrem Telegram-Konto verknüpft.

## Schritt 2: Verknüpfen von WhatsApp

1. In Ihrer WhatsApp-Gruppe senden: `!iam <kurzname>`
   - Verwenden Sie denselben Kurznamen aus Schritt 1.
   - Beispiel: `!iam john`

2. Der Bot sendet eine private Nachricht an Ihr Telegram-Konto mit Bestätigungsanfrage.

3. In Telegram (privater Chat mit dem Bot) antworten: `yes`
   - Dies muss innerhalb von 30 Sekunden geschehen.

4. Sie erhalten Bestätigungsnachrichten in beiden Apps.

## Schritt 3: Testen Sie die Verknüpfung

**Hinweis: Aufgrund aktueller Einschränkungen funktionieren Cross-Plattform-Mentions möglicherweise nicht wie erwartet.**

- Senden Sie eine Nachricht in WhatsApp, jemanden taggend: `@ihr-kurzname`
- Es sollte in Telegram erscheinen (Mention-Funktionalität könnte eingeschränkt sein).
- Senden Sie eine Nachricht in Telegram, jemanden taggend: `@ihr-username`
- Es sollte in WhatsApp erscheinen (Mention-Funktionalität könnte eingeschränkt sein).

## Fehlerbehebung

### "Kein passender Telegram-Benutzer gefunden"
- Stellen Sie sicher, dass Ihr Kurzname korrekt und einzigartig ist.
- Überprüfen Sie, dass der Telegram-Benutzer seinen Kurznamen mit `/link` eingestellt hat.

### "Bestätigung abgelaufen"
- Die 30-Sekunden-Frist ist vorbei. Versuchen Sie `!iam <kurzname>` erneut.

### "Telefonnummer bereits verknüpft"
- Jemand anderes hat diese Nummer verwendet. Verwenden Sie `/unlink` zuerst, falls nötig.

### Mentions funktionieren nicht
- Cross-Plattform-Mentions sind derzeit experimentell und könnten Bugs haben.
- Stellen Sie sicher, dass beide Benutzer verknüpft sind (Verknüpfung funktioniert, aber Mentions möglicherweise nicht).
- Überprüfen Sie Bot-Logs auf Fehler.
- Starten Sie den Bot neu, wenn Mappings nicht laden.

### Befehle funktionieren nicht
- Stellen Sie sicher, dass Sie Befehle an den richtigen Orten senden:
  - `/link` und `yes`: Im privaten Telegram-Chat mit dem Bot.
  - `!iam`: In der WhatsApp-Gruppe.

## Verwalten Sie Ihre Verknüpfung

- **Status prüfen**: Kein direkter Befehl, aber testen Sie mit Mentions.
- **Verknüpfung aufheben**: Senden Sie `/unlink` im privaten Telegram-Chat, dann antworten Sie `yes` zur Bestätigung.
- **Kurznamen ändern**: Heben Sie zuerst die Verknüpfung auf, dann verknüpfen Sie mit neuem Kurznamen.

## Tipps

- **Kurznamen-Regeln**: 1-9 Zeichen, nur Buchstaben und Zahlen.
- **Telefon-Format**: 10-15 Ziffern, keine Symbole (z.B. 1234567890 für US).
- **Datenschutz**: Verknüpfung ist erforderlich, damit Cross-Plattform-Mentions funktionieren.
- **Gruppen-Admins**: Stellen Sie sicher, dass der Bot Berechtigung hat, Nachrichten zu lesen.

## Support

Wenn Sie Probleme haben:
1. Überprüfen Sie alle Schritte doppelt.
2. Verifizieren Sie, dass der Bot online ist: Überprüfen Sie, ob Nachrichten weitergeleitet werden.
3. Kontaktieren Sie Gruppen-Admins oder überprüfen Sie Bot-Logs.

Jetzt können Sie Freunde nahtlos zwischen Plattformen erwähnen! 🎉