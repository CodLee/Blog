var express = require('express');
var router = express.Router();

/* GET home page. */
/*  进入  管理员   路由  */
/*  资源路径相对于的是 view 页面  */
router.get('/', function(req, res, next) {
	// 使用html 模板读取
	// 使用html 模板读取
  res.send('/admin/tag---管理员-标签页面');
});
// 添加
router.get('/add',(req,res,next)=>{
	res.send('显示添加标签 的表单页面');
});
// 显示
// 编辑
router.get('/edit',(req,res,next)=>{
	res.send('显示后加标签 编辑的表单页面');
});
// 插入
router.get('/insert',(req,res,next)=>{
	res.send('显示添加标签 完成的操作');
});
// 删除
router.get('/remove',(req,res,next)=>{
	res.send('显示添加标签 的表单页面');
});

module.exports = router;
