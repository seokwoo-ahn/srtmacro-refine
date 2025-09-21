function playSound() {
  // In Manifest V3, we need to use chrome.offscreen to play audio
  chrome.offscreen.createDocument({
    url: 'background.html',
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'Play notification sound when reservation succeeds'
  }).then(() => {
    // Send message to offscreen document to play sound
    chrome.runtime.sendMessage({type: 'playAudio'});
  }).catch((error) => {
    // Document might already exist, try to send message anyway
    if (error.message.includes('Only a single offscreen document')) {
      chrome.runtime.sendMessage({type: 'playAudio'});
    } else {
      console.error('Failed to create offscreen document:', error);
    }
  });
}

// send macro start message to telegram
async function sendStartMessageToTelegram() {
  const result = await chrome.storage.local.get(['botToken', 'chatId']);
  const { botToken, chatId } = result;
  const msg = encodeURI('Macro started.');
  if (botToken && chatId) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${msg}`;

    try {
      await fetch(url);
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
    }
  }
}

// send ticketed message to telegram
async function sendTicketedMessageToTelegram() {
  const result = await chrome.storage.local.get(['botToken', 'chatId']);
  const { botToken, chatId } = result;
  const msg = encodeURI('Ticketed! Please check your reservation status.');
  if (botToken && chatId) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${msg}`;

    try {
      await fetch(url);
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
    }
  }
}

// send macro stop message to telegram
async function sendMessageToTelegram() {
  const result = await chrome.storage.local.get(['botToken', 'chatId']);
  const { botToken, chatId } = result;
  
  if (botToken && chatId) {
    const msg = encodeURI('Macro has been stopped. Please check your reservation status.');
    const url = `https://api.telegram.org/bot${botToken}/sendmessage?chat_id=${chatId}&text=${msg}`;
    
    try {
      await fetch(url);
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
    }
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.type == 'playSound') {
		playSound();
		sendMessageToTelegram();
        sendResponse(true);
    } else if (message && message.type == 'startMacro') {
		sendStartMessageToTelegram();
		sendResponse(true);
	} else if (message && message.type == 'ticketed') {
		sendTicketedMessageToTelegram();
		sendResponse(true);
	}
	return true; // keep the message channel open for sendResponse
});