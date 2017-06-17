var express = require('express');
var router = express.Router();
var mysql  = require('mysql');  //调用MySQL模块
//创建一个connection
var connection = mysql.createConnection({    

    // host     : '127.0.0.1',       //主机
    host     : 'localhost',       //主机
    user     : 'root',            //MySQL认证用户名
    password:'910425li',
    port:   '3306',
    database: 'test'

});
var ajax ={
	num:20,
	length:10,
	page:1,
	pages:10,
	title:123
}
//创建一个connection
connection.connect(function(err){
	/*链接创建一次就可以了*/
    if(err){console.log('[query] - :'+err);return;}
    // console.log('[connection connect]  succeed!');

}); 
/* GET users listing. */
router.get('/', function(req, res, next) {
  	// res.send('respond with a resource');

	//执行SQL语句
	connection.query('SELECT * from zr_Staff', function(err, result11, fields) {
		    //console.log('The solution is: ', result11,fields); //result为表，fileds信息
		if (err) {console.log('[query] - :'+err);return;}
	    connection.query('SELECT * from zr_Staff', function(err, result2, fields) {
		    if (err) {console.log('[query] - :'+err);return;}
		    
		    connection.query('SELECT * from zr_Staff order by count desc', function(err, result3, fields) {
			    if (err) {console.log('[query] - :'+err);return;}
				    res.render('./home/index.html',{data1:result11,data2:result2,hot:result3,ajax:ajax});
			}); 
		}); 
	    // res.render('./home/index',{data1:result11,data2:result2,hot:result3,ajax:ajax});

	}); 

	//关闭connection  关闭连接后无法进行操作
	// connection.end(function(err){
	//     if(err){       
	//         return;
	//     }
	//     console.log('[connection end] succeed!');
	// });
});
/*ajax echarts 的请求*/
router.get('/echart',(req,res,next)=>{
	console.info('页面加载后初始化请求');
	/*connection.query('SELECT * from a_one',function(err,result,fields){*/
	connection.query('SELECT * from zr_Staff  order by count desc',function(err,result,fields){
		if(err) throw err;
		res.json(result);
	})

});
router.get('/search',(req,res,next)=>{
  let keyword = req.query.keyword1;
    //此处，需要使用new的方式来创建正则表达式
  // let reg = new RegExp('^'+keyword,'i');
  connection.query('SELECT * from zr_Staff where title like "%'+keyword+'%"' ,(err,db,fields)=>{
    if (err) throw err;
      if(db.length){//如果找到数据
        console.info(db);
        res.json(db);
      }
  });
});

module.exports = router;
