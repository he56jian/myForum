 /*
*   ajax 方法
*       options 配置信息
* */
function ajax(options) {

    //http 请求类型
    options.type = /post/i.test(options.type) ? 'POST' : 'GET';
    //console.log( options.type);

    //异步或者同步
    options.async = options.async===false ? false : true;
    /*console.log(options.async)*/

    var xhr = new XMLHttpRequest();//实例化一个XMLHttpRequest对象

    var data = '';//user=韩梅梅&age=18
    for(var k in options.data){
        data+=k+'='+ encodeURIComponent(options.data[k])+'&';
        console.log(data)
    }

    //console.log(data);
    //是get还是post
    if(options.type === 'GET'){

        //get 参数是写在url上面的
        if(!/\?/.test(options.url)){

            options.url+='?';
        }else{

            if(!/(&\s*)$/.test(options.url)){

                options.url+='&';
            }
        }

        //加上时间避免缓存
        options.url += data+'_='+new Date().getTime();

        data = null;
    }
    //console.log(options.url)

    //打开一个连接
    xhr.open(options.type,options.url,options.async);

    //请求头
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');

    //监听状态发送改变
    xhr.onreadystatechange = function(){

        if(this.readyState === 4){//0 1 2 3 4
            if(this.status > 199 && this.status < 300 || this.status===304){

                //成功函数
                options.success && options.success.call(this,strJsonCode(this.response));
            }else{

                //失败函数
                options.error && options.error.call(this,this.status);
            }
        }
    };

    xhr.send(data);//发送 post需要传到send
}

//将字符串打包成json数据，打包失败，默认返回原字符串
function strJsonCode(str) {

    try {//写有可能报错的代码

        return JSON.parse(str);
    }catch (e) {//报错之后会执行的代码

        return str;
    }
}