const { processMessage } = require('../../src/handlers/message');

describe('Message Handler', () => {
  test('processes WhatsApp text message', async () => {
    const msg = { body: 'Hello', hasMedia: false };
    const result = await processMessage(msg, 'whatsapp');
    expect(result.text).toBe('Hello');
    expect(result.media).toBeNull();
  });

  // Add more tests
});