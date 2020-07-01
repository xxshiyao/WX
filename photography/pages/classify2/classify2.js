const WXAPI = require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid: 6983,
    selectId: '',
    show: {
      basic: false,
      top: false,
      bottom: false,
      left: false,
      right: false,
      round: false,
      closeIcon: false,
      summitIcon: false,
      summitIconBackground: false
    },
    l2Categories: undefined, //二级分类详情列表
    zy_en: "Brilliant Shadow Culture (Beijing) Co., Ltd.",
    default_unselect_text_color: "#636363",
    default_select_text_color: "#fcb01e",
    select_text_all_color: "#636363",
    select_text_list_color: "#636363",
    //[{ id: 1, name: '电影海报' }, { id: 2, name: '平面广告' }],
    parameters: {},
    parameter1: [],
    parameter2: [],
    parameter3: [],
    parameter4: [],
    parameter5: [],
    pids: [
      6979, //产品拍摄
      6980, //人像拍摄
      6981, //活动视频
      6982, //商业视频
      11596, //其他服务
      ]
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
    console.log(cmsCategories);
    var i;
    var parameters = this.data.parameters;
    for (i = 0; i < cmsCategories.length; i++) {
      if ( cmsCategories[i].level == 2) {
        var item = {
          'id': cmsCategories[i].id,
          'name': cmsCategories[i].name
          };
        if (!parameters[cmsCategories[i].pid]) {
          parameters[cmsCategories[i].pid] = [[]];
          parameters[cmsCategories[i].pid][0][0] = item;
        } else {
          var index = parameters[cmsCategories[i].pid].length - 1;
          if (parameters[cmsCategories[i].pid][index].length > 1) {
            parameters[cmsCategories[i].pid][index+1] = [item];
          } else {
            parameters[cmsCategories[i].pid][index][1] = item;
          }
        }
      }
    }

    // 合并扩展字段
    var len;
    for (i = 0, len = l2Categories.length; i < len; i++) {
      if (l2Categories[i].remark) {
        var remark = l2Categories[i].remark.split("|");
        if (remark.length >=2) {
          l2Categories[i]["en"] = remark[0];
          l2Categories[i]["text"] = remark[1];
        }
      }
    }
    console.log(parameters)
    this.setData({
      l2Categories: l2Categories,
      pid: options.pid,
      select_text_all_color: this.data.default_select_text_color,
      select_text_list_color: this.data.default_unselect_text_color,
      parameters: parameters,
      parameter1: parameters[6979], //产品拍摄
      parameter2: parameters[6980], //人像拍摄
      parameter3: parameters[6981], //活动视频
      parameter4: parameters[6982], //商业视频
      parameter5: parameters[11596], //其他服务
    });
    this.data.parameters[options.pid][0][0].checked = true;
  },

  click_all: function (e) {
    wx.redirectTo({
      url: '/pages/classify2/classify2?pid=' + this.data.pid
    })
  },

  click_list: function (e) {
    console.log('click list');
    this.setData({
      select_text_all_color: this.data.default_unselect_text_color,
      select_text_list_color: this.data.default_select_text_color,
      [`show.right`]: true,
      [`show.summitIcon`]: true,
      [`show.summitIconBackground`]: true
    });
  },
  click_ok: function (e) {
    this.hideRight();
    if (this.data.selectId) {
      wx.navigateTo({
        url: '/pages/classify3/classify3?pid=' + this.data.selectId
      })
    }
  },
  toggle(type, show) {
    this.setData({
      [`show.${type}`]: show
    });
  },
  hideRight() {
    this.toggle('right', false);
    this.toggle('summitIcon', false);
    this.toggle('summitIconBackground', false);
    this.setData({
      select_text_all_color: this.data.default_select_text_color,
      select_text_list_color: this.data.default_unselect_text_color,
    });
    console.log('close right');
  },
  parameterTap: function (e) {
    // pids: [
    //   6979, //产品拍摄 parameter1
    //   6980, //人像拍摄 parameter2
    //   6981, //活动视频 parameter3
    //   6982, //商业视频 parameter4
    //   11596, //其他服务 parameter5
    // ]
    var that = this
    var this_checked = e.currentTarget.dataset.id
    var parameterList1 = this.data.parameter1
    var parameterList2 = this.data.parameter2
    var parameterList3 = this.data.parameter3
    var parameterList4 = this.data.parameter4
    var parameterList5 = this.data.parameter5
    var parameId = ''
    for (var i = 0; i < parameterList1.length; i++) {
      for (var j = 0; j < parameterList1[i].length; j++) {
        if (parameterList1[i][j] && parameterList1[i][j].id == this_checked) {
          parameterList1[i][j].checked = true;//当前点击的位置为true即选中
          parameId = parameterList1[i][j].id
        }
        else {
          if (parameterList1[i][j]) {
            parameterList1[i][j].checked = false;//其他的位置为false
          }
        }
      }
    }
    for (var i = 0; i < parameterList2.length; i++) {
      for (var j = 0; j < parameterList2[i].length; j++) {
        if (parameterList2[i][j] && parameterList2[i][j].id == this_checked) {
          parameterList2[i][j].checked = true;//当前点击的位置为true即选中
          parameId = parameterList2[i][j].id
        }
        else {
          if (parameterList2[i][j]) {
            parameterList2[i][j].checked = false;//其他的位置为false
          }
        }
      }
    }
    for (var i = 0; i < parameterList3.length; i++) {
      for (var j = 0; j < parameterList3[i].length; j++) {
        if (parameterList3[i][j] && parameterList3[i][j].id == this_checked) {
          parameterList3[i][j].checked = true;//当前点击的位置为true即选中
          parameId = parameterList3[i][j].id
        }
        else {
          if (parameterList3[i][j]) {
            parameterList3[i][j].checked = false;//其他的位置为false
          }
        }
      }
    }
    for (var i = 0; i < parameterList4.length; i++) {
      for (var j = 0; j < parameterList4[i].length; j++) {
        if (parameterList4[i][j] && parameterList4[i][j].id == this_checked) {
          parameterList4[i][j].checked = true;//当前点击的位置为true即选中
          parameId = parameterList4[i][j].id
        }
        else {
          if (parameterList4[i][j]) {
            parameterList4[i][j].checked = false;//其他的位置为false
          }
        }
      }
    }
    // for (var i = 0; i < parameterList5.length; i++) {
    //   for (var j = 0; j < parameterList5[i].length; j++) {
    //     if (parameterList5[i][j] && parameterList5[i][j].id == this_checked) {
    //       parameterList5[i][j].checked = true;//当前点击的位置为true即选中
    //       parameId = parameterList5[i][j].id
    //     }
    //     else {
    //       if (parameterList5[i][j]) {
    //         parameterList5[i][j].checked = false;//其他的位置为false
    //       }
    //     }
    //   }
    // }
    that.setData({
      parameter1: parameterList1,
      parameter2: parameterList2,
      parameter3: parameterList3,
      parameter4: parameterList4,
      parameter5: parameterList5,
      selectId: parameId
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