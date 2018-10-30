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
			} else {
				this.style.borderColor = 'rgb(238,238,238)';
				this.style.borderStyle = 'groove';
				_tips[2].innerHTML = '两次密码一致';
				_tips[2].style.color = 'rgba(1,1,1,.2)';
			}
		};
	}

	function addTips() {
		let _val = this.value;
		let _key = this.name;
		ajax({
			type: 'POST',
			url: url,
			data: {name: _key, val: _val},
			success: function (data) {
				_tips[0].innerHTML = data;
			}
		})
	}

}