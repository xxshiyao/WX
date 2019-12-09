// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//引入发送邮件的类库
var nodemailer = require('nodemailer')
// 创建一个SMTP客户端配置
var config = {
  host: 'smtp.163.com', //网易163邮箱 smtp.163.com
  port: 25, //网易邮箱端口 25
  auth: {
    user: 'zy_culture_robot@163.com', //邮箱账号
    pass: '5754064ccc2c' //邮箱的授权码
  }
};
// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config);
// 云函数入口函数
exports.main = async (event, context) => {
  let title = '【小程序机器人-专属定制】【' + event.type + '】 ' + event.name + ' ' + event.phone
  let content = '姓名：' + event.name + '\n' 
                + '电话：' + event.phone + '\n'
                + '拍摄类型：' + event.type + '\n'
                + '拍摄地点：' + event.address + '\n'
                + '拍摄描述：' + event.describ + '\n'
  // 创建一个邮件对象
  var mail = {
    // 发件人
    from: '灼影Culture机器人',
    // 主题
    subject: title,
    // 收件人
    to: event.receiver,
    // 邮件内容，text或者html格式
    text: content //可以是链接，也可以是验证码
  };

  let res = await transporter.sendMail(mail);
  return res;
}