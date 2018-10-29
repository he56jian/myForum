const path = require('path')
const fs = require('fs')
const url = require('url')
const http = require('http')
const untils = require('./until/until')
const querystring = require('querystring')      //用于解析post请求的数据；

http.createServer((req, res) => {
    let _pathname = __dirname;		//获取当前目录
    if (req.method === 'GET') {
        if (!url.query) {               //如果发送的get请求为空；
            let para = '';
            let _reqUrl = req.url;
            if (_reqUrl) {			//如果有请求地址的时候
                if (_reqUrl == '/favicon.ico') {				//判断请求的是否为图标；是的话不作为
                    return res.end();
                }
                _pathname += url.parse(_reqUrl).pathname;
            }
            //在第一次解析时，就是解析的_pathname ,而第一次的页面为index.html	,
            if (_pathname.charAt(_pathname.length - 1) == '/') {
                _pathname += 'view/index.html';
            }
            res.setHeader('Access-Control-Allow-Origin', '*');			//设置允许跨域
            if (fs.existsSync(_pathname)) {			//路径存在才执行后面
                switch (path.extname(_pathname)) {
                    case '.html':
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        break;
                    case '.js':
                        res.writeHead(200, {'Content-Type': 'text/javascript'});
                        break;
                    case '.css':
                        res.writeHead(200, {'Content-Type': 'text/css'});
                        break;
                    case '.gif':
                        res.writeHead(200, {'Content-Type': 'image/gif'});
                        break;
                    case '.png':
                        res.writeHead(200, {'Content-Type': 'image/png'});
                        break;
                    case '.jpg':
                        res.writeHead(200, {'Content-Type': 'image/jpeg'});
                        break;
                    default:
                        res.writeHead(200, {'Content-Type': 'application/json'})
                        break;
                }
            }
            fs.readFile(_pathname, function (err, data) {
                if (err) console.log(err);
                res.write(data);
                res.end()
            })
        }else{
             console.log(url.query);
        }
    } else if (req.method === 'POST') {
        if (req.url =='/') {
            let _data = '';
            req.on('data',function (data) {         //每收到一次post发送过来的数据处理一次；
                // console.log(querystring.parse(data));
                _data +=data;
            })
            req.on('end',function () {
                _data = querystring.parse(_data);
            untils.getMongoData(_data,responseData);
            })
        }else if(req.url === '/view/login.html'){
            let _reqData = '';
            req.on('data',function (data) {
                _reqData +=data;
            })
            req.on('end',function () {
                _reqData = querystring.parse(_reqData);
                let _name = _reqData.name,
                    _val = _reqData.val;
                console.log('发送了数据')
                if(_name === 'password'){
                    _reqData._val =  untils.setCrypro(_val)
                }
                untils.comparison(_reqData);
            })
        }
    }

    function responseData(data) {       //返回数据
        res.write(data);
        res.end();
    }

}).listen(1204);


//出现的问题:Cannot find module 'E:\web_learning\myblog\nodejs-blog\demofavicon.ico'
// 说明：就是说没有找到nodejs-blog下的ico文件；
//解决： 两种思路：1、在req.url获取请求时判断，是请求ico时，结束不操作；2、是添加一个ico图标
//
// 出现的问题2：Cannot set headers after they are sent to the client
// 说明：出现这种情况是说明浏览器请求一次后，服务器却返回了两次或以上的响应；因为代码中存在异步回调，不处理好就会出现；
// 解决：在每次请求处理中，一旦服务器返回响应，就及时的使用return；用以结束当次服务器的响应；

//出现的问题3：页面出来了，但是样式没有；但是没有报错
//说明：css样式表没有解析，查看后分析为fs.readFile的第一个参数为固定的地址，一直解析的就是html，css没有解析；
//解决：把fs.readFile第一个参数设置为_pathname;

//出现的问题4：no such file or directory, open 'G:\TanZhou\Task\newBlog\newviews\index.html'
//说明，没有找到该文件或者目录；

//出现的问题5：Unexpected token } in JSON at position 1129
//说明：是由于使用JSON.parse的时候格式出错了；检查好字符串的格式就可以了，严格按照{"key":{"key11":"value11"},"key2":"value2"}
//解决：网上查找到的json格式检查的工具：http://www.bejson.com/

//出现的问题5：点击刷新/根目录两次会出现报错：write after end
//说明：之前的操作：是事件的机制问题，当第二次向后台请求数据时，由于第一次的监听还存在，第二次又重新创建了一个监听，所以就出现了同一个事件监听触发两次；
//解决：在每次处理事件之后清除所有事件；
