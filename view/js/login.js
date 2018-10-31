const url = window.location.href;
window.onload = function () {
    let inpU = document.getElementsByClassName('username')[0],
        inpP = document.getElementsByClassName('password')[0],
        inpRep = document.getElementsByClassName('repassword')[0],
        proU = document.getElementsByClassName('pro-use')[0],
        proP = document.getElementsByClassName('pro-pass')[0],
        _tips = document.getElementsByClassName('tips'),
        btnSub = document.getElementsByClassName('pro-sub')[0],
        btnRes = document.getElementsByClassName('pro-res')[0];
    let userStatus = false;
    let passStatus = false;
    inpU.onblur = function () {
        addTips.call(this)
    };
    inpP.onblur = function () {
        addTips.call(this)
    };
    if (inpRep) {
        inpRep.onblur = function () {
            if (inpP.value !== inpRep.value) {
                this.style.borderColor = 'red';
                _tips[2].innerHTML = '两次输入的密码不一致';
                _tips[2].style.color = 'red';
                passStatus = false;
            } else {
                this.style.borderColor = 'rgb(238,238,238)';
                this.style.borderStyle = 'groove';
                _tips[2].innerHTML = '两次密码一致';
                _tips[2].style.color = 'green';
                passStatus = true;
            }
        };
    }
    btnRes.onclick = function () {
        inpP.value = '';
        _tips[0].innerHTML = '由字母、数字、中文、下划线组成'
        inpU.value = '';
        _tips[1].innerHTML = '包含数字和字母的8位字符'
        passStatus = false;
        userStatus = false;
        if (inpRep) {
            _tips[2].innerHTML = '确认密码';
            inpRep.style.borderColor = 'rgb(238,238,238)';
            _tips[2].style.color = 'rgba(1,1,1,.2)';
        }
    }

    btnSub.onclick = function () {
       let _uName =  inpU.name;
       let _uVal =  inpU.value;
       let _pName =  inpP.name;
       let _pVal =  inpP.value;
        //只有确认密码正确后才能执行
            console.log(passStatus,userStatus)
        if (passStatus && userStatus) {
            ajax({
                type:'POST',
                url:url,
                data:{action:'reg',[_uName]:_uVal,[_pName]:_pVal},
                success:function (data) {
                    console.log(data)
                }
            })
        }
    }

    function addTips() {
        let _val = this.value;
        let _key = this.name;
        ajax({
            type: 'POST',
            url: url,
            data: {action:'test',name: _key, val: _val},
            success: function (data) {
                _tips[0].innerHTML = data;
                if(data === '可以注册'){
                    userStatus = true;
                }else{
                    userStatus = false
                }
            }
        })
    }

}