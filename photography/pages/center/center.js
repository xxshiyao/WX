const WXAPI = require('apifm-wxapi')
Page({

  

  /**
   * 页面的初始数据
   */
  data: {
    parameter1: [
      [{ id: 1, name: '电影海报' },
      { id: 2, name: '平面广告' },
      { id: 3, name: '静物拍摄' }],
      [{ id: 4, name: '人像拍摄' },
      { id: 5, name: 'TVC广告' },
      { id: 6, name: '美食拍摄' }],
      [{ id: 7, name: '企业宣传' },
      { id: 8, name: 'VLOG' },
      { id: 9, name: '其它' }]
    ],
    parameter2: [
      [{ id: 10, name: '会议拍摄' },
      { id: 11, name: '体育赛事' },
      { id: 12, name: '商业活动' }],
      [{ id: 13, name: '娱乐活动' },
      { id: 14, name: '专访街拍' },
      { id: 15, name: '旅游团建' }],
      [{ id: 16, name: '亲子活动' },
      { id: 17, name: '婚礼现场' },
      { id: 18, name: '其它' }]
    ],
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
    this.data.parameter1[0][0].checked = true;
    this.setData({
      parameter1: this.data.parameter1,
      parameter2: this.data.parameter2,
      selectType: this.data.parameter1[0][0].name
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow () {
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
  
  },
  calling(){
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync('tel')
    })
  },
  parameterTap: function (e) {
    var that = this
    var this_checked = e.currentTarget.dataset.id
    var parameterList1 = this.data.parameter1//获取Json数组
    var parameterList2 = this.data.parameter2//获取Json数组
    var parameName = ''
    for (var i = 0; i < parameterList1.length; i++) {
      for (var j=0; j < parameterList1[i].length; j++) {
        if (parameterList1[i][j].id == this_checked) {
          parameterList1[i][j].checked = true;//当前点击的位置为true即选中
          parameName = parameterList1[i][j].name
        }
        else {
          parameterList1[i][j].checked = false;//其他的位置为false
        }
      }
    }
    for (var i = 0; i < parameterList2.length; i++) {
      for (var j=0; j < parameterList2[i].length; j++) {
        if (parameterList2[i][j].id == this_checked) {
          parameterList2[i][j].checked = true;//当前点击的位置为true即选中
          parameName = parameterList2[i][j].name
        }
        else {
          parameterList2[i][j].checked = false;//其他的位置为false
        }
      }
    }
    that.setData({
      parameter1: parameterList1,
      parameter2: parameterList2,
      selectType: parameName
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
  }

})