// const view = new View();
// view.init();
// console.log('app is loading');


var send = function(message) {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      app.fetch(message.roomname);
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

var fetch = function(currentRoom = undefined) {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: 'order=-createdAt',
    contentType: 'application/json',
    success: function (data) {
      //iterate through the array
      _.each(data.results, (messageObj) => {
        //this will be the default path, render everything if currentRoom not specified
        if (currentRoom === undefined || currentRoom === 'All') {
          app.renderMessage(messageObj);
          app.renderRoom(messageObj.roomname);
        } else {
          if (messageObj.roomname === currentRoom) {
            app.renderMessage(messageObj);
          }
        }
      });
      console.log('chatterbox: Message received', data);
    },
    error: function (data) {
      console.error('chatterbox: Failed to receive message', data);
    }
  });
};

var clearMessages = function() {
  $('.message').empty();
};

var renderMessage = function(message) {
  const bannedWords = ['<', '>', 'script', 'for(', 'for (', 'console'];
  let name = message.username;
  let content = message.text;
  for (let i = 0; i < bannedWords.length; i++) {
    if (name && content) {
      if (name.indexOf(bannedWords[i]) !== -1 || content.indexOf(bannedWords[i]) !== -1) {
        return;
      }
    }
  }

  let newMessageDiv = $('<div class = "message"></div>');
  let nameDiv = $('<div class="username"></div>');
  let contentDiv = $('<div></div>');

  nameDiv.append(name);
  contentDiv.append(content);
  newMessageDiv.append(nameDiv);
  newMessageDiv.append(content);
  $('#chats').append(newMessageDiv);
};

var renderRoom = function(roomname) {
  if (app.roomList[roomname] !== true) {
    let newRoomOption = $('<option>' + roomname + '</option>');
    $('select').append(newRoomOption);
  }
  app.roomList[roomname] = true;
};

var handleUsernameClick = function(event) {
  let element = event.target;
  let $element = $(element);
  if ($element.attr('class') === 'username') {
    let friendName = $element.text();
    app.friendList[friendName] = true;
  }
  let allUsernames = $('.username');

  $.each(allUsernames, (usernameDiv) => {
    let username = allUsernames[usernameDiv];
    let $username = $(username);
    if (app.friendList[$username.text()]) {
      $username.css('font-weight', 'Bold');
    }
  });
};

var handleSubmit = function (event) {
  event.preventDefault();
  var content = $('textarea').val();
  //username
  var url = window.location.href;
  //the username will always follow the equals sign, it looks like only spaces are
  //transformed to a different character -- '%20'
  var rawUsernameBeginIndex = url.indexOf('=');
  var rawUsername = url.substring(rawUsernameBeginIndex + 1);
  var username = rawUsername.split('%20').join(' ');

  //roomname
  var messageObj = {username: username,  text: content};
  app.send(messageObj);
};

var handleRoomChange = function (event) {
  console.log('select el changed');
  // let room = event.target;
  // console.log(room);
  let roomName = $('.roomOptions option:selected').text();
  //clear current messages from the screen
  app.clearMessages();
  //fetch the messages again from the server
  app.fetch(roomName);
  //render only the messages that have a roomname property that matches roomName
  // i think this would require providing a default argument to the fetch method
  // assuming you don't have a roomname -- or if roomname param is undefined,
  // then simply render everything
};

var attachEventHandlers = function() {
  $('#chats').on('click', app.handleUsernameClick);
  $('#send .submit').on('submit', app.handleSubmit);
  $('select').on('change', app.handleRoomChange);
};


var app = {
  init: function() {
    //fetch the data from the server
    app.fetch();
    attachEventHandlers();
  },
  send: send,
  fetch: fetch,
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages/',
  clearMessages: clearMessages,
  renderMessage: renderMessage,
  renderRoom: renderRoom,
  handleUsernameClick: handleUsernameClick,
  handleSubmit: handleSubmit,
  handleRoomChange: handleRoomChange,
  friendList: {},
  roomList: {}
};

$(document).ready(app.init);

/*
tried to add event listener to option -- no options there by default
if you add event listener to the select element, though, it will grab the text
from whatever option was visually already there in the select box

need to wait until the options are rendered fully
*/
