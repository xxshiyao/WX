const WXAPI = require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid: 6979, // 默认分类
    l2Categories: undefined, //二级分类详情列表
    zy_en: "Brilliant Shadow Culture (Beijing) Co., Ltd.",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    // 获取二级分类列表
    const cmsCategories = wx.getStorageSync("cmsCategories");
    const l2Categories = cmsCategories.filter(entity => {
      return entity.pid == options.pid;
    });

    // 合并扩展字段
    var i, len;
    for (i = 0, len = l2Categories.length; i < len; i++) {
      if (l2Categories[i].remark) {
        var remark = l2Categories[i].remark.split("|");
        if (remark.length >=2) {
          l2Categories[i]["en"] = remark[0];
          l2Categories[i]["text"] = remark[1];
        }
      }
    }
    this.setData({
      l2Categories: l2Categories,
      pid: options.pid
    });
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