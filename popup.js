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
}

function showGadioList(podcasts){
  for(var i=0; i<podcasts.length; i++){
    podcast = podcasts[i];
    inner_text = "";
    inner_text += "<div class='podcast' data='"+podcast.id+"'>";
    inner_text += " <div class='podcast_img'>";
    inner_text += "   <img src='" + podcast.url_img + "' />";
    inner_text += " </div>"
    inner_text += "<div class='podcast_text'>"
    inner_text += " <div class='podcast_title'>" + podcast.title + "</div>";
    inner_text += " <div class='podcast_time'>" + podcast.time + "</div>"
    inner_text += "</div>"
    $("#gadio_list").append(inner_text);
  }
}
chrome.runtime.sendMessage({'msg':'GetNumberOfNotification'}, getNumberOfNotification);
chrome.runtime.sendMessage({'msg':'GetGadioList'}, showGadioList);
