const url = window.location.href;
window.onload = function () {
    let inpU = document.getElementsByClassName('username')[0],
        inpP = document.getElementsByClassName('password')[0],
        proU = document.getElementsByClassName('pro-use')[0],
        proP = document.getElementsByClassName('pro-pass')[0],
        _tips = document.getElementsByClassName('tips')[0],
        btnSub = document.getElementsByClassName('pro-sub')[0],
        btnRes = document.getElementsByClassName('pro-res')[0];
    inpU.onblur = function (){addTips.call(this)};
    inpP.onblur = function (){addTips.call(this)};

    function addTips(){
        let _val = this.value;
        let _key = this.name;
        ajax({
            type:'POST',
            url:url,
            data:{name:_key,val:_val},
            success:function (data) {
				_tips.innerHTML = data;
            }
        })
    }

}