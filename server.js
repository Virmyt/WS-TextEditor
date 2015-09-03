var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
port = process.argv[2] || 8888;

http.createServer(function(request, response) {

    var uri = url.parse(request.url).pathname
        , filename = path.join(process.cwd(), uri);

    var contentTypesByExtension = {
        '.html': "text/html",
        '.css':  "text/css",
        '.js':   "text/javascript"
    };

    fs.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }

            var headers = {};
            var contentType = contentTypesByExtension[path.extname(filename)];
            if (contentType) headers["Content-Type"] = contentType;
            response.writeHead(200, headers);
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 8080}),
    clients = {},
    keys = [],
    Client = function(obj) {
        var identifier,
            call,
            data;
    };

wss.on('connection', function connection(ws) {
    var id = Math.random();
    clients[id] = ws;
    ws.appId = id;
    keys = Object.keys( clients );
    console.log("новое соединение " + id);
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        wss.clients.forEach(function each(client) {
            if (client.appId != id) {
                client.send(message);
            }
        });
        //for( var i = 0,length = keys.length; i < length; i++ ) {
        //    if (keys[i] != id){
        //        clients[keys[i]].send(message);
        //        console.log('send to: '+keys[i]);
        //    }
        //}
    });

    ws.send('WS connected');
});
