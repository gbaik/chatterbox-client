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
    success: function (data) {
      console.log('chatterbox: Message received', data);
    },
    error: function (data) {
      console.log(app.server);
      console.error('chatterbox: Failed to receive message', data);
    }
  });
};

var clearMessages = function() {
  $('#chats').empty();
};

var renderMessage = function(message) {
  let newMessageDiv = $('<div></div>');
  let nameDiv = $('<div></div>');
  let contentDiv = $('<div></div>');
  let name = message.username;
  let content = message.text;
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

var app = {
  init: function() {},
  send: send,
  fetch: fetch,
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages/',
  clearMessages: clearMessages,
  renderMessage: renderMessage,
  renderRoom: renderRoom
};




