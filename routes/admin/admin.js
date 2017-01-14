var express = require('express');
var router = express.Router();

/* GET home page. */
/*  进入  管理员   路由  */
/*  资源路径相对于的是 view 页面  */
router.get('/', function(req, res, next) {
	// 使用html 模板读取
  res.render('./admins/admin', { title: 'Express' });
});
/*router.get('/admin', function(req, res, next) {
  res.render('./admins/admin', { title: 'Express' });
});*/
module.exports = router;
