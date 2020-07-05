// pages/centerSubmit/centerSubmit.js
const WXAPI = require('apifm-wxapi')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectType: '',
    inputName: '',
    inputPhone: '',
    inputAddress: '',
    inputDescrib: '',
    hidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectType: options.type
    });
  },
  calling(){
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync('tel')
    })
  },
  onChange(event) {
    if (event.currentTarget.id == 'inputName') {
      this.data.inputName = event.detail     
    } else if (event.currentTarget.id == 'inputAddress') {
      this.data.inputAddress = event.detail 
    } else if (event.currentTarget.id == 'inputPhone') {
      this.data.inputPhone = event.detail
    } else if (event.currentTarget.id == 'inputDescrib') {
      this.data.inputDescrib = event.detail
    }
  },
  async onSubmit(e) {
    console.log(e.detail.userInfo);
    let values = [
      { 'field': this.data.inputName, 'name': '姓名' },
      { 'field': this.data.inputAddress, 'name': '地址' },
      { 'field': this.data.inputPhone, 'name': '电话' }
    ]
    for (let v of values) {
      if (typeof v.field == "undefined"
        || v.field == null
        || v.field == ""
        || v.field.match(/^[ ]*$/)) {
        wx.showModal({
          title: '提示',
          content: '输入的' + v.name + '为空！',
          showCancel: false,
          confirmText: '返回',
          success(res) { }
        })
        return;
      }
    }
    this.setData({
      hidden: false
    })
    const receiver = await WXAPI.queryConfigValue('receiver')
    console.log(receiver.data)
    wx.cloud.callFunction({
      name: 'sendMail',
      data: {
        'receiver': receiver.data,
        'type': this.data.selectType,
        'name': this.data.inputName,
        'address': this.data.inputAddress,
        'phone': this.data.inputPhone,
        'describ': this.data.inputDescrib,
        'wx_name': e.detail.userInfo ? e.detail.userInfo.nickName : '',
        'wx_icon': e.detail.userInfo ? e.detail.userInfo.avatarUrl : ''
      },
    })
      .then(res => {
        this.setData({
          hidden: true
        })
        if (res.result && res.result.response.match('250 Mail OK.*')) {
          wx.showModal({
            title: '提示',
            content: '信息已提交，我们会尽快与您联系！',
            showCancel: false,
            confirmText: '确定',
            success(res) { }
          })
        } else {
          console.log(res.result)
        }

      })
      .catch(console.error)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})