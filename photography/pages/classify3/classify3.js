const WXAPI = require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1, // 读取第几页数据，便于实现下滑分页
    articleList: [], // 文章列表
    pid: 6983 //默认分类
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    // 搜索文章
    if (!(typeof options.keyword == "undefined"
      || options.keyword == null
      || options.keyword == ""
      || options.keyword.match(/^[ ]*$/))) {
      console.log("search keyword: " + options.keyword);
      this.fetchArticlesByKeyword(options.keyword);
      // 设置标题
      wx.setNavigationBarTitle({
        title: options.keyword
      })
      return;
    }
    // 读取分类详情并设置标题
    const cmsCategories = wx.getStorageSync("cmsCategories");
    const categoryInfoL2 = cmsCategories.filter(entity => {
      return entity.id == options.pid;
    });
    const categoryInfoL1 = cmsCategories.filter(entity => {
      return entity.id == categoryInfoL2[0].pid;
    });
    wx.setNavigationBarTitle({
      title: categoryInfoL1[0].name + " · " + categoryInfoL2[0].name
    })

    // 读取分类下的文章
    this.fetchArticles(options.pid);

  },

  shapeList(oldList) {
    let newList = [];
    for (let i = 0; i < oldList.length/2; i++) {
      let tmpList = [];
      tmpList[0] = oldList[i*2];
      if (i*2+1 < oldList.length) {
        tmpList[1] = oldList[i*2+1];
      }
      newList.push(tmpList);
    }
    return newList;
  },

  async fetchArticles (pid) {
    this.setData({
      pid: pid
    });
    const response = await WXAPI.cmsArticles({
      page: this.data.page,
      categoryId: pid
    });
    if (response.code == 0) {
      this.setData({
        articleList: this.shapeList(this.data.articleList.concat(response.data))
      });
    }
  },
  async fetchArticlesByKeyword(keyword) {
    // search title
    let response = await WXAPI.cmsArticles({
      titleLike: keyword
    });
    if (response.code == 0) {
      this.setData({
        articleList: this.data.articleList.concat(response.data)
      });
    } 
    // search keyword
    response = await WXAPI.cmsArticles({
      keywordsLike: keyword
    });
    if (response.code == 0) {
      this.setData({
        articleList: this.data.articleList.concat(response.data)
      });
    } 
    // search tag
    response = await WXAPI.cmsArticles({
      tagsLike: keyword
    });
    if (response.code == 0) {
      this.setData({
        articleList: this.data.articleList.concat(response.data)
      });
    }
    if (this.data.articleList.length == 0) {
      wx.showModal({
          title: '提示',
          content: '未找到相关作品，再换个关键词试试吧 ^_^',
          showCancel: false,
          confirmText: '返回',
          success(res) {
            wx.navigateBack()
          }
      })
    } else {
      // unique article
      let obj = {}
      let newArr = []
      for (let i = 0; i < this.data.articleList.length; i++) {
        let id = this.data.articleList[i].id
        if (!obj[id]) {
          obj[id] = 1
           newArr.push(this.data.articleList[i])
        }
      }
      this.setData({
        articleList: this.shapeList(newArr)
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