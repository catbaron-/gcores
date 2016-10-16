// Copyright (c) 2016 Catbaron. All rights reserved.
id_button_notification = "#notification";
id_button_mail = "#mail";
id_gadio_list = "#gadio_list";
id_gadio_play = "#gadio_play"


var podcast_info = new Array();
//
function showNumberOfMessage(response){
  // console.log(response);
  $(id_button_notification).text(response.notification_size);
  $(id_button_mail).text(response.mail_size);
}

function showPlayInfo(response){
  $(id_gadio_list).fadeOut();
  $("#play_info").text(JSON.stringify(response));
  $(id_gadio_play).fadeIn();
}
function playAtTime(response, time){
  // alert(response.url_podcast);
  // alert(time);
}
function playGadioAndShowInfo(response){
  showPlayInfo(response);
  playAtTime(response, 0);
}

function playGadio(id){
  chrome.runtime.sendMessage({
    'msg':'GetPodcastInfo',
    'data':{'id':id.data}
  },playGadioAndShowInfo);
}

function showGadioList(podcasts){
  for(var i=0; i<podcasts.length; i++){
    podcast = podcasts[i];
    inner_text = "";
    inner_text += "<div class='podcast' id='"+podcast.id+"'>";
    inner_text += " <div class='podcast_img'>";
    inner_text += "   <img src='" + podcast.url_img + "' />";
    inner_text += " </div>"
    inner_text += "<div class='podcast_text'>"
    inner_text += " <div class='podcast_title'>" + podcast.title + "</div>";
    inner_text += " <div class='podcast_time'>" + podcast.time + "</div>"
    inner_text += "</div>"
    $(id_gadio_list).append(inner_text);
    $("#"+podcast.id).bind('click', podcast.id, playGadio);
  }
}

chrome.runtime.sendMessage({'msg':'GetNumberOfNotification'}, showNumberOfMessage);
chrome.runtime.sendMessage({'msg':'GetGadioList'}, showGadioList);
$("#back_to_list").bind('click', function(){
  $(id_gadio_play).fadeOut();
  $(id_gadio_list).fadeIn();
})
