function playSound() {
	if (typeof(audio) != "undefined" && audio) {
		audio.pause();
		document.body.removeChild(audio);
		audio = null;
	}
	audio = document.createElement('audio');
	document.body.appendChild(audio);
	audio.autoplay = true;
	audio.src = chrome.extension.getURL('assets/tada.mp3');
	audio.play();
}

// send macro start message to telegram
function sendStartMessageToTelegram() {
	var botToken = localStorage['botToken'];
	var chatId = localStorage['chatId'];
	var msg = encodeURI('Macro started.');
	if (botToken != undefined && chatId != undefined) {
		var url = 'https://api.telegram.org/bot' + botToken + '/sendMessage?chat_id=' + chatId + '&text=' + msg;
		
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				var response = xmlhttp.responseText; //if you need to do something with the returned value
			}
		}
		xmlhttp.open('GET', url, true);
		xmlhttp.send();
	}
}

// send ticketed message to telegram
function sendTicketedMessageToTelegram() {
	var botToken = localStorage['botToken'];
	var chatId = localStorage['chatId'];
	var msg = encodeURI('Ticketed! Please check your reservation status.');
	if (botToken != undefined && chatId != undefined) {
		var url = 'https://api.telegram.org/bot' + botToken + '/sendMessage?chat_id=' + chatId + '&text=' + msg;
		
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				var response = xmlhttp.responseText; //if you need to do something with the returned value
			}
		}
		xmlhttp.open('GET', url, true);
		xmlhttp.send();
	}
}

function sendMessageToTelegram() {
	var botToken = localStorage['botToken'];
    var chatId = localStorage['chatId'];
	var msg = encodeURI('Macro has been stopped. Please check your reservation status.');
	if (botToken != undefined && chatId != undefined) {
        var url = 'https://api.telegram.org/bot' + botToken + '/sendMessage?chat_id=' + chatId + '&text=' + msg;
        
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                var response = xmlhttp.responseText; //if you need to do something with the returned value
            }
        }
        xmlhttp.open('GET', url, true);
        xmlhttp.send();
    }
}

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
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
});