url_check_msg = 'http://www.g-cores.com/setting/notifications?ajax=1';
url_notifications = "http://www.g-cores.com/setting/notifications";
url_inbox = "http://www.g-cores.com/inbox";
var notification_size, mail_size;

function getUrlNotificationsAjax(){
  return url_check_msg;
}

function getUrlNotificationsPage(){
  if(mail_size != 0){
    return url_inbox;
  }
  else{
    return url_notifications;
  }
}

function checkMSG(url, callback){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
  xhr.setRequestHeader("Accept","application/json, text/javascript, */*; q=0.01");

  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
      callback(xhr, true);
    }
  }
  xhr.onerror = function(){
    callback(xhr, false);
  }
  xhr.send();
}

function callback(xhr, success){
  msg_number = "0";
  if(success){
    msg = JSON.parse(xhr.responseText);
    mail_size = msg.mails_size;
    notification_size = msg.notifications_size;
    msg_number = mail_size + notification_size;
    if(parseInt(msg_number)>99){
      msg_number = "99+";
    }
  }
  else{
    msg_number = "-1";
  }
  chrome.browserAction.setBadgeBackgroundColor({color: '#0000FF'});
  chrome.browserAction.setBadgeText({text: msg_number.toString()});
}

chrome.browserAction.onClicked.addListener(function(){
  chrome.tabs.create({url: getUrlNotificationsPage()});
});

setInterval(function(){
  checkMSG(getUrlNotificationsAjax(), callback)
}, 5000)
