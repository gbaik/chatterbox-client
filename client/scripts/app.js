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


var app = {
  init: function() {},
  send: send,
  fetch: fetch,
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages/',

};




