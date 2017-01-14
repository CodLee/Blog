var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*   引入模块--路由模块(可省略后缀)   ----引入之后必须使用*/
var index = require('./routes/home/index.js');
var users = require('./routes/users');
var admin = require('./routes/admin/admin.js')
// 引入用户 登录模块
const user = require('./routes/user.js');

// 载入session中间件
const session = require('express-session');

/*引入二级路由*/
// var  posts = require('./routes/home/posts.js'); // 客户路由

var  adminArticle = require('./routes/admin/adminArticle.js'); // 管理员文章路由
var  adminMenu = require('./routes/admin/adminMenu.js'); // 管理员目录路由
var  adminTag = require('./routes/admin/adminTag.js'); // 管理员标签路由

var app = express();
app.use(session({
	secret:'Lee',
	resave:false,
	saveUninitialized:true,
	cookie:{maxAge:1000*1800}//session基于cookie,此处设置有效期 1800秒
}));

/*  view engine setup  设置模板资源，相对路径为  当前路径加上  views..*/
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
/*---设置使用html模板引擎，*/
app.engine('html',require('ejs').__express);
app.set('view engine','html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//
//

/*----使用模块-------*/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// 加载静态资源
app.use(express.static(path.join(__dirname, 'public')));
// 分离后台页面的静态资源加载
app.use(express.static(path.join(__dirname, 'views/admins')));

/*进入 localhost:3000 时使用index*/
app.use('/', index);
app.use('/users', users);
app.use('/user', user);

//这里都是针对【后台】的 请求
app.use('/admin',isLogin);//首先判断是否登录
app.use('/admin',admin);
/*创建二级路由，admin下面的路由均由二级目录处理*/
app.use('/admin/menu',adminMenu);
app.use('/admin/article',adminArticle);
app.use('/admin/tag',adminTag);

//  后台登录控制,自定义中间件，判断是否登录
function isLogin(req,res,next){
	// 判断session是否存在即可
	if(! req.session.isLogin){
		//没有登录，跳转登录页面
		res.redirect('/user/login');
		return;
	}//否则就是登录了，继续执行后续代码
	next();
}
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
