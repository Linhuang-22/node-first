window.onload = function(){
	// 实例并初始化我们的hichat程序
	var hichat = new Hichat();
	hichat.init();
};


// 定义Hichat类
var Hichat = function() {
	this.socket = null;
};



// 向原型添加业务方法
Hichat.prototype = {
	//初始化程序方法
	init: function() {
		var that = this;
		//建立到服务器的socket链接
		this.socket = io.connect();
		//监听socket的connect事件，此事件表示链接已经建立
		this.socket.on('connect', function() {
			//链接到服务器后，显示昵称输入框
			document.getElementById("info").textContent = 'get yourself a nickname :';
			document.getElementById("nickWrapper").style.display = "block";
			document.getElementById("nicknameInput").focus();
		});

		document.getElementById("loginBtn").addEventListener('click', function() {
			var nickName = document.getElementById("nicknameInput").value;

			if(nickName.trim().length != 0) {
				that.socket.emit("login", nickName);
			} else {
				document.getElementById("nicknameInput").focus();
			};
		}, false);

		this.socket.on('nickExisted', function() {
		     document.getElementById('info').textContent = '!nickname is taken, choose another pls'; //显示昵称被占用的提示
		 });

		this.socket.on('loginSuccess', function() {
		     document.title = 'hichat | ' + document.getElementById('nicknameInput').value;
		     document.getElementById('loginWrapper').style.display = 'none';//隐藏遮罩层显聊天界面
		     document.getElementById('messageInput').focus();//让消息输入框获得焦点
		 });

		this.socket.on('system', function(nickName, userCount, type) {
			
			var msg = nickName + (type == 'login' ? ' joined' : ' left');

			// //由于下面抽象在类方法里了，所以就不需要在这里拼接字符串了
			// var p = document.createElement('p');

			// p.textContent = msg;
			// document.getElementById("historyMsg").appendChild(p);

			that._displayNewMsg('system', msg, 'red');
			document.getElementById("status").textContent = userCount + (userCount > 1 ? ' users ' : ' user ') + ' online';
			/* Act on the event */
		});

		document.getElementById("sendBtn").addEventListener("click", function() {
			var messageInput = document.getElementById("messageInput"),
				msg = messageInput.value,
				//获取页面中input的颜色值
				color = document.getElementById("colorStyle").value;
			messageInput.value = "";
			messageInput.focus();

			if (msg.trim().length != 0) {
				//发送将颜色值也发送过去以方便其他用户端渲染
				that.socket.emit("postMsg", msg, color);
				that._displayNewMsg('me', msg, color);
			};
		});

		this.socket.on('newMsg', function(user, msg, color) {
			that._displayNewMsg(user, msg, color);
			/* Act on the event */
		});

		// 检测自己是否有发送图片，前提是必须支持h5的FileReader功能，并且将图片显示在自己的对话框，同时向服务器发送图片信息
		document.getElementById("sendImage").addEventListener('change', function() {
			//检查是否有文件被选中
			if (this.files.length != 0) {
				// 获取文件并且用FileReader进行读取     请去了解FileReader是什么……
				var file = this.files[0],
					reader = new FileReader();
				if (!reader) {
					that._displayNewMsg('system', "!your browser doesn\'t support fileReader", 'red');
					this.value = '';
					return;
				};
				// 图片文件读取成功，显示到页面并且发送到服务器
				reader.onload = function(e) {
					this.value = '';
					that.socket.emit('img', e.target.result);
					that._displayImage('me', e.target.result);
				}

				reader.readAsDataURL(file);
			};
		}, false);

		// 显示服务器传来的其他用户发送的图片
		this.socket.on('newImg', function(user, img) {
			that._displayImage(user, img);
			/* Act on the event */
		});

		//初始化Emoji表情包
		this._initialEmoji();

		// 点击标签按钮打开表情包
		document.getElementById('emoji').addEventListener('click', function(e) {
			var emojiwrapper = document.getElementById("emojiWrapper");
			emojiwrapper.style.display = 'block';
			//阻止冒泡行为
			e.stopPropagation();
		});
		// 点击页面其他地方隐藏表情包
		document.body.addEventListener('click', function(e) {
			var emojiwrapper = document.getElementById('emojiWrapper');
			if (e.target != emojiwrapper) {
				emojiwrapper.style.display = 'none';
			};
		});

		// 表情点击事件
		document.getElementById("emojiWrapper").addEventListener('click', function(e) {
			// 获取被点击的表情
			var target = e.target;
			if (target.nodeName.toLowerCase() == 'img') {
				var messageInput = document.getElementById("messageInput");
				messageInput.focus();
				//要想在输入框中 显示表情需要做dom操作
				messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
			};
		},false);

		// 为输入用户名确定按钮绑定会回车点击事件-自动完成
		document.getElementById("nicknameInput").addEventListener('keyup', function(e) {
			if (e.keyCode == 13) {
				var nickName = document.getElementById("nicknameInput").value;
				if (nickName.trim().length != 0) {
					that.socket.emit('login', nickName);
				};
			};
		},false);
		//为发送信息按钮绑定回车发送事件
		document.getElementById('messageInput').addEventListener('keyup', function(e) {
	      var messageInput = document.getElementById('messageInput'),
	          msg = messageInput.value,
	          color = document.getElementById('colorStyle').value;
	      if (e.keyCode == 13 && msg.trim().length != 0) {
	          messageInput.value = '';
	          that.socket.emit('postMsg', msg, color);
	          that._displayNewMsg('me', msg, color);
	      };
	  }, false);


	},

	_displayNewMsg: function(user, msg, color) {
		var container = document.getElementById('historyMsg'),
			msgToDisplay = document.createElement('p'),
			date = new Date().toTimeString().substr(0, 8),
			//通过类方法将表情转换为图片
			msg = this._showEmoji(msg);
		msgToDisplay.style.color = color || '#000';
		msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '):</span>' + msg;
		container.appendChild(msgToDisplay);
		container.scrollTop = container.scrollHeight;
	},

	_displayImage: function(user, imgData, color) {
		var container = document.getElementById('historyMsg'),
			msgToDisplay = document.createElement('p'),
			date = new Date().toTimeString().substr(0, 8);
		msgToDisplay.style.color = color || '#000';
		msgToDisplay.innerHTML = user + '<span class= "timespan">(' + date + ')</span><br />' + '<a href="' + imgData + '" target= "_blank"><img src="' + imgData + '" /></a>';
		container.appendChild(msgToDisplay);
		container.scrollTop = container.scrollHeight;


	},

	_initialEmoji: function() {
		var emojiContainer = document.getElementById('emojiWrapper'),
			docFragment = document.createDocumentFragment();
		for(var i = 69; i > 0; i--) {
			var emojiItem = document.createElement('img');
			emojiItem.src = '../content/emoji/' + i + '.gif';
			emojiItem.title = i;
			docFragment.appendChild(emojiItem);
		}
		emojiContainer.appendChild(docFragment);
	},

	_showEmoji: function(msg) {
	    var match, result = msg,
	        reg = /\[emoji:\d+\]/g,
	        emojiIndex,
	        totalEmojiNum = document.getElementById('emojiWrapper').children.length;
	    while (match = reg.exec(msg)) {
	        emojiIndex = match[0].slice(7, -1);
	        if (emojiIndex > totalEmojiNum) {
	            result = result.replace(match[0], '[X]');
	        } else {
	            result = result.replace(match[0], '<img class="emoji" src="../content/emoji/' + emojiIndex + '.gif" />');
	        };
	    };
	    return result;
	}


};


