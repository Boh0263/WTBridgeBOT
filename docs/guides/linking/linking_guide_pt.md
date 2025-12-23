# Como Vincular Suas Contas do WhatsApp e Telegram

**Nota: As menções cross-plataforma estão atualmente em trabalho em progresso e podem não funcionar corretamente. O processo de vinculação funciona, mas as notificações de menção entre plataformas têm problemas conhecidos.**

Este guia explica como vincular suas contas do WhatsApp e Telegram para que as menções (@tags) funcionem em ambas as plataformas. Uma vez vinculadas, marcar alguém em uma plataforma os notificará na outra!

## Pré-requisitos

- O BridgeBOT está rodando e conectando seus grupos do WhatsApp e Telegram.
- Você tem contas em ambos os grupos.
- Seu nome curto está definido (veja abaixo).

## Passo 1: Defina Seu Nome Curto no Telegram

Primeiro, escolha um nome curto único (1-9 caracteres alfanuméricos, sem espaços).

1. Vá para seu grupo do Telegram.
2. Envie: `/link <seu-número-de-telefone> <nomecurto>`
   - Exemplo: `/link 1234567890 john`
   - Número de telefone: Inclua o código do país, sem + ou espaços.
3. O bot responderá com confirmação ou erros.

Seu nome curto está agora vinculado à sua conta do Telegram.

## Passo 2: Vincule do WhatsApp

1. No seu grupo do WhatsApp, envie: `!iam <nomecurto>`
   - Use o mesmo nome curto do Passo 1.
   - Exemplo: `!iam john`

2. O bot enviará uma mensagem privada para sua conta do Telegram pedindo confirmação.

3. No Telegram (chat privado com o bot), responda: `yes`
   - Isso deve ser feito dentro de 30 segundos.

4. Você receberá mensagens de confirmação em ambos os apps.

## Passo 3: Teste a Vinculação

**Nota: Devido às limitações atuais, as menções cross-plataforma podem não funcionar como esperado.**

- Envie uma mensagem no WhatsApp marcando alguém: `@nome-curto-deles`
- Deve aparecer no Telegram (a funcionalidade de menção pode ser limitada).
- Envie uma mensagem no Telegram marcando alguém: `@username-deles`
- Deve aparecer no WhatsApp (a funcionalidade de menção pode ser limitada).

## Solução de Problemas

### "Nenhum usuário Telegram correspondente encontrado"
- Certifique-se de que seu nome curto está correto e único.
- Verifique se o usuário do Telegram definiu seu nome curto com `/link`.

### "Confirmação expirada"
- Os 30 segundos passaram. Tente `!iam <nomecurto>` novamente.

### "Número de telefone já vinculado"
- Alguém mais usou esse número. Use `/unlink` primeiro se necessário.

### As menções não funcionam
- As menções cross-plataforma são atualmente experimentais e podem ter bugs.
- Certifique-se de que ambos os usuários estão vinculados (a vinculação funciona, mas as menções podem não).
- Verifique os logs do bot para erros.
- Reinicie o bot se os mapeamentos não carregarem.

### Os comandos não funcionam
- Certifique-se de enviar comandos nos lugares corretos:
  - `/link` e `yes`: No chat privado do Telegram com o bot.
  - `!iam`: No grupo do WhatsApp.

## Gerencie Sua Vinculação

- **Verificar status**: Sem comando direto, mas teste com menções.
- **Desvincular**: Envie `/unlink` no chat privado do Telegram, então responda `yes` para confirmar.
- **Mudar nome curto**: Desvincule primeiro, então vincule com novo nome curto.

## Dicas

- **Regras nome curto**: 1-9 caracteres, apenas letras e números.
- **Formato telefone**: 10-15 dígitos, sem símbolos (ex. 1234567890 para US).
- **Privacidade**: A vinculação é necessária para que as menções cross-plataforma funcionem.
- **Admins do grupo**: Certifique-se de que o bot tem permissões para ler mensagens.

## Suporte

Se você encontrar problemas:
1. Verifique todos os passos duas vezes.
2. Verifique se o bot está online: Veja se as mensagens estão sendo encaminhadas.
3. Contate admins do grupo ou verifique logs do bot.

Agora você pode mencionar amigos perfeitamente entre plataformas! 🎉