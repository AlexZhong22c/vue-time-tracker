var mongoose = require('mongoose')
var planSchema = require('../schemas/plan.js')

// 编译生成plan模型
var Plan = mongoose.model('Plan', planSchema)

// 将plan模型[构造函数]导出
module.exports = Plan
