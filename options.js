const defaultBotToken = 'Set your telegram bot token';
const defaultChatId = 'Set your telegram chat id';

async function save_options() {
  const botToken = document.getElementById('bot_token').value;
  const chatId = document.getElementById('chat_id').value;
  
  // Use chrome.storage.local instead of localStorage
  await chrome.storage.local.set({
    botToken: botToken,
    chatId: chatId
  });
  
  const url = `https://api.telegram.org/bot${botToken}/sendmessage?chat_id=${chatId}&text=${encodeURI('Bot connected.')}`;
  
  try {
    await fetch(url);
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 750);
  } catch (error) {
    console.error('Failed to send test message:', error);
  }
}

async function restore_options() {
  const result = await chrome.storage.local.get(['botToken', 'chatId']);
  
  const botToken = result.botToken || defaultBotToken;
  const chatId = result.chatId || defaultChatId;
  
  document.getElementById('bot_token').value = botToken;
  document.getElementById('chat_id').value = chatId;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);