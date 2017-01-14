var express = require('express');
var router = express.Router();


// 引入数据库
const MongoClient = require('mongodb').MongoClient;
//先在mongodb 中添加数据库---如果没有网络链接，则使用本地ip  127.0.0.1
// const url ='mongodb://localhost:27017/blog';
const url ='mongodb://127.0.0.1:27017/blog';
// 引入 objectid
const objectid = require('objectid');
// 引入multiparty模块，用于上传文件
const multiparty = require('multiparty');
const fs=require('fs');


/* GET home page. */
/*  进入  管理员   路由  */
/*  资源路径相对于的是 view 页面  */
// 默认3000/admin/article进入的是文章的列表页
router.get('/', function(req, res, next) {
	// 使用html 模板读取  res.send('文章标 菜单页面');
 	// res.send('文章列表页');
  	// res.render('./admins/article_list');////读取 模板文件失败，很可能为  模板文件内部模板语法错误
	// 链接数据库----
	/*	MongoClient.connect(url,(err,db)=>{
			if(err) throw err;
			let articles = db.collection('articles');//读取集合
			// 将找到的文件转为数组----此处文件为分类信息
			articles.find().sort({times:-1}).toArray((err,result)=>{
				if(err) throw err;
				res.render('./admins/article_list',{data:result});
			});
		});*/
	MongoClient.connect(url,(err,db)=>{
    	if(err) throw err;
    	let articles = db.collection('articles');// 文章 集合
    	articles.find().sort({times:-1}).toArray((err,result)=>{//找到文章返回---按时间逆序排列
	  	  if(err) throw err;
          // 此处使用ajax请求，result1是一个什么数据 数组 slice(0,1) 包含0 不包含1
          //console.info(typeof result1);
          //console.info('123');
          let page = req.query.page||1;//当前页
          let length = 10;//每页现实的文章数
          let start =(page-1)*length; 
          let end = start+length;
          let num =result.length;//文章总数
          let pages=Math.ceil(num/length);//页数
          let result1 = result.slice(start,end);//截取前5条数据

          //console.info(result11);
          //生成ajax对象，传递下标
          let ajax={
            title:undefined,//全选，没有按照分类--title查找
            pages:pages,//总页数
            num:num,//总文章数
            length:length,//每页文章数
            page:page//当前页
          }
          res.render('./admins/article_list',{data:result1,ajax:ajax});
    	});
    });
});

//page页ajax请求

router.get('/page', function(req, res, next) {
	// 使用html 模板读取  res.send('文章标 菜单页面');
 	// res.send('文章列表页');
  	// res.render('./admins/article_list');////读取 模板文件失败，很可能为  模板文件内部模板语法错误
	// 链接数据库----
	//console.info('ajax');
	let page=req.query.page;
	MongoClient.connect(url,(err,db)=>{
    	if(err) throw err;
    	let articles = db.collection('articles');// 文章 集合
    	articles.find().sort({times:-1}).toArray((err,result)=>{//找到文章返回---按时间逆序排列
	  	  if(err) throw err;
          // 此处使用ajax请求，result是一个什么数据 数组 slice(0,1) 包含0 不包含1
          //console.info(typeof result);
          //console.info('123');
          let page = req.query.page||1;//当前页
          let length = 10;//每页现实的文章数
          let start =(page-1)*length; 
          let end = start+length;
          let num =result.length;//文章总数
          let pages=Math.ceil(num/length);//页数
          let result1 = result.slice(start,end);//截取前5条数据
          res.json(result1);
    	});
    });
});

//显示添加文章页面
router.get('/add',(req,res,next)=>{
	// res.render('./admins/article_add');
	// 读取文章分类的内容
	
	// 链接数据库
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		let cats = db.collection('cats');//读取集合
		// 将找到的文件转为数组----此处文件为分类信息
		cats.find().toArray((err,result)=>{
			if(err) throw err;
			res.render('./admins/article_add',{data:result});
		});
	});
});
// 编辑文章提交页面
router.post('/adds',(req,res,next)=>{
	// res.send('adds 文章页面')
	// res.render('./admins/article_edit');
	
	//没有上传功能的 
	/*// 获取提交的数据
		let category_id = req.body.category_id;//分类
		let subject = req.body.subject;//标题
		let cover = req.body.cover;//封面   ---一般为图图片，稍后处理
		let summary= req.body.summary;//摘要
		let content= req.body.content;//内容
		let times = new Date();//时间保存为事件对象。。在显示的时候，再更改为toLocaleString
		let count = 100;  //
		// 链接数据库---建立文章集合
		MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		let articles = db.collection('articles');//读取集合
		// 将找到的文件转为数组----此处文件为分类信息
		articles.insert({
				category_id:category_id,//获取的是options的value值
				subject:subject,
				cover:cover,
				summary:summary,
				content:content,
				times:times,
				count:count
			},(err,result)=>{
				if(err){
					// res.send('添加分类失败');
					//增加提示页面
					res.render('./admins/message.html',{message:'添加文章失败',html:'/admin/article/add',page:'返回添加文章'});
				}else{
					res.render('./admins/message.html',{message:'添加文章成功',html:'/admin/article',page:'返回文章列表'});
				}
		});
	});*/

	//带有文件上传的提交数据
	// 实例化一个form对象----同时设置临时目录---手动添加文件夹
	//【window 不允许跨磁盘复制文件，需要更改缓存路径】
	let form = new multiparty.Form({uploadDir:'public/tmp'});
	//此处的 feilds为文件表单提交的数据，files为上传的数据
	form.parse(req,(err,feilds,files)=>{
		// console.info(feilds);
		// console.info(files);
		//文件的转移-------首先手动添加好文件夹【window 不允许跨磁盘复制文件，需要更改缓存路径】
		if(files.cover[0].size!=0){//表示添加了图片
			fs.renameSync(files.cover[0].path,"public/uploads/"+files.cover[0].originalFilename);
		}
		//将表单信息保存
		let article = {
			title:feilds.title[0],//标题
			summary:feilds.summary[0],//摘要
			content:feilds.content[0],//内容
			category_id:feilds.category_id[0],//分类
			submit:feilds.submit[0],//提交类型
			
			times:new Date(),//时间
			count:Math.ceil(Math.random()*100),//随机数--阅读量
			cover:files.cover[0].size?'uploads/'+files.cover[0].originalFilename:''//上传图片的路径,存在图片则上传否则不传
		}
		//console.info(article);
		MongoClient.connect(url,(err,db)=>{
			if (err) throw err;
			let articles = db.collection('articles');//链接 文章 集合
			articles.insert(article,(err,result)=>{
				if(err){
					res.render('./admins/message.html',{message:'添加文章失败',html:'/admin/article/add',page:'返回添加文章'});
				}else{
					res.render('./admins/message.html',{message:'添加文章成功',html:'/admin/article',page:'返回文章列表'});
				}
			});
		});
	});
});
//显示编辑页面
router.get('/edit',(req,res,next)=>{
	// res.send('编辑文章');
	// res.render('./admins/article_edit');
	let id = req.query.id;
	MongoClient.connect(url,(err,db)=>{//链接数据库
		let articles = db.collection('articles');//找到对应--文章集合 
		articles.find({_id:objectid(id)}).toArray((err,result1)=>{//找到对应的文章
			//console.info(result1);//此处为一个数组
			let cats = db.collection('cats');//找到对应的menu--分类集合
			cats.find().toArray((err,result2)=>{
				//读取编辑模板，传递读取的数据 result1[0]该文章,result2:分类
				//console.info(result2);
				res.render('./admins/article_edit',{article:result1[0],menu:result2});
			});
		});
	});
});
router.post('/edit',(req,res,next)=>{
	// 实例化form 对象 
	let form = new multiparty.Form({uploadDir:'public/tmp'});
	// 处理要提交的数据
	form.parse(req,(err,feilds,files)=>{
		//本来存在图片  feilds.img[0] 存在不为空
		if(files.cover[0].size){//如果上传了图片存在图片

			fs.renameSync(files.cover[0].path,"public/uploads/"+files.cover[0].originalFilename);
		}else{//不存在图片，且上传了
			//文件的转移-------首先手动添加好文件夹【window 不允许跨磁盘复制文件，需要更改缓存路径】
		}
		//console.info(feilds);
		//console.info(files)
		//将表单信息保存
		let article = {
			artiicleid:feilds.article_id[0],
			title:feilds.title?feilds.title[0]:feilds.subject[0],//标题
			summary:feilds.summary[0],//摘要
			content:feilds.content[0],//内容
			category_id:feilds.category_id[0],//分类
			submit:feilds.submit[0],//提交类型
			
			updatatimes:new Date(),//时间
			count:Math.ceil(Math.random()*100),//随机数--阅读量
			cover:files.cover[0].size?'uploads/'+files.cover[0].originalFilename:feilds.img[0]
			//从新上传了图片，更改为上传图片的路径，否则，改为元图片路径
		}
		//console.info(article);
		MongoClient.connect(url,(err,db)=>{
			if (err) throw err;
			let articles = db.collection('articles');//链接 文章 集合
			articles.update(
				{_id:objectid(article.artiicleid)},
				{$set:{
					title:article.title,
					summary:article.summary,
					category_id:article.category_id,
					submit:article.submit,
					newtimes:article.updatatimes,//更新时间
					count:article.count,
					cover:article.cover,
					content:article.content
					}
				},
				(err,result)=>{
				if(err){
					res.render('./admins/message.html',{message:'修改文章失败',html:'/admin/article/add',page:'返回修改文章'});
				}else{
					res.render('./admins/message.html',{message:'修改文章成功',html:'/admin/article',page:'返回文章列表'});
				}
			});
		});
		// res.send('更改文章成功！');
	});

});
//显示删除页面
router.get('/remove',(req,res,next)=>{
	// res.send('删除文章操作页面')
	// res.render('./admins/article_edit');
	let id = req.query.id;
	MongoClient.connect(url,(err,db)=>{
		if ( err ) throw err;
		// 链接库
		let articles = db.collection('articles');
		articles.remove({_id:objectid(id)},(err,result)=>{
			if(err){
				//增加提示页面   // res.send('添加分类失败');
				res.render('./admins/message.html',{message:'删除文章失败',html:'/admin/article',page:'返回添加文章'});
			}else{
				res.render('./admins/message.html',{message:'删除文章成功',html:'/admin/article',page:'返回文章列表'});
			}
		});
	})
});
module.exports = router;
