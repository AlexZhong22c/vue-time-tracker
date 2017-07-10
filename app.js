// 顺序：
// 1/拿到模块
//    中间件模块
//    数据库模块
// 2/app.use
// 3/常量字符串的定义
// 4/连接数据库
// 5/启动服务器，监听端口
// 备注：访问数据库，原来我们使用MongoClient，现在使用mongoose，可以对比一下
// 原来连接的库为mission，使用的collection为my_mission
// 现在连接的库为mission，使用的collection为plans
var express = require('express')
var app = express()

// bodyParser中间件用来解析http请求体：
var bodyParser = require('body-parser')
// morgan日志模块，HTTP请求记录：
var morgan = require('morgan')

// 相当于拿到mongodb产生_id的模块??
// var ObjectID = require('mongodb').ObjectID
// var MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose')

app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(express.static('dist'))

// var _db
var mongoUrl = 'mongodb://localhost:27017/mission'
var port = process.env.PORT || 8888

// http://blog.csdn.net/fd214333890/article/details/53486862
mongoose.Promise = global.Promise
mongoose.connect(mongoUrl)

app.listen(port)
console.log('server starts on port' + port)
// 功能等价于：
// MongoClient.connect(mongoUrl, function (err, db) {
//   if (err) {
//     console.error(err);
//     return
//   }
//   console.log('connected to mongo')
//   _db = db
//   app.listen(8888, function () {
//     console.log('server is running...')
//   });
// });
// ---------------------------------------
var Plan = require('./models/plan.js') // 载入mongoose编译后的模型Plan
// https://cnodejs.org/topic/4f71363f8a04d82a3d1e4aea

// 处理跨域请求
app.all("*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With")
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})
// 因为原来我们使用MongoClient，现在使用mongoose，需要对下面的函数一一进行重写：
// 注释掉原来的我们可以做个对比：

// 原来的创建计划：
/*
app.post('/create', function(req, res, next) {
    //接收前端发送的字段
  var mission = req.body;
  //选择一个表my_mission 此时没有没关系，也会自动创建
  var collection = _db.collection('my_mission')
    //如果我们需要的字段不存在，返回前端信息
  if(!mission.comment || !mission.totalTime || !mission.date) {
    res.send({errcode:-1, errmsg:"params missed"})
    return;
  }
    //如果存在就插入数据库，返回OK
  collection.insert({comment: mission.comment, totalTime: mission.totalTime,date:mission.date}, function (err, ret) {
    if(err) {
      console.error(err);
      res.status(500).end();
    } else {
      res.send({errcode:0,errmsg:"ok"});
    }
  });
});
*/
// 重写创建计划：
app.post('/create', function (req, res, next) {
    //接收前端发送过来的字段
  var plan = req.body
  var _plan = null

  if(!plan.comment || !plan.totalTime || !plan.date) {
    res.send({errcode:-1, errmsg:"params missed"})
    return;
  }
  _plan = new Plan ({
    comment: plan.comment,
    totalTime: plan.totalTime,
    date: plan.date
  })
  // 调用私有方法save，把这一条数据传入到数据库里面去
  _plan.save(function (err, plan) {
    if (err) {
      // 关于res.status和res.send和res.json，我的理解还停留在浅层，代码等待改进
      console.error(err)
      res.status(500).end()
    } else {
      // 触发客户端的then()
      res.send({errcode: 0, errmsg: "ok"})
    }
  })
})

/*
//原来的获取总时长
app.get('/time', function(req, res, next) {
    //获取数据表
  var collection = _db.collection('my_mission');
  var time = 0;
  //查询出所有计划
  collection.find({}).toArray(function (err, ret) {
    if(err) {
      console.error(err);
      return;
    }
    //所有计划累加时长
    ret.forEach(function (item, index) {
      time += +item.totalTime;
    });
    //返回时长
    res.json({errcode:0,errmsg:"ok",time:time});
  });
});
*/
// 重写获取总时长:
app.get('/time', function (req, res, next) {
  var time = 0
  // 用aggregate实现与原来同样的功能。_id: null的意思是$group不分组:
  // http://www.runoob.com/mongodb/mongodb-aggregate.html
  // https://docs.mongodb.com/manual/reference/operator/aggregation/sum/
  // https://segmentfault.com/q/1010000003871997
  Plan.aggregate([{$group: {_id: null, totalTime: { $sum: "$totalTime" }}}], function (err, docs){
    if(err) {
      console.error(err);
      return;
    }
    res.json({errcode:0,errmsg:"ok", time:docs[0].totalTime})
  })
})

/*
//原来的获取列表
app.get('/time-entries', function(req, res, next) {
  var collection = _db.collection('my_mission');
  collection.find({}).toArray(function (err, ret) {
    if(err) {
      console.error(err);
      return;
    }
    res.json(ret);
  });
});
*/
// 重写获取列表：
app.get('/time-entries', function (req, res, next) {
  Plan.fetch(function (err, plans) {
      if (err) {
        console.log(err)
      }
      res.json(plans)
  })
})

/*
// 原来的删除计划
app.delete('/delete/:id', function (req, res, next) {
  var _id = req.params.id;
  var collection = _db.collection('my_mission');
  console.log(_id)
  //使用mongodb的唯一ObjectId字段查找出对应id删除记录
  collection.remove({_id: new ObjectID(_id)} ,function (err, result) {
    if(err) {
      console.error(err);
      res.status(500).end();
    } else {
      res.send({errcode:0,errmsg:"ok"});
    }
  });
});
*/
// 重写删除计划：
app.delete('/delete/:id', function (req, res, next) {
  var _id = req.params.id
  Plan.remove({ _id: _id }, function (err) {
    if (err) {
      console.error(err)
      res.status(500).end()
    } else {
      // 触发客户端的then()
      res.send({errcode:0 , errmsg:"ok"})
    }
  })
})
