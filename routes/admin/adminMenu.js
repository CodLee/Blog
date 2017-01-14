var express = require('express');
var router = express.Router();

/* GET home page. */
/*  进入  管理员   路由  */
// 引入数据库
const MongoClient = require('mongodb').MongoClient;
// const url ='mongodb://localhost:27017/blog';//先在mongodb 中添加数据库
const url ='mongodb://127.0.0.1:27017/blog';//先在mongodb 中添加数据库
// 引入 objectid
const objectid = require('objectid');


/*  资源路径相对于的是 view 页面  */
// 默认  /admin/menu 进入的是分类的列表页
router.get('/', function(req,res,next){
	// 使用html 模板读取
  // res.send('文章标 菜单页面');
  // res.render('./admins/category_list.html');
  MongoClient.connect(url,(err,db)=>{
  	if(err) throw err;
  	let cats = db.collection('cats');
  	// 
  	cats.find().toArray((err,result)=>{
  		if(err) throw err;
  		// 此处的结果result  就是find后的数据----此处已经转为数组
  		// 在列表页，使用模板进行改造；
  		res.render('./admins/category_list.html',{data:result});
  	});
  });
});


//显示添加页面
router.get('/add',(req,res,next)=>{
	res.render('./admins/category_add.html');
});
//表单post提交  的信息转到此处
router.post('/add',(req,res,next)=>{
	// res.send('添加提交页面');
	// 第一步 ：获取表单的内容  ---post 使用的是body ---及表单提交的name属性
	let title = req.body.title;
	let sort= req.body.sort;
	// 第二部  ：链接到数据库 将数据形成集合 插入到mongodb 中
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		// 获取集合
		let cats = db.collection('cats');//查看是否有集合cats
		cats.insert({title:title,sort:sort},(err,result)=>{
			// 
			if(err){
				// res.send('添加分类失败');
				//增加提示页面
				res.render('./admins/message.html',{message:'添加分类失败',html:'/admin/menu/add',page:'返回添加分类'});
			}else{
				res.render('./admins/message.html',{message:'添加分类成功',html:'/admin/menu',page:'返回分类列表'});
			}
		});
	});
});


//显示编辑页面
router.get('/edit',(req,res,next)=>{
	// res.render('./admins/category_edit');
	let id = req.query.id;
	//链接库
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		//选择文档
		let cats = db.collection('cats');
		// 将找到的数据转为 数组，只有一条数据 的数组
		cats.find({_id:objectid(id)}).toArray((err,result) => {
			if (err) throw err;
			// console.info(result);
			res.render('./admins/category_edit.html', {data:result[0]});
		});
	});


});
//原有的 修改编辑 更新
router.post('/update',(req,res,next)=>{
	// res.send('修改编辑 分类编辑');
	let id = req.body.id;
	let sort = req.body.sort;
	let title =req.body.title;
	//链接库
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		//选择文档
		let cats = db.collection('cats');
		cats.update({_id:objectid(id)},{title:title,sort:sort},(err,result)=>{
			if(err){
				// res.send('添加分类失败');
				//增加提示页面
				res.render('./admins/message.html',{message:'编辑分类失败',html:'/admin/menu/update?id='+objectid(id),page:'返回编辑分类'});
			}else{
				res.render('./admins/message.html',{message:'编辑分类成功',html:'/admin/menu',page:'返回分类列表'});
			}

		});
	});
	
});


// 分类删除
router.get('/remove',(req,res,next)=>{
	// res.send('删除成功');
	// 获取——id
	let id = req.query.id;
	//链接库
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		//选择文档
		let cats = db.collection('cats');
		cats.remove({_id:objectid(id)},(err,result)=>{
			if(err){
				// res.send('添加分类失败');
				//增加提示页面
				res.render('./admins/message.html',{message:'删除分类失败',html:'/admin/menu',page:'返回分类列表'});
			}else{
				res.render('./admins/message.html',{message:'删除分类成功',html:'/admin/menu',page:'返回分类列表'});
			}

		});
	});
});
module.exports = router;
