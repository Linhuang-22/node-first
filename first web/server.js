var http = require("http");
var url = require("url");
var formidable = require("formidable");


// function start(route, handle){
// 	// 调用匿名函数的方式
// 	http.createServer(function(request, response) {
// 		var pathname = url.parse(request.url).pathname;
// 		console.log("Request for " + pathname + " received");

// 		// route(handle, pathname);

// 		response.writeHead(200, {"content-type":"text/plain"});

// 		var content = route(handle, pathname)

// 		response.write(content);
// 		response.end();

// 	}).listen(8888);
// }



function start(route, handle) {
		function onRequest(request, response) {
			// // post数据
			// var postData = "";

			// // 获得请求路径并输出
			// var pathname = url.parse(request.url).pathname;
			// console.log("Request for " + pathname + " received.");
			// // 设置请求的信息文本格式
			// request.setEncoding("utf-8");
			// // 为request对象增加data的监听（post时会触发data事件【node将post数据分成若干小份】）
			// request.addListener("data", function(postDataChunk){
			// 	postData += postDataChunk;
			// 	console.log("Received POST data chunk '" + postDataChunk + "' .");
			// })
			// // 绑定end事件
			// request.addListener("end", function(){
			// 	route(handle, pathname, response, postData);
			// })
			// // // 调用路由
			// // route(handle, pathname, response);


			// 改为上传图片了
			var pathname = url.parse(request.url).pathname;
			console.log("Request for " + pathname + " received.");
			route(handle, pathname, response, request);
		}

		http.createServer(onRequest).listen(8888);
		console.log("Server has started.");
}

exports.start = start;
