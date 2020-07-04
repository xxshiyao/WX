// pages/component/top-select/top-select.js
const WXAPI = require('apifm-wxapi')
Component({
  properties: {
    level: Number,
    pid: String
    /*
    myProperty: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal){} // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    }
    */
  },

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
      ],
    default_unselect_text_color: "#636363",
    default_select_text_color: "#fcb01e",
    select_text_all_color: "#636363",
    select_text_list_color: "#636363"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  attached:function() {
    console.log("load top-select " + this.properties.level + " " + this.properties.pid)
    // 获取二级分类列表
    const cmsCategories = wx.getStorageSync("cmsCategories");
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

    this.setData({
      pid: this.properties.pid,
      select_text_all_color: this.data.default_select_text_color,
      select_text_list_color: this.data.default_unselect_text_color,
      parameters: parameters,
      parameter1: parameters[6979], //产品拍摄
      parameter2: parameters[6980], //人像拍摄
      parameter3: parameters[6981], //活动视频
      parameter4: parameters[6982], //商业视频
      parameter5: parameters[11596], //其他服务
    });
    //this.data.parameters[this.data.pid][0][0].checked = true;
  },

  methods: {
  click_all: function (e) {
    console.info(this.data.pid)
    if (this.properties.level == 2) {
      wx.redirectTo({
        url: '/pages/classify2/classify2?pid=' + this.data.pid
      });
    } else if (this.properties.level == 3) {
      wx.redirectTo({
        url: '/pages/classify3/classify3?pid=' + this.data.pid
      });
    } else {
      this.hideRight();
    }
  },

  click_list: function (e) {
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
      this.setData({
        pid: this.data.selectId
      });
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
    var parameterList1 = this.data.parameter1 ? this.data.parameter1 : []
    var parameterList2 = this.data.parameter2 ? this.data.parameter2 : []
    var parameterList3 = this.data.parameter3 ? this.data.parameter3 : []
    var parameterList4 = this.data.parameter4 ? this.data.parameter4 : []
    var parameterList5 = this.data.parameter5 ? this.data.parameter5 : []
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
    for (var i = 0; i < parameterList5.length; i++) {
      for (var j = 0; j < parameterList5[i].length; j++) {
        if (parameterList5[i][j] && parameterList5[i][j].id == this_checked) {
          parameterList5[i][j].checked = true;//当前点击的位置为true即选中
          parameId = parameterList5[i][j].id
        }
        else {
          if (parameterList5[i][j]) {
            parameterList5[i][j].checked = false;//其他的位置为false
          }
        }
      }
    }
    that.setData({
      parameter1: parameterList1,
      parameter2: parameterList2,
      parameter3: parameterList3,
      parameter4: parameterList4,
      parameter5: parameterList5,
      selectId: parameId
    })
  }
}
})