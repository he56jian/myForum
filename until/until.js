const myUntils = {}
const events = require('events').EventEmitter;
const eventsEmitter = new events;

/**
 * 对数据的获取；
 * 还有些问题；当前获取的是已经知道的数据，如果是不知道库名的数据该怎么办？如果不知道数据的条目怎么办？
 * 有待完善；查找下对数据库的全部文档名的获取；对数据库文档条目的获取；
 */
const event = eventsEmitter;
myUntils.getMongoData = function (choice, callback) {
    const MongoClient = require('mongodb').MongoClient;
    var mongoUrl = 'mongodb://localhost:27017/';
    let _mongoData = '';
    let _finishNum = 0,
        _artData,
        _userData,
        _commentData,
        _allData = [],
        _docData = ["articals", "users", "comments"],
        _docLen = _docData.length;
    MongoClient.connect(mongoUrl, function (err, db) {				//连接数据库
            if (err) console.log(err);
            var dbo = db.db('user');									//创建可操作的user对象；
            // dbo.collection(_docData[0], {useNewUrlParser: true}).find({}).toArray(function (err, data) {
            //     let artKeyArr = Object.keys(data[0]);
            //     let _len = artKeyArr.length;
            //     for (let i = 0; i < _len; i++) {
            //         _artData[i] = '\"' + artKeyArr[i] + '\":\"' + data[0][artKeyArr[i]] + '\"';
            //     }
            //     _artData = _artData.join(',');
            //     _artData = ',\"article\":{' + _artData + '}';
            //     _mongoData += _artData;
            //     eventsEmitter.emit('finishOne')
            // })
            // dbo.collection(_docData[1], {useNewUrlParser: true}).find({}).toArray(function (err, data) {
            //    let conData = [];                                               //创建一个用于存放数据的数组
            //    	let _mongodata = [];
            //    	for (let k = 0, kLen = data.length; k < kLen; k++) {
            //    		let _rKeyArr = Object.keys(data[k]);              //获取每个文档中的key的集合；是一个数组集合
            //    		let _len = _rKeyArr.length;
            //    		for (let i = 0; i < _len; i++) {                    //遍历每个文档集合；把集合转成字符串
            //    			conData[i] = '\"' + _rKeyArr[i] + '\":\"' + data[k][_rKeyArr[i]] + '\"';
            //    		}
            //    		_mongodata[k] = conData.join(',');
            //    		_mongodata[k] = '\"' + mongoName + k + '\":{' + _mongodata[k] + '}';
            //    	}
            //    	_mongodata = _mongodata.join(',');
            //    	_userData = ',\"' + mongoName + '\":{' + _mongodata + '}';
            //     _mongoData += _userData;
            //     eventsEmitter.emit('finishOne')
            // })
            //
            // dbo.collection(_docData[2], {useNewUrlParser: true}).find({}).toArray(function (err, data) {
            //     for (let k = 0, kLen = data.length; k < kLen; k++) {
            //         let commentKeyArr = Object.keys(data[k]);
            //         let _len = commentKeyArr.length;
            //         for (let i = 0; i < _len; i++) {
            //             _commentData[i] = '\"' + commentKeyArr[i] + '\":\"' + data[k][commentKeyArr[i]] + '\"';
            //         }
            //     }
            //     _commentData = _commentData.join(',');
            //     _commentData = ','+_docData[2]+':{' + _commentData + '}';
            //     _mongoData += _commentData;
            //     eventsEmitter.emit('finishOne')
            // })

            for (let _doc = 0; _doc < _docLen; _doc++) {
                dbo.collection(_docData[_doc], {useNewUrlParser: true}).find({}).toArray(function (err, data) {
                    getData(data, _docData[_doc]);          //data是一个数组对象，其内部存放的格式是，一个文档为一个数组位；
                    eventsEmitter.emit('finishOne')
                })
            }

            function getData(data, mongoName) {                                             //如果data 是一个json对象，
                let conData = [];                                               //创建一个用于存放数据的数组
                let _mongodata = [];
                for (let k = 0, kLen = data.length; k < kLen; k++) {
                    let _rKeyArr = Object.keys(data[k]);              //获取每个文档中的key的集合；是一个数组集合
                    let _len = _rKeyArr.length;
                    for (let i = 0; i < _len; i++) {                    //遍历每个文档集合；把集合转成字符串
                        conData[i] = '\"' + _rKeyArr[i] + '\":\"' + data[k][_rKeyArr[i]] + '\"';
                    }
                    _mongodata[k] = conData.join(',');
                    _mongodata[k] = '\"' + mongoName + k + '\":{' + _mongodata[k] + '}';
                }
                _mongodata = _mongodata.join(',');
                _mongodata = ',\"' + mongoName + '\":{' + _mongodata + '}';
                _mongoData += _mongodata;
            }

            //把数据库的内容传递回去；；
            eventsEmitter.on('finishOne', function () {
                _finishNum++;
                if (_finishNum >= _docLen) {
                    eventsEmitter.emit('finishAll');
                }
            })
            eventsEmitter.on('finishAll', function () {
                _mongoData = _mongoData.substr(1)
                _mongoData = '{' + _mongoData + '}';
                _finishNum = 0;
                eventsEmitter.removeAllListeners();
                _mongoData = _choiceData(choice, _mongoData);
                callback.call(null, _mongoData);
            });
        }
    )
}

/**
 * 处理需要返回的数据
 * @param choice 需要获取的数据对象列表
 * @param data    数据库中的数据
 * @returns {*}
 * @private
 */
function _choiceData(choice, data) {
    let _data = JSON.parse(data)
    // console.log(typeof _data);
    let resData = {};
    let userData = _data.users;
    let redDataItem = [];
    if (choice) {
        _ergloop(choice, function (key) {
            // console.log(key)
            const _dataKey = _ergloop(_data);
            let _dataIndex = _dataKey.indexOf(key);
            // console.log(_dataKey[_dataIndex] )          //获取文档名；
            // if (_dataKey[_dataIndex] === 'users') {
            //     //如果是要获取users文档时，需要根据art的数据获取相关user的对象；因为只用获取一个文档；
            //     let userItem = _data[_dataKey[_dataIndex]];
            //     _ergloop(userItem, function (userKey) {
            //         if (userItem[userKey]._id === resData.articals.auther) {
            //             let _dataValue = _data[_dataKey[_dataIndex]]            //获取user文档下的的文档对象；
            //             let choiceData = choice[key].split(',');
            //             resData[_dataKey[_dataIndex]] = _getData(_dataValue, choiceData);
            //         }
            //     })
            // } else {
            let _dataValue = _data[_dataKey[_dataIndex]]            //获取artical或者user文档下的的文档对象；
            // console.log(_dataValue)
            let choiceData = choice[key].split(',');
            let _dataItems = _data[_dataKey[_dataIndex]];
            _ergloop(_dataItems, function (itemKey, index) {
                // console.log(index);
                redDataItem[index] = _getData(_dataValue, choiceData, userData);
            })
            resData[_dataKey[_dataIndex]] = redDataItem;
        });
    }
    // console.log(JSON.stringify(resData))
    return JSON.stringify(resData);
}

/**
 * 遍历dataValue文档下的所有文档对象，然后根据数组regChoice中的参数获取最终值；
 * @param dataValue   原文档；
 * @param regChoice     需要在源文档中获取的数据的Key集合
 * @private
 */
function _getData(dataValue, regChoice, userData) {
    let resdata = {};
    _ergloop(dataValue, function (dataKey) {                                                     //遍历所有文档，获取其值；
        _ergloop(regChoice, (choiceKey) => {                                                   //遍历选择的规则，即choice中的值；
            if (regChoice[choiceKey] == 'auther') {                  //如果遍历到了auther时，就把对应的user对象给他；
                _ergloop(userData, function (key, index) {                                //遍历所有用户文档
                    _ergloop(userData[key], function (userItem) {                          //遍历所有用户对象
                        if (userData[key][userItem] === dataValue[dataKey].auther) {      //寻找与当前文章的作者匹配的用户对象并赋值
                            resdata[regChoice[choiceKey]] = userData[key];
                        }
                    })
                })
            } else if (regChoice[choiceKey] == 'created') {
                let date = dataValue[dataKey][regChoice[choiceKey]];
                let artdate = new Date().dateForm(new Date(date));
                resdata["created"] = artdate;           //获取其最终值；并保存到resdata中；
            } else {
                resdata[regChoice[choiceKey]] = dataValue[dataKey][regChoice[choiceKey]];           //获取其最终值；并保存到resdata中；
            }
        })
    })
    return resdata;
}


/**
 * 循环遍历
 * @param ergdata 如果是
 * @private
 */
function _ergloop(ergdata, callback) {
    if (typeof ergdata == 'object') {
        let _ergdata = Object.keys(ergdata),
            _erglen = _ergdata.length;
        for (let i = 0; i < _erglen; i++) {
            // console.log(i)
            callback && callback(_ergdata[i], i);
        }
        return _ergdata;
    }
}

//
// /**
//  * 循环遍历函数
//  * @param data  需要遍历的对象
//  */
// function _ergLoop(data) {
//     for (let keys in data) {
//         let _value = data[keys];
//         createArtEle(_value);
//     }
// }


Date.prototype.dateForm = function (date) {
    let _dateObj = [date.getFullYear(),'年',date.getMonth() + 1,
        '月', date.getDate(), '日']
    return _dateObj.join('');
}


myUntils.event = event;
module.exports = myUntils;

//考虑到获取的评论数据内容不是固定的数量
