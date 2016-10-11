// Copyright (c) 2016 Catbaron. All rights reserved.
id_button_notification = "notification"

function NumberOfNotification(response){
  document.getElementById(id_button_notification).innerText = response;
  // alert(response);
}
chrome.runtime.sendMessage('NumberOfNotification', NumberOfNotification);
