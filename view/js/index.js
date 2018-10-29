const _headLogin = document.getElementsByClassName('head-login')[0],
    _headReg = document.getElementsByClassName('head-reg')[0],
    _artItemsList = document.getElementsByClassName('con-art-items')[0];		//获取文章列表；
const url = window.location.href;

var _userName = '作者', _artType = '类型', _artTitle = '标题', _artCreatTime = '创作时间', _artCommentNum = 0,_userImg;
ajax({
    type: 'POST',
    url: url,
    data: {
        articals:["tips","title","commentNum","auther","created"],
    },
    success: function (data) {
        init(data.articals);
    }
})
function init(data) {
    let _len = data.length;
    for (let i = 0; i < _len; i++) {
        createArtEle(data[i])
    }
}
/**
 * 添加文章列表
 * @param data 添加的数据
 */
function createArtEle(data) {
    _userName = data.auther.username,
    _userImg = data.auther.avatar,
        _artCommentNum = data.commentNum,
        _artTitle = data.title,
        _artType = data.tips,
        _artCreatTime = data.created;
    console.log(data)

    var eleItem = ['<li class="con-art-item fix">',
        '<section class="item-icon">',
        '<img src=\"',_userImg,'\" alt="icon" width="40px" height="40px">',
        '<p class="item-user">',
        _userName,
        '</p>',
        '</section>',
        '<section class="item-option">',
        '<p><span class="item-type">', _artType, '</span><span class="item-title">', _artTitle, '</span></p>',
        '<p class="item-time">', _artCreatTime, '</p>',
        '</section>',
        '<section class="item-comment">',
        '<i class="layui-icon layui-icon-file-b ver-mid"></i>',
        '<span class="ver-mid">', _artCommentNum, '</span>',
        '</section>',
        '</li>'
    ]
    _artItemsList.innerHTML += eleItem.join('');
}


