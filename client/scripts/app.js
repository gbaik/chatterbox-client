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
      app.fetch();
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

var fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: 'order=-createdAt',
    contentType: 'application/json',
    success: function (data) {
      //iterate through the array
      _.each(data.results, (messageObj) => {
        app.renderMessage(messageObj);
      });
      console.log('chatterbox: Message received', data);
    },
    error: function (data) {
      console.error('chatterbox: Failed to receive message', data);
    }
  });
};

var clearMessages = function() {
  $('#chats').empty();
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
  //here
  nameDiv.append(name);
  contentDiv.append(content);
  newMessageDiv.append(nameDiv);
  newMessageDiv.append(content);
  $('#chats').append(newMessageDiv);
};

var renderRoom = function(roomName) {
  let newRoomOption = $('<option>' + roomName + '</option>');
  $('select').append(newRoomOption);
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

var attachEventHandlers = function() {
  $('#chats').on('click', app.handleUsernameClick);
  $('#send .submit').on('submit', app.handleSubmit);
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
  handleSubmit, handleSubmit,
  friendList: {}
};

$(document).ready(app.init);
