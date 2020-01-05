const WXAPI = require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: undefined, //要展示的分类id
    articleList: [] //文章列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    // 获取分类信息并设置标题
    const cmsCategories = wx.getStorageSync("cmsCategories");
    const categoryInfo = cmsCategories.filter(entity => {
      return entity.id == options.id;
    });
    if (categoryInfo.length == 0) {
      console.log("not find category: " + options.id);
      return;
    }
    wx.setNavigationBarTitle({
      title: categoryInfo[0].name
    })

    // 读取分类下的文章
    this.fetchArticles(options.id);
  },
  async fetchArticles(id) {
    const response = await WXAPI.cmsArticles({
      categoryId: id
    });
    if (response.code == 0) {
      this.setData({
        articleList: this.data.articleList.concat(response.data),
        id: id
      });
    }
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