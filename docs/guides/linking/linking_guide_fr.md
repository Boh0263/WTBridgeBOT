# Comment Lier Vos Comptes WhatsApp et Telegram

**Note: Les mentions cross-plateformes sont actuellement en cours de développement et peuvent ne pas fonctionner correctement. Le processus de liaison fonctionne, mais les notifications de mention entre plateformes ont des problèmes connus.**

Ce guide explique comment lier vos comptes WhatsApp et Telegram afin que les mentions (@tags) fonctionnent sur les deux plateformes. Une fois liés, taguer quelqu'un sur une plateforme les notifiera sur l'autre !

## Prérequis

- BridgeBOT fonctionne et relie vos groupes WhatsApp et Telegram.
- Vous avez des comptes dans les deux groupes.
- Votre nom court est défini (voir ci-dessous).

## Étape 1: Définissez Votre Nom Court dans Telegram

Choisissez d'abord un nom court unique (1-9 caractères alphanumériques, sans espaces).

1. Allez dans votre groupe Telegram.
2. Envoyez: `/link <votre-numéro-de-téléphone> <nomcourt>`
   - Exemple: `/link 1234567890 john`
   - Numéro de téléphone: Incluez le code pays, sans + ou espaces.
3. Le bot répondra avec confirmation ou erreurs.

Votre nom court est maintenant lié à votre compte Telegram.

## Étape 2: Liez depuis WhatsApp

1. Dans votre groupe WhatsApp, envoyez: `!iam <nomcourt>`
   - Utilisez le même nom court de l'Étape 1.
   - Exemple: `!iam john`

2. Le bot enverra un message privé à votre compte Telegram demandant confirmation.

3. Dans Telegram (chat privé avec le bot), répondez: `yes`
   - Cela doit être fait dans les 30 secondes.

4. Vous recevrez des messages de confirmation dans les deux apps.

## Étape 3: Testez la Liaison

**Note: En raison des limitations actuelles, les mentions cross-plateformes peuvent ne pas fonctionner comme prévu.**

- Envoyez un message dans WhatsApp taguant quelqu'un: `@leur-nomcourt`
- Cela devrait apparaître dans Telegram (la fonctionnalité de mention peut être limitée).
- Envoyez un message dans Telegram taguant quelqu'un: `@leur-username`
- Cela devrait apparaître dans WhatsApp (la fonctionnalité de mention peut être limitée).

## Dépannage

### "Aucun utilisateur Telegram correspondant trouvé"
- Assurez-vous que votre nom court est correct et unique.
- Vérifiez que l'utilisateur Telegram a défini son nom court avec `/link`.

### "Confirmation expirée"
- Les 30 secondes sont passées. Essayez `!iam <nomcourt>` à nouveau.

### "Numéro de téléphone déjà lié"
- Quelqu'un d'autre a utilisé ce numéro. Utilisez `/unlink` d'abord si nécessaire.

### Les mentions ne fonctionnent pas
- Les mentions cross-plateformes sont actuellement expérimentales et peuvent avoir des bugs.
- Assurez-vous que les deux utilisateurs sont liés (la liaison fonctionne, mais les mentions peuvent ne pas).
- Vérifiez les logs du bot pour les erreurs.
- Redémarrez le bot si les mappings ne se chargent pas.

### Les commandes ne fonctionnent pas
- Assurez-vous d'envoyer les commandes aux bons endroits:
  - `/link` et `yes`: Dans le chat privé Telegram avec le bot.
  - `!iam`: Dans le groupe WhatsApp.

## Gérez Votre Liaison

- **Vérifier le statut**: Pas de commande directe, mais testez avec des mentions.
- **Délier**: Envoyez `/unlink` dans le chat privé Telegram, puis répondez `yes` pour confirmer.
- **Changer nom court**: Déconnectez d'abord, puis reconnectez avec nouveau nom court.

## Conseils

- **Règles nom court**: 1-9 caractères, lettres et chiffres seulement.
- **Format téléphone**: 10-15 chiffres, pas de symboles (ex. 1234567890 pour US).
- **Confidentialité**: La liaison est requise pour que les mentions cross-plateformes fonctionnent.
- **Admins du groupe**: Assurez-vous que le bot a les permissions pour lire les messages.

## Support

Si vous rencontrez des problèmes:
1. Vérifiez deux fois toutes les étapes.
2. Vérifiez que le bot est en ligne: Voyez si les messages sont transférés.
3. Contactez les admins du groupe ou vérifiez les logs du bot.

Vous pouvez maintenant mentionner sans problème vos amis entre plateformes ! 🎉