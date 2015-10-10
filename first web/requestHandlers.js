
var exec = require("child_process").exec;
var querystring = require("querystring"),
	fs = require("fs");




function start (response, postData) {
	console.log("Request handler 'start' was called");

	// 模拟休眠函数
	// function sleep(milliSeconds) {
	// 	var startTime = new Date().getTime();
	// 	while(new Date().getTime() < startTime + milliSeconds);

	// }
	

	// 事件轮训小调查
	// for (var i = 0; i < 10; i++) {
	// setTimeout(function(){
	// console.log(new Date);
	// }, 2000);   

	// }

	// 模拟休眠函数调用
	// sleep(1);

	// 说明查找文件时，使用非阻塞的方式并不是正确的方式
	// var content = "empty";
	// return content;


	// 找到目录下所有文件并输出
	// exec("find /",
 //    	{ timeout: 1000000, maxBuffer: 20000*1024 },
	// 	function(error, stdout, stderr){
	// 	// content = stdout;

	// 	response.writeHead(200, {"Content-type": "text/plain"});
	// 	response.write(stdout);
	// 	response.end();
	// });

	// // 这里是只有文字上传并且显示出来的
	// var body = '<!DOCTYPE html><html>'+
 //    '<head>'+
 //    '<meta http-equiv="Content-Type" content="text/html; '+
 //    'charset=UTF-8" />'+
 //    '</head>'+
 //    '<body>'+
 //    '<form action="/upload" method="post">'+
 //    '<textarea name="text" rows="20" cols="60"></textarea>'+
 //    '<input type="submit" value="Submit text" />'+
 //    '</form>'+
 //    '</body>'+
 //    '</html>';


 //    response.writeHead(200, {"Content-type": "text/html"});
 //    response.write(body);
 //    response.end();


 	// // 上传文字和图片并且显示
 	// var body = '<html>'+
  //   '<head>'+
  //   '<meta http-equiv="Content-Type" '+
  //   'content="text/html; charset=UTF-8" />'+
  //   '</head>'+
  //   '<body>'+
  //   '<form action="/upload" method="post">'+
  //   '<textarea name="text" rows="20" cols="60"></textarea>'+
  //   '<input type="submit" value="Submit text" />'+
  //   '</form>'+
  //   '</body>'+
  //   '</html>';


   var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
	


	
}


function upload (response, postData) {
	console.log("Request handler 'upload' was called");
	// return "Hello UPload"

	// // 输出post的内容
	// response.writeHead(200, {"Content-type": "text/plain"});
	// response.write("You're sent: " + postData);
	// response.end();

	// 输出post的内容（使用querystring处理过）
	response.writeHead(200, {"Content-type": "text/plain"});
	response.write("You're sent the text:" + querystring.parse(postData).text);
	response.end();
}


function show(response, postData){
	console.log("Request handler 'show' was called.");
	fs.readFile("./tmp/test.png", "binary", function(error, file){
		if(error) {
		      response.writeHead(500, {"Content-Type": "text/plain"});
		      response.write(error + "\n");
		      response.end();
		    } else {
		      response.writeHead(200, {"Content-Type": "image/png"});
		      response.write(file, "binary");
		      response.end();
		    }
	});
}


exports.start = start;
exports.upload = upload;
exports.show = show;