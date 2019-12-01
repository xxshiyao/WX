const WXAPI = require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoCategories: undefined, // 推荐的文章
    searchKeyword: '' // 搜索词
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    // 读取后台系统设置，保存在小程序的 Storage 里
    const sysConfigSettings = await WXAPI.queryConfigBatch('mallName,mylogo,myname,tel');
    if (sysConfigSettings.code == 0) {
      sysConfigSettings.data.forEach(config => {
        wx.setStorageSync(config.key, config.value);
      })
    }
    // 设置小程序名称
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
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
    // 加载所有的分类数据
    const cmsCategories = await WXAPI.cmsCategories();
    if (cmsCategories.code == 0) {
      const _cmsCategories = cmsCategories.data; // 所有分类数据
      // 筛选推荐的分类
      const l1Categories = _cmsCategories.filter(entity => {
        return entity.name == '摄影摄像';
      });
      const l2Categories = _cmsCategories.filter(entity => {
        return entity.pid == l1Categories[0].id;
      });
      this.setData({
        photoCategories: l2Categories
      });
      console.log(l2Categories)
    }
  },
  onChange(e) {
    this.setData({
      searchKeyword: e.detail
    });
  },
  onSearch(event) {
    console.log(this.data.searchKeyword);
    if (typeof this.data.searchKeyword == "undefined"
      || this.data.searchKeyword == null
      || this.data.searchKeyword == ""
      || this.data.searchKeyword.match(/^[ ]*$/)) {
      wx.showModal({
        title: '提示',
        content: '输入的关键词为空！',
        showCancel: false,
        confirmText: '返回',
        success(res) {}
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/classify/classify?keyword=' + this.data.searchKeyword
    })
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