// Offscreen document script for audio playback in Manifest V3
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'playAudio') {
    const audio = new Audio(chrome.runtime.getURL('assets/tada.mp3'));
    audio.play().catch(console.error);
  }
});