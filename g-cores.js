// Copyright (c) 2016 Catbaron. All rights reserved.

url_gcores = "http://www.g-cores.com";
// url_check_msg = url_gcores+'/setting/notifications?ajax=1';
// url_notifications = url_gcores+"/setting/notifications";
// url_inbox = url_gcores+"/inbox";

// information of podcasts
var podcast_info = JSON.parse("{}");

// Number of notifications
var notification_size = mail_size = 0;

// Return the URL used for ajax checking notifications
function getUrlNotificationsAjax(){
  return url_gcores+'/setting/notifications?ajax=1';;
}

// Return the URL of podcast page
function getUrlOfPodcastPage(id){
  return url_gcores + "volumes/" + id;
}

// Return the URL of the notification page
function getUrlNotificationsPage(){
  if(mail_size != 0){
    // if there is a direct message, go to page of inbox
    return url_gcores + "/inbox";
  }
  else if(notification_size != 0){
    // otherwise go to the page of notifications
    return url_gcores+"/setting/notifications";
  }
  else{
    return url_gcores;
  }
}

// Check if any new message
// Get the number of notifications and the mails, and show them on the
// extension button and the popup html
function checkMSG(url, checkMSGCallback){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
  // Needed, otherwise the response will be html instead of json data.
  xhr.setRequestHeader("Accept","application/json, text/javascript, */*; q=0.01");

  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
      checkMSGCallback(xhr, true);
    }
  }
  xhr.onerror = function(){
    checkMSGCallback(xhr, false);
  }
  xhr.send();
}
function checkMSGCallback(xhr, success){
  msg_number = "0";
  if(success){
    // The user is login, update the alert on the button
    try{
      msg = JSON.parse(xhr.responseText);
      mail_size = msg.mails_size;
      notification_size = msg.notifications_size;
      msg_number = mail_size + notification_size;
      if(parseInt(msg_number)>99){
        // If there're too many messages, show as 99+
        msg_number = "99+";
      }
      else{
        // otherwise show the number of the message
        msg_number = msg_number == 0? "" : msg_number.toString()
      }
    } catch (e) {
      // The response is not Json data
      // This condition may be caused by the fact that the user didn't login,
      // or the request if failed, or the URL is wrong.
      msg_number = "?";
    }
  }
  else{
    // Request failed
    msg_number = "?";
  }
  chrome.browserAction.setBadgeBackgroundColor({color: '#0000FF'});
  chrome.browserAction.setBadgeText({text: msg_number});
}

// Given the url of play pae of one podcast, this function will collect
// information including:
//  slides : [{image_url, intro_text}]
//  time segments: []
//  url of audio file
function collectInfomation(id){
  url = "http://www.g-cores.com/volumes/"+id;
  slides = new Array();
  time_segments = new Array();
  // console.log("read "+url);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
  xhr.setRequestHeader("Accept","application/xml, text/javascript, */*; q=0.01");
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
      // Get the html page, collect the information
      // The intro list is 3 more longer than the segment list:
      //    The first two intro slides are the same to the last two
      //    There is no '0' time segment
      // The real first slide (slide[1]) has no intro text
      doc = xhr.response.split("new AudioPlayer(")[1].split(/\);\s*}\s*\)\s*<\/script>/)[0];
      // doc = doc.split(/jplayerSwf: '\/jplayer.swf',/)[0];
      doc = doc.replace("mediaSrc","\"mediaSrc\"").replace("timelines","\"timelines\"");
      doc = doc.replace("jplayerSwf","\"jplayerSwf\"").replace("audioId","\"audioId\"");
      doc = doc.replace("'/jplayer.swf'","\"/jplayer.swf\"");
      // console.log(doc);
      podcast_info.id = JSON.parse(doc);
      // console.log(podcast_info[id]);
    }else{
      // Show the error message
    }
  }
  xhr.onerror = function(){
    // Show the error message
  }
  xhr.send();
}
// Receive the request message from the popup page
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if(message.msg == 'GetNumberOfNotification'){
    // Request for the number of notifications
    response = {'notification_size':notification_size, 'mail_size':mail_size}
  }
  if(message.msg == 'GetPodcastInfomation'){
    response = podcast_info.id;
  }
  sendResponse(response);
});
// collectInfomation("20764");
setInterval(function(){
  // console.log("23333");
  checkMSG(getUrlNotificationsAjax(), checkMSGCallback);
  collectInfomation("20764");
}, 5000)
