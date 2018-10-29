const url = window.location.href;
window.onload = function () {
    let inpU = document.getElementsByClassName('username')[0],
        inpP = document.getElementsByClassName('password')[0],
        proU = document.getElementsByClassName('pro-use')[0],
        proP = document.getElementsByClassName('pro-pass')[0],
        btnSub = document.getElementsByClassName('pro-sub')[0],
        btnRes = document.getElementsByClassName('pro-res')[0];
    inpU.onblur = function (){addTips.call(this)};
    inpP.onblur = function (){addTips.call(this)};

    function addTips(){
        //失去焦点后步骤：
        //获取当前值；
        //使用ajax和后台交互，请求数据；
        let _val = this.value;
        let _key = this.name;
        ajax({
            type:'POST',
            url:url,
            data:{name:_key,val:_val},
            success:function (data) {
                let _tips = document.createTextNode(data);
                this.appendChild(_tips);
            }
        })
    }

}