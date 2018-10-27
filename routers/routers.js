const Router = require('koa-router')
const router = new Router;

const data = {
	title:'练习',
	author:'何建成',
}

router.get('/',async (req,res)=>{
	console.log('1',req,res);
})

module.exports = router;