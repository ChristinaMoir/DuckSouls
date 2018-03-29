// // export function for listening to the socket
// module.exports = function(socket) {
//   // var name = userNames.getGuestName();
//
//   // send the new user their name and a list of users
//   socket.emit('init', {
//     name: 'test'
//     // users: userNames.get()
//   });
//
//   // notify other clients that a new user has joined
//   socket.broadcast.emit('user:join', {
//     name: 'test'
//   });
//
//   // broadcast a user's message to other users
//   socket.on('send:message', function(data) {
//     socket.broadcast.emit('new:message', {
//       user: data.name,
//       text: data.message
//     });
//   });
//
//   socket.on('new:message', function(data) {
//     // $chat.append('<strong>' + data.nick + '</strong>: ' + data.msg + "<br/>");
//   });
//
//   // clean up when a user leaves, and broadcast it to other users
//   socket.on('disconnect', function() {
//     socket.broadcast.emit('user:left', {
//       name: 'test'
//     });
//   });
// };
