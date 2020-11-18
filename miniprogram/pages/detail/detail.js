// pages/detail/detail.js
wx.cloud.init()
const db = wx.cloud.database()
const userjhl = db.collection('userjhl')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",  // 姓名
    phone: "", // 手机号
    address: "", // 地址
    number: "",  // 数量
    id_: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _id = options.id;
    let _this = this;
    console.log(_id)

    userjhl.where({
      _id: _id
    })
    .get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        console.log(res.data[0].name)
        _this.setData({
          name: res.data[0].name,
          address: res.data[0].address,
          phone: res.data[0].phone,
          number: res.data[0].number,
          id_: _id
        });
      }
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

  },

  /**
   * 事件处理函数，当输入改变时调用
   */
  onNameChange: function (event){
    console.log("onNameChange"),
    this.setData({
      name: event.detail,
    });
  },
  onPhoneChange: function (event){
    console.log("onPhoneChange"),
    this.setData({
      phone: event.detail,
    });
  },
  onAddressChange: function (event){
    console.log("onAddressChange"),
    this.setData({
      address: event.detail,
    });
  },
  onNumberChange: function (event){
    console.log("onNumberChange"),
    this.setData({
      number: event.detail,
    });
  },

  /**
   * 更新操作
   */
  update: function (event) {
    console.log("update")
    if (!this.validation()) {
      return false;
    }
    let date = new Date();
    var time = Math.round(date / 1000)
    userjhl.doc(this.data.id_).update({
      // data 传入需要局部更新的数据
      data: {
        name: this.data.name,
        phone: this.data.phone,
        address: this.data.address,
        number: this.data.number,
        createTime: date.toLocaleString(),
        date: time
      },
      success: function(res) {
        console.log("更新成功", res)
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        })
      },
      fail(res) {
        console.log("更新失败", res)
        wx.showToast({
          title: '更新失败',
          icon: 'none'
        })
      }
    });
    console.log("return");
    wx.reLaunch({
      url: '../index/index'//实际路径要写全
    })
  },

  /**
   * 删除操作
   * @param {*} event 
   */
  delete: function (event) {
    console.log("delete")
    userjhl.doc(this.data.id_).remove({
      success(res) {
        console.log("删除成功", res)
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
      },
      fail(res) {
        console.log("删除失败", res)
        wx.showToast({
          title: '删除失败',
          icon: 'success'
        })
      }
    })
    console.log("return");
    wx.reLaunch({
      url: '../index/index'//实际路径要写全
    })
  },

   /**
   * 验证
   */
  validation: function () {
    console.log(this.data.name);
    if(this.data.name.length < 1 || this.data.phone.length < 1 || this.data.address.length < 1 || this.data.number.length < 1) {
      wx.showToast({
        title: '某一项内容为空',
        icon: 'none'
      })
      return false;
    }
    return true;
  },
})