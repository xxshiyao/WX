const WXAPI = require('apifm-wxapi')
WXAPI.init('zyculture')

App({
  onLaunch() {
    // 启动小程序
    wx.cloud.init({
      env: "prod-joudu"
    })
  },
  globalData: {

  }
})