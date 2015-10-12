function route(handle, pathname, response, request){
	console.log("About to route a request for" + pathname);

	if(typeof handle[pathname] == 'function') {
		return handle[pathname](response, request);
	}else{
		console.log("No request handler found for" + pathname);
		// return "404 Not found"
		response.writeHead(404, {"content-type": "text/plain"});
		response.write("404 Not found1");
		response.end();
	}
}

exports.route = route;