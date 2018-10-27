const http = require('http')
const url = require('url')
const qs = require('querystring')
const fs = require('fs');
const path = require('path');
http.createServer((request, response) => {
    //先要判断是get请求还是post请求；request这是浏览器发送过来的请求信息；
    // if(request.method ==='get'){
    //     console.log('11')
    //     const _url = url.parse(req.url,true);       //根据域名获取url对象
    //     console.log(_url);
    //     const clientData = url.query;//客户端发送过来的数据
    //     //往客户端发送数据
    //     res.write()
    //     res.end();
    // }else if(request.method === 'post'){
    //
    //
    // }

    // 获取当前路径

    let _pathname = __dirname
    let _reqUrl = request.url;
    if (_reqUrl) {
        if (_reqUrl == '/favicon.ico') {
            return response.end();
        }
        _pathname += url.parse(_reqUrl).pathname;
    }

    //获取其拓展名，用于判断其文件类型，方便设置请求头；

    if (_pathname.charAt(_pathname.length - 1) == '/') {
        _pathname += 'newviews/index.html';
    }
        response.setHeader('Access-Control-Allow-Origin', '*');              //设置允许跨域
    //判断路径是否存在
    if (fs.existsSync(_pathname)) {
        switch (path.extname(_pathname)) {
            case ".html":
                response.writeHead(200, {"Content-Type": "text/html"});
                break;
            case ".js":
                response.writeHead(200, {"Content-Type": "text/javascript"});
                break;
            case ".css":
                response.writeHead(200, {"Content-Type": "text/css"});
                break;
            case ".gif":
                response.writeHead(200, {"Content-Type": "image/gif"});
                break;
            case ".jpg":
                response.writeHead(200, {"Content-Type": "image/jpeg"});
                break;
            case ".png":
                response.writeHead(200, {"Content-Type": "image/png"});
                break;
        }
    }
    fs.readFile(_pathname, (err, data) => {
        if (err) console.log(err);
        response.write(data);
        return response.end();
    });
}).listen(3000)


