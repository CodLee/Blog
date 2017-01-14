var express = require('express');
var router = express.Router();

const objectid = require('objectid');
// 载入mongo模块
const MongoClient = require('mongodb').MongoClient;//载入mongo，创建mongoclient
const url = 'mongodb://127.0.0.1:27017/blog';//设置路径
// const url = 'mongodb://localhost:27017/blog';//设置路径
/* GET home page. */
/*  进入   用户页   路由  */
router.get('/', function(req, res, next) {
  //以views 作为文件根目录在读取文件
  // res.render('./home/index', { title: 'Express' });
  let title = req.query.title;
  if(title){//按条件查询
    MongoClient.connect(url,(err,db)=>{
      if(err) throw err;
      let articles = db.collection('articles');// 文章 集合
      articles.find({category_id:title}).sort({times:-1}).toArray((err,result1)=>{//找到文章返回---按时间逆序排列
        if(err) throw err;
          // 此处使用ajax请求，result1是一个什么数据 数组 slice(0,1) 包含0 不包含1
          //console.info(result1);
          //console.info('123');
          let page = req.query.page||1;//当前页
          let length = 5;//每页现实的文章数
          let start =(page-1)*length; 
          let end = start+5;
          let num =result1.length;//文章总数
          let pages=Math.ceil(num/length);//页数
          let result11 = result1.slice(start,end);//截取前5条数据

          //console.info(result11);
          //生成ajax对象，传递下标
          let ajax={
            title:title,
            pages:pages,//总页数
            num:num,//总文章数
            length:length,//每页文章数
            page:page//当前页
          }

        let menus =db.collection('cats');// 分类  集合
        menus.find().toArray((err,result2)=>{
          if(err) throw err;
          //找到文章返回---按阅读量截取8个逆序排列--从大到小
          articles.find().sort({count:-1}).limit(8).toArray((err,result3)=>{
            if(err) throw err;
            // data1 文章集合，data2 分类集合，data3 热门
            res.render('./home/index',{data1:result11,data2:result2,hot:result3,ajax:ajax});
          });

        });
      });
    });

  }else{//不按条件查询
    MongoClient.connect(url,(err,db)=>{
    	if(err) throw err;
    	let articles = db.collection('articles');// 文章 集合
    	articles.find().sort({times:-1}).toArray((err,result1)=>{//找到文章返回---按时间逆序排列
  	  	if(err) throw err;
          // 此处使用ajax请求，result1是一个什么数据 数组 slice(0,1) 包含0 不包含1
          //console.info(typeof result1);
          //console.info('123');
          let page = req.query.page||1;//当前页
          let length = 5;//每页现实的文章数
          let start =(page-1)*length; 
          let end = start+5;
          let num =result1.length;//文章总数
          let pages=Math.ceil(num/length);//页数
          let result11 = result1.slice(start,end);//截取前5条数据

          //console.info(result11);
          //生成ajax对象，传递下标
          let ajax={
            title:undefined,//全选，没有按照分类--title查找
            pages:pages,//总页数
            num:num,//总文章数
            length:length,//每页文章数
            page:page//当前页
          }

    		let menus =db.collection('cats');// 分类  集合
    		menus.find().toArray((err,result2)=>{
  		  	if(err) throw err;
  		  	//找到文章返回---按阅读量截取8个逆序排列--从大到小
  		  	articles.find().sort({count:-1}).limit(8).toArray((err,result3)=>{
  		  		if(err) throw err;
  			  	// data1 文章集合，data2 分类集合，data3 热门
  			  	res.render('./home/index',{data1:result11,data2:result2,hot:result3,ajax:ajax});
  		  	});

    		});
    	});
    });
  }
});
//ajax请求下一页
router.get('/page',function(req,res,next){
  let title=req.query.title;
  let page=req.query.page;
  //console.info(title,page);
  //console.info('ajax请求');
  if(title){
    MongoClient.connect(url,(err,db)=>{
      if(err) throw err;
      let articles = db.collection('articles');// 文章 集合
          if(err) throw err;
      //查找过程按照类别查找 
      articles.find({category_id:title}).sort({times:-1}).toArray((err,result1)=>{//找到文章返回---按时间逆序排列
          if(err) throw err;
            // 此处使用ajax请求，result1是一个什么数据 数组 slice(0,1) 包含0 不包含1
           // console.info(typeof result1);
            //console.info('123');
            page = page||1;//当前页
            let length = 5;//每页现实的文章数
            let start =(req.query.page-1)*length; 
            let end = start+5;
            let num =result1.length;//文章总数
            let pages=Math.ceil(num/length);//页数
            let result11 = result1.slice(start,end);//截取前5条数据
            res.json(result11);
      });
    });
  }else{
    MongoClient.connect(url,(err,db)=>{
      if(err) throw err;
      let articles = db.collection('articles');// 文章 集合
          if(err) throw err;
      articles.find({}).sort({times:-1}).toArray((err,result1)=>{//找到文章返回---按时间逆序排列
          if(err) throw err;
          //console.info(result1)
          // 此处使用ajax请求，result1是一个什么数据 数组 slice(0,1) 包含0 不包含1
          // console.info(typeof result1);
          //console.info('123');
            page = page||1;//当前页
            let length = 5;//每页现实的文章数
            let start =(req.query.page-1)*length; 
            let end = start+5;
            let num =result1.length;//文章总数
            let pages=Math.ceil(num/length);//页数
            let result11 = result1.slice(start,end);//截取前5条数据
            res.json(result11);
      });
    });
  }
});
// 
router.get('/posts', function(req, res, next) {
  // res.render('./home/posts', { title: 'Express' });
  let id= req.query.id;//当前文章
  let category_id=req.query.category_id;//文章分类
  /*MongoClient.connect(url,(err,db)=>{
  	if(err) throw err;
  	let articles = db.collection('articles');

  	articles.find({_id:objectid(id)}).toArray((err,result)=>{//result为含有一个对象的数组
  		if(err) throw err;
		  	//找到文章返回---按阅读量截取8个逆序排列--从大到小
		  	articles.find().sort({count:-1}).limit(8).toArray((err,result3)=>{
		  		if(err) throw err;
			  	// data1 文章集合，data2 分类集合，data3 热门
			  	res.render('./home/posts',{data:result[0],hot:result3});
		  	});
  	});
  });*/
  MongoClient.connect(url,(err,db)=>{
    if(err) throw err;
    let articles = db.collection('articles');// 文章 集合
    articles.find({_id:objectid(id)}).toArray((err,result1)=>{//找到文章返回---按时间逆序排列
      if(err) throw err;
      let menus =db.collection('cats');// 分类  集合
      menus.find().toArray((err,result2)=>{
        if(err) throw err;
        //找到文章返回---按阅读量截取8个逆序排列--从大到小
        articles.find().sort({count:-1}).limit(8).toArray((err,result3)=>{
          if(err) throw err;
          // data1 文章集合，data2 分类集合，data3 热门
          // 在文章列表中查找和当前文章同类的，除了当前文章的按阅读量排名的前六个
          articles.find({category_id:category_id,_id:{$not:{$in:[objectid(id)]}}}).sort({count:-1}).limit(6).toArray((err,result4)=>{
            //console.info(result4);
            res.render('./home/posts',{data:result1[0],data2:result2,hot:result3,classify:result4});
          });
        });
      });
    });
  });
});
router.get('/search',(req,res,next)=>{
  let keyword = req.query.keyword1;
  MongoClient.connect(url,(err,db)=>{
    if (err) throw err;
    let articles = db.collection('articles');
    //此处，需要使用new的方式来创建正则表达式
    //表示以输入的内容开头来匹配
    let reg = new RegExp('^'+keyword,'i');
    //if(keyword != ''){'有内容输入的时候放到请求段判断'} 
    articles.find({title:reg}).toArray((err,result)=>{
      if (err) throw err;
      if(result.length){//如果找到数据
        console.info(result);
        res.json(result);
      }
      
    });

  });
});

module.exports = router;
