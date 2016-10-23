// Copyright (c) 2016 Catbaron. All rights reserved.

url_gcores = "http://www.g-cores.com";
// url_check_msg = url_gcores+'/setting/notifications?ajax=1';
// url_notifications = url_gcores+"/setting/notifications";
// url_inbox = url_gcores+"/inbox";

// Info of podcasts
var podcast_info = JSON.parse("{}");

// Number of notifications
var notification_size = mail_size = 0;

// Return the URL of list of Gadio
function getUrlOfGadioList(){
  // alert(url_gcores+'/categories/9/originals')
  return url_gcores+'/categories/9/originals';
}

// Return the URL used for ajax checking notifications
function getUrlNotificationsAjax(){
  return url_gcores+'/setting/notifications?ajax=1';
}

// Return the URL of podcast page
function getUrlOfPodcastPage(id){
  return url_gcores + "/volumes/" + id;
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
// and return Info as json data:
function collectInfo(id){
  url = getUrlOfPodcastPage(id);
  podcast_info = {'test':2333};
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
  xhr.setRequestHeader("Accept","application/xml, text/javascript, */*; q=0.01");
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
      // Get the html page, collect the Info
      // The Info is organized as Json data
      // TODO: comment about the content of the Json data
      doc = xhr.responseText.split("new AudioPlayer(")[1].split(/\);\s*}\s*\)\s*<\/script>/)[0];
      doc = doc.replace("mediaSrc","\"mediaSrc\"").replace("timelines","\"timelines\"");
      doc = doc.replace("jplayerSwf","\"jplayerSwf\"").replace("audioId","\"audioId\"");
      doc = doc.replace("'/jplayer.swf'","\"/jplayer.swf\"");
      podcast_info = JSON.parse(doc);
      podcast_info.last_time = 0;
    }else{
      // TODO: Show the error message
    }
  }
  xhr.onerror = function(){
    // TODO: Show the error message
  }
  xhr.send();
  return podcast_info;
}


// Receive the request message from the popup page
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if('GetNumberOfNotification' == message.msg){
    // Request for the number of notifications
    response = {'notification_size':notification_size, 'mail_size':mail_size}
    sendResponse(response);
  }
  if('GetPodcastInfo' == message.msg){
    // Request for gadio's Info
    console.log(message.data.id);
    response = collectInfo(message.data.id);
    sendResponse(response);
  }
  if('GetGadioList' == message.msg){
    // Request for the list of Gadio

    // parameter:
    //  list: array of DOM nodeList
    //  response: return to the popup page
    function readGadioInfo(list){
      response = new Array;
      for(var i=0; i<list.length; i++){
        node = $(list[i]);
        node_time = node.find('.showcase_time');
        node_img = node.find('.showcase_img');
        node_text = node.find('.showcase_text');
        // get date time
        node_time.find('span').text('');  //remove the introduction in <span>
        time = node_time.text().trim()

        // get the urls of the cover image and the podcast
        url_podcast = node_img.find('a').attr('href');
        url_img = node_img.find('img').attr('src');
        // get the id of the podcast
        slices = url_podcast.split('/');
        id = slices[slices.length-1];
        // get the title
        title = node_text.find('a').text().trim();
        //save the Info to the response
        response.push({
          'id': id,
          'time': time,
          'url_podcast': url_podcast,
          'url_img': url_img,
          'title': title
        });
      }
      return response;
    }
    htmlobj = $.ajax({url:getUrlOfGadioList(), async:false});
    nodes = $(htmlobj.responseText).find('.row')[0].children;;
    response = readGadioInfo(nodes);
    sendResponse(response);
  }

  if('PlayGadio' == messgae.msg){
    //
    // src = message.data.track_src;
    // time = message.data.start_time;
    // audio_player = $("#audio_player")[0];
    // audio_player.src = src;
    // alert(audio_player);
    // audio_player.play();
  }

});

setInterval(function(){
  checkMSG(getUrlNotificationsAjax(), checkMSGCallback);
  // TODO: Check if there is a new podcdast
  // collectInfo("20764");
}, 5000)
