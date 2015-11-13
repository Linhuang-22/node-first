 // 引入http模块
 var express = require("express"),
 	 app = express(),

	 server = require("http").createServer(app),
	 io = require("socket.io").listen(server),
	 users = [];



app.use('/', express.static(__dirname + '/www'));  //指定静态HTML文件的位置


 server.listen(8080);
 console.log("服务器启动，端口号8080");


// socket后端处理部分
 io.on('connection', function(socket) {
 	// // 接收并处理客户端发送的foo事件
 	// socket.on('foo', function(data){
 	// 	// 将接收到的消息输出到控制台
 	// 	console.log(data);
 	// })
 	var i = 1;
 	console.log(++i + "\n");



 	socket.on("login", function(nickname) {
 		if(users.indexOf(nickname) > -1) {
 			socket.emit("nickExisted");
 			console.log(nickname + "quit.\n");
 		} else {
 			console.log(nickname + "login.\n");
 			socket.userIndex = users.length;
 			socket.nickname = nickname;
 			users.push(nickname);
 			socket.emit("loginSuccess");
 			io.sockets.emit("system", nickname, users.length, 'login');
 		};
 	})

 	socket.on('disconnect', function() {
 		users.splice(socket.userIndex, 1);

 		socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
 		/* Act on the event */
 	});

 	// 接收某客户传来的信息，并且向其他客户都发送改信息
 	socket.on('postMsg', function(msg, color) {
 		socket.broadcast.emit('newMsg', socket.nickname, msg, color);
 		/* Act on the event */
 	});

 	// 接收某客户传来的图片信息，并且向其他客户都发送该信息
 	socket.on('img', function(imgData) {
 		socket.broadcast.emit('newImg', socket.nickname, imgData);
 		/* Act on the event */
 	});


 });
