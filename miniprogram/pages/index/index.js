wx.cloud.init()
const db = wx.cloud.database()
const userjhl = db.collection('userjhl')
let currentPage = 0 // 当前第几页,0代表第一页 
let pageSize = 20 //每页显示多少数据 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: "",
    name: "",  // 姓名
    phone: "", // 手机号
    address: "", // 地址
    number: "",  // 数量
    values: [],  // 数据库当中的内容 
    loadMore: false, //"上拉加载"的变量，默认false，隐藏  
    loadAll: false, //“没有数据”的变量，默认false，隐藏  
    active: 'home'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.values = [];
    currentPage = 0; // 当前第几页,0代表第一页 
    pageSize = 20;   //每页显示多少数据 
    this.getData();
    // let _this = this;
    // // 开始查询数据了  news对应的是集合的名称   
    // userjhl.orderBy('createTime', 'desc').get({
    //   //如果查询成功的话    
    //   success: res => {
    //     console.log(res.data)
    //     //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值      
    //     _this.setData({
    //       values: res.data
    //     })
    //   }
    // })
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
    console.log("上拉触底事件")
    let that = this
    if (!that.data.loadMore) {
      that.setData({
        loadMore: true, //加载中  
        loadAll: false //是否加载完所有数据
      });

      //加载更多，这里做下延时加载
      setTimeout(function() {
        that.getData()
      }, 2000)
    }
  },

  //访问网络,请求数据  
  getData() {
    console.log("getData");
    let that = this;
    //第一次加载数据
    if (currentPage == 1) {
      this.setData({
        loadMore: true, //把"上拉加载"的变量设为true，显示  
        loadAll: false //把“没有数据”设为false，隐藏  
      })
    }
    //云数据的请求
    userjhl.orderBy('createTime', 'desc')
      .skip(currentPage * pageSize) //从第几个数据开始
      .limit(pageSize)
      .get({
        success(res) {
          if (res.data && res.data.length > 0) {
            console.log("请求成功", res.data)
            currentPage++
            //把新请求到的数据添加到dataList里  
            let list = that.data.values.concat(res.data)
            that.setData({
              values: list, //获取数据数组    
              loadMore: false //把"上拉加载"的变量设为false，显示  
            });
            if (res.data.length < pageSize) {
              that.setData({
                loadMore: false, //隐藏加载中。。
                loadAll: true //所有数据都加载完了
              });
            }
          } else {
            that.setData({
              loadAll: true, //把“没有数据”设为true，显示  
              loadMore: false //把"上拉加载"的变量设为false，隐藏  
            });
          }
        },
        fail(res) {
          console.log("请求失败", res)
          that.setData({
            loadAll: false,
            loadMore: false
          });
        }
      })
    },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  /**
   * 添加按钮跳转
   */
  add: function (event) {
    console.log("add")
    console.log(this.data.value) // 获取当前数据
    var values = this.data.value.split('+');
    if (!this.validation(values)) {
      return false;
    }
    this.setData({
      name: values[0],
      phone: values[1],
      address: values[2],
      number: values[3]
    });
    let date = new Date();
    var time = Math.round(date / 1000)
    userjhl.add({
      data:{
        name: this.data.name,
        phone: this.data.phone,
        address: this.data.address,
        number: this.data.number,
        createTime: date.toLocaleString(),
        date: time
      },
      success(res) {
        console.log("添加成功", res)
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        })
      },
      fail(res) {
        console.log("添加失败", res)
        wx.showToast({
          title: '添加失败',
          icon: 'none'
        })
      }
    })
    wx.reLaunch({
      url: '../index/index'//实际路径要写全
    })
    console.log("return")
  },

   /**
   * 验证
   */
  validation: function (values) {

    if (values.length != 4) { 
      wx.showToast({
        title: '请按照 姓名+手机号+地址+箱数 的格式输入,缺少某项内容',
        icon: 'none'
      })
      return false;
    }
    if(values[0].length < 1 || values[1].length < 1 || values[2].length < 1 || values[3].length < 1) {
      wx.showToast({
        title: '某一项内容为空',
        icon: 'none'
      })
      return false;
    }
    return true;
  },

  /**
   * 事件处理函数，当输入改变时调用
   */
  onValueChange: function (event){
    console.log("onValueChange"),
    this.setData({
      value: event.detail
    });
    console.log(this.data.value);
  },

  onTabbarChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ active: event.detail });
    console.log(this.data.active);
    if (this.data.active == 'download') {
      wx.reLaunch({
        url: '../mydownload/mydownload'//实际路径要写全
      })
    }
  },
})