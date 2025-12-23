# Come Collegare i Tuoi Account WhatsApp e Telegram

**Nota: Le menzioni cross-piattaforma sono attualmente un lavoro in corso e potrebbero non funzionare correttamente. Il processo di collegamento funziona, ma le notifiche di menzione tra piattaforme hanno problemi noti.**

Questa guida spiega come collegare i tuoi account WhatsApp e Telegram in modo che le menzioni (@tag) funzionino su entrambe le piattaforme. Una volta collegati, taggare qualcuno in una piattaforma li notificherà nell'altra!

## Prerequisiti

- BridgeBOT è in esecuzione e collega i tuoi gruppi WhatsApp e Telegram.
- Hai account in entrambi i gruppi.
- Il tuo nome breve è impostato (vedi sotto).

## Passo 1: Imposta il Tuo Nome Breve in Telegram

Per prima cosa, scegli un nome breve unico (1-9 caratteri alfanumerici, senza spazi).

1. Vai al tuo gruppo Telegram.
2. Invia: `/link <il-tuo-numero-di-telefono> <nomebreve>`
   - Esempio: `/link 1234567890 john`
   - Numero di telefono: Includi il prefisso internazionale, senza + o spazi.
3. Il bot risponderà con conferma o errori.

Il tuo nome breve è ora collegato al tuo account Telegram.

## Passo 2: Collega da WhatsApp

1. Nel tuo gruppo WhatsApp, invia: `!iam <nomebreve>`
   - Usa lo stesso nome breve del Passo 1.
   - Esempio: `!iam john`

2. Il bot invierà un messaggio privato al tuo account Telegram chiedendo conferma.

3. In Telegram (chat privata con il bot), rispondi: `yes`
   - Questo deve essere fatto entro 30 secondi.

4. Riceverai messaggi di conferma in entrambe le app.

## Passo 3: Testa il Collegamento

**Nota: A causa delle attuali limitazioni, le menzioni cross-piattaforma potrebbero non funzionare come previsto.**

- Invia un messaggio in WhatsApp taggando qualcuno: `@loro-nomebreve`
- Dovrebbe apparire in Telegram (la funzionalità di menzione potrebbe essere limitata).
- Invia un messaggio in Telegram taggando qualcuno: `@loro-username`
- Dovrebbe apparire in WhatsApp (la funzionalità di menzione potrebbe essere limitata).

## Risoluzione Problemi

### "Nessun utente Telegram corrispondente trovato"
- Assicurati che il tuo nome breve sia corretto e unico.
- Verifica che l'utente Telegram abbia impostato il suo nome breve con `/link`.

### "Conferma scaduta"
- La finestra di 30 secondi è passata. Prova di nuovo `!iam <nomebreve>`.

### "Numero di telefono già collegato"
- Qualcun altro ha usato quel numero. Usa `/unlink` prima se necessario.

### Le menzioni non funzionano
- Le menzioni cross-piattaforma sono attualmente sperimentali e potrebbero avere bug.
- Assicurati che entrambi gli utenti siano collegati (il collegamento funziona, ma le menzioni potrebbero no).
- Controlla i log del bot per errori.
- Riavvia il bot se le mappature non si caricano.

### I comandi non funzionano
- Assicurati di inviare i comandi nei posti corretti:
  - `/link` e `yes`: Nella chat privata Telegram con il bot.
  - `!iam`: Nel gruppo WhatsApp.

## Gestisci il Tuo Collegamento

- **Controlla stato**: Nessun comando diretto, ma testa con menzioni.
- **Scollega**: Invia `/unlink` nella chat privata Telegram, poi rispondi `yes` per confermare.
- **Cambia nome breve**: Scollega prima, poi collega con nuovo nome breve.

## Suggerimenti

- **Regole nome breve**: 1-9 caratteri, solo lettere e numeri.
- **Formato telefono**: 10-15 cifre, nessun simbolo (es. 1234567890 per US).
- **Privacy**: Il collegamento è richiesto per far funzionare le menzioni cross-piattaforma.
- **Amministratori gruppo**: Assicurati che il bot abbia permessi per leggere i messaggi.

## Supporto

Se incontri problemi:
1. Ricontrolla tutti i passi.
2. Verifica che il bot sia online: Controlla se i messaggi vengono inoltrati.
3. Contatta gli amministratori del gruppo o controlla i log del bot.

Ora puoi menzionare senza problemi gli amici tra piattaforme! 🎉