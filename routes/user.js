var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/blog';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('用户登录界面！！！');
});
//显示登录页面
router.get('/login', function(req, res, next) {
  // res.send('用户登录界面！！！');
  res.render('./admins/login.html');
});
//登录页面验证
router.post('/login',(req,res,next)=>{
	let username = req.body.username;
	let password = req.body.password;
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		let users = db.collection('user');
		users.find({username:username,password:password}).toArray((err,result)=>{
			//result 为一个数组，如果密码账号不正确---没找到，数组为空，长度为0 ，表示假
			// console.info(result);console.info(result.length);
			if(result.length){// ok
				// console.info(username,password);
				//登录成功，保存登录标示，跳转页面--后台中心
				req.session.isLogin = 1;
				res.redirect('/admin');
			}else{
				//用户名和密码错误---跳回登录页面
				res.redirect('/user/login');
			}
			// res.send('测试');
		});
	});
});
//注销登录
router.get('/logout',(req,res,next)=>{
	//销毁session,跳转到登录页
	req.session.destroy();
	res.redirect('/user/login');
});
// 更改密码
router.get('/change',(req,res,next)=>{
	// res.send('更改泥马区域');
	res.render('./admins/change.html')
	
});
router.post('/change',(req,res,next)=>{
	let lee={
		name:'lee',
		password:'1991'
	}
	let username=req.body.username;
	let password=req.body.password;
	if(username==lee.name&&password==lee.password){
		res.render('./admins/changes.html');
	}else{
		res.send('<h1 style="color:red;font-size:50px;text-align:center;">请出示正确的身份！！！</h1>');
	}
});
router.post('/changes',(req,res,next)=>{
	let username=req.body.username;
	let password=req.body.password;
	MongoClient.connect(url,(err,db)=>{
		let user = db.collection('user');
		user.update({username:username},{$set:{password:password}},(err,result)=>{
			if(err){
				throw err;
			}else{
				res.send('<h1 style="color:red;font-size:50px;text-align:center;">更改密码成功！！！</h1>');
			}
		});
	});
});
//用户输入匹配是否存在
router.get('/users',(req,res,next)=>{
	let usernames = req.query.username;
	MongoClient.connect(url,(err,db)=>{
		let user = db.collection('user');
		user.find({username:usernames}).toArray((err,result)=>{
			res.json(result);//数组
		});
	});
});


module.exports = router;
