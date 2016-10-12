// Copyright (c) 2016 Catbaron. All rights reserved.
id_button_notification = "notification"
id_button_mail = "mail"

function NumberOfNotification(response){
  document.getElementById(id_button_notification).innerText = response.notification_size;
  document.getElementById(id_button_mail).innerText = response.mail_size;
}
chrome.runtime.sendMessage('NumberOfNotification', NumberOfNotification);
