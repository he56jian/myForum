const path = require('path')
const fs = require('fs')
const url = require('url')
const http = require('http')
const untils = require('./until/until')
const querystring = require('querystring')      //用于解析post请求的数据；
let _status = true;     //用于阻隔连续点击两次的情况
let _canReg = false;
http.createServer((req, res) => {
    let _pathname = __dirname;		//获取当前目录
    if (req.method === 'GET') {
        let _reqUrl = req.url;
        if (_reqUrl) {               //如果发送的get请求为空；
            let para = '';
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
        } else {
            console.log('123123');
        }
    } else if (req.method === 'POST') {
        if (req.url == '/') {
            console.log('根目录')
            _reqOnData(function (_data) {					//处理请求到的数据
                untils.getMongoData(_data, responseData);
            })
        } else if (req.url === '/view/register.html') {
            if (_status) {
                _status = false;
                _reqOnData(function (_reqData) {		//处理请求到的数据
                    console.log(_reqData)
                    if (_reqData.action === 'test') {
                        textData(_reqData);     //判断是否能注册,并产生回执
                    }else if(_reqData.action ===  'reg') {
                        let _passVal = _reqData.password;
                        let _nameVal = _reqData.username;
                        let newPass = untils.setCrypro(_passVal);
                        let _addData = {username:_nameVal,password:newPass};

                        untils.addUser(_addData);
                    }
                });
                _status = true;
            }
        }
    } else if (req.url === '/view/login.html') {

    }

    /**
     * 验证数据是否能正常使用
     * @param _reqData
     */
    function textData(_reqData) {
        let _name = _reqData.name,
            _val = _reqData.val;
        if (_name === 'username') {
            //汉字、_、字母开头都能注册
            if (/^(_|[a-zA-Z\u4e00-\u9fa5])/.test(_val)) {
                untils.comparison(_reqData, function (data) {
                    responseData(data);
                });		//数据库中是否存在
            } else {
                responseData('格式不正确');
            }
        } else if (_name = 'password') {

        }
    }

    /**
     * 对请求到的数据进行处理
     * @param callback
     * @private
     */
    function _reqOnData(callback) {
        let _data = '';
        req.on('data', function (data) {         //每收到一次post发送过来的数据处理一次；
            _data += data;
        })
        req.on('end', function () {
            _data = querystring.parse(_data);
            callback && callback.call(null, _data);
        })
    }

    /**
     * //往页面中返回信息
     * @param data
     */
    function responseData(data) {       //返回数据
        res.write(data);
        res.end();
    }

}).listen(1204);

