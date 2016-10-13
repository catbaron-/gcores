// Copyright (c) 2016 Catbaron. All rights reserved.
id_button_notification = "notification";
id_button_mail = "mail";
id_play_list = "play_list";

var podcast_info = new Array();

function getNumberOfNotification(response){
  // console.log(response);
  document.getElementById(id_button_notification).innerText = response.notification_size;
  document.getElementById(id_button_mail).innerText = response.mail_size;
}
function getPodcastInformation(response){
  console.log(response);
  document.getElementById(id_play_list).innerText = JSON.stringify(response);
  // document.getElementById(id_button_mail).innerText = response.mail_size;
}
chrome.runtime.sendMessage({'msg':'GetNumberOfNotification'}, getNumberOfNotification);
chrome.runtime.sendMessage({'msg':'GetPodcastInfomation', 'data':'20764'}, getPodcastInformation);

//
// collectInfomation("20764");
