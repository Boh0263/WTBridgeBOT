# Cómo Vincular Tus Cuentas de WhatsApp y Telegram

**Nota: Las menciones cross-plataforma están actualmente en trabajo en progreso y pueden no funcionar correctamente. El proceso de vinculación funciona, pero las notificaciones de mención entre plataformas tienen problemas conocidos.**

Esta guía explica cómo vincular tus cuentas de WhatsApp y Telegram para que las menciones (@etiquetas) funcionen en ambas plataformas. ¡Una vez vinculadas, etiquetar a alguien en una plataforma los notificará en la otra!

## Prerrequisitos

- BridgeBOT está ejecutándose y conectando tus grupos de WhatsApp y Telegram.
- Tienes cuentas en ambos grupos.
- Tu nombre corto está configurado (ver abajo).

## Paso 1: Configura Tu Nombre Corto en Telegram

Primero, elige un nombre corto único (1-9 caracteres alfanuméricos, sin espacios).

1. Ve a tu grupo de Telegram.
2. Envía: `/link <tu-número-de-teléfono> <nombrecorto>`
   - Ejemplo: `/link 1234567890 john`
   - Número de teléfono: Incluye el código de país, sin + o espacios.
3. El bot responderá con confirmación o errores.

Tu nombre corto está ahora vinculado a tu cuenta de Telegram.

## Paso 2: Vincula desde WhatsApp

1. En tu grupo de WhatsApp, envía: `!iam <nombrecorto>`
   - Usa el mismo nombre corto del Paso 1.
   - Ejemplo: `!iam john`

2. El bot enviará un mensaje privado a tu cuenta de Telegram pidiendo confirmación.

3. En Telegram (chat privado con el bot), responde: `yes`
   - Esto debe hacerse dentro de 30 segundos.

4. Recibirás mensajes de confirmación en ambas aplicaciones.

## Paso 3: Prueba la Vinculación

**Nota: Debido a las limitaciones actuales, las menciones cross-plataforma pueden no funcionar como se esperaba.**

- Envía un mensaje en WhatsApp etiquetando a alguien: `@su-nombrecorto`
- Debería aparecer en Telegram (la funcionalidad de mención puede ser limitada).
- Envía un mensaje en Telegram etiquetando a alguien: `@su-username`
- Debería aparecer en WhatsApp (la funcionalidad de mención puede ser limitada).

## Solución de Problemas

### "No se encontró usuario de Telegram coincidente"
- Asegúrate de que tu nombre corto sea correcto y único.
- Verifica que el usuario de Telegram haya configurado su nombre corto con `/link`.

### "Confirmación expirada"
- Pasaron los 30 segundos. Intenta `!iam <nombrecorto>` de nuevo.

### "Número de teléfono ya vinculado"
- Alguien más usó ese número. Usa `/unlink` primero si es necesario.

### Las menciones no funcionan
- Las menciones cross-plataforma son actualmente experimentales y pueden tener bugs.
- Asegúrate de que ambos usuarios estén vinculados (la vinculación funciona, pero las menciones pueden no).
- Revisa los logs del bot por errores.
- Reinicia el bot si las asignaciones no se cargan.

### Los comandos no funcionan
- Asegúrate de enviar comandos en los lugares correctos:
  - `/link` y `yes`: En chat privado de Telegram con el bot.
  - `!iam`: En grupo de WhatsApp.

## Gestiona Tu Vinculación

- **Verificar estado**: Sin comando directo, pero prueba con menciones.
- **Desvincular**: Envía `/unlink` en chat privado de Telegram, luego responde `yes` para confirmar.
- **Cambiar nombre corto**: Desvincula primero, luego vincula con nuevo nombre corto.

## Consejos

- **Reglas nombre corto**: 1-9 caracteres, solo letras y números.
- **Formato teléfono**: 10-15 dígitos, sin símbolos (ej. 1234567890 para US).
- **Privacidad**: La vinculación es requerida para que funcionen las menciones cross-plataforma.
- **Administradores del grupo**: Asegúrate de que el bot tenga permisos para leer mensajes.

## Soporte

Si encuentras problemas:
1. Revisa todos los pasos dos veces.
2. Verifica que el bot esté online: Revisa si los mensajes se están reenviando.
3. Contacta a administradores del grupo o revisa logs del bot.

¡Ahora puedes mencionar sin problemas a tus amigos entre plataformas! 🎉