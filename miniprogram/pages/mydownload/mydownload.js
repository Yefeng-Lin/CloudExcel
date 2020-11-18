// pages/mydownload/mydownload.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const db = wx.cloud.database()
const userjhl = db.collection('userjhl')
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 'download',
    currentDate: new Date().getTime(),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    sdate:'',
    edate:'',
    list: [],
    fileUrl: ""
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
    var tm = this.dateFormat(this.data.currentDate);
    //console.log(this.getUnixTime(tm + " 00:00:00"));
    this.setData({
      sdate: this.getUnixTime(tm + " 00:00:00"),
      edate: this.getUnixTime(tm + " 23:59:59")
    });
    // console.log(this.data.currentDate);
    // console.log(this.data.sdate);
    // console.log(this.data.edate);

  },

  //日期转时间戳
  getUnixTime: function (dateStr){
    var newstr = dateStr.replace(/-/g,'/'); 
    var date =  new Date(newstr); 
    var time_str = date.getTime().toString();
    return time_str.substr(0, 10);
  },

   //把时间戳改成字符串
   dateFormat: function (timestamp) {
    var f = new Date(timestamp);
    var year = f.getFullYear();
    var month = (f.getMonth() + 1) > 10 ? (f.getMonth() + 1) : '0' + (f.getMonth() + 1);
    var day = f.getDate() > 10 ? f.getDate() : '0' + f.getDate();
    var hour = f.getHours() > 10 ? f.getHours() : '0' + f.getHours();
    var minute = f.getMinutes() > 10 ? f.getMinutes() : '0' + f.getMinutes();
    var second = f.getSeconds() > 10 ? f.getSeconds() : '0' + f.getSeconds();
    var tm = year + '-' + month + '-' + day;
    return tm
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  onTabbarChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ active: event.detail });
    console.log(this.data.active);
    if (this.data.active == 'home') {
      wx.reLaunch({
        url: '../index/index'//实际路径要写全
      })
    }
  },
  getuserid: function(){
    wx.cloud.callFunction({
      name:"getuserid",
      success(res) {
        console.log("请求成功", res.result.openid)
        return res.result.openid;
      },
      fail(res) {
        console.log("请求失败", res)
        wx.showToast({
          title: '用户id获取失败',
          icon: 'success'
        })
        return '';
      }
    })
  },

  myconfirm: function() {
    let that = this;
    let id = this.getuserid();
    if (id == "") {
      return;
    }
    
    that.data.list = [];
    userjhl.where({
      _openid: id  // 填入当前用户 openid
    }).count({
      success: function(res) {
        console.log(res.total)
        let total = res.total;
        const batchTimes = Math.ceil(total / 20)
        console.log(batchTimes)   //获取需要获取几次 
        //初次循环获取云端数据库的分次数的promise数组
        for (let i = 0; i < batchTimes; i++) {
          console.log(i)
          userjhl.skip(i*20).get({
            success: function (res) {
              //console.log(res.data) 
              for (let j = 0; j < res.data.length; j++) {
                if (res.data[j].date >= that.data.sdate && res.data[j].date <= that.data.edate) {
                  that.data.list.push(res.data[j]);
                }
              }
              if (i == (batchTimes-1)) {
                console.log(that.data.list)
                wx.showToast({
                  title: '点击下载按钮下载',
                  icon: 'success'
                })
              }
            }
          })
        }
      }
    });
  },
 sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  },

   mydownloadall:async  function() {
    await this.mydownload();
    // 用法
    this.sleep(3000).then(() => {
        console.log("2");
        let that = this;
        const title = '下载地址'
        const content = that.data.fileUrl
        wx.showModal({
          title: title,
          content: content,
          cancelText: '取消',
          confirmText: '复制',
          success: (res) => {
            if (res.confirm) {
              console.log('用户点击复制')
              wx.setClipboardData({
                data: content,
                success: (res) => {
                  wx.showToast({
                    title: '复制好了',
                  })
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          },
        })
    })
  },

  mydownload: async function() {
    let that = this;
    if (that.data.list.length == 0) {
      wx.showToast({
        title: '订单数量为空',
        icon: 'success'
      })
      return;
    }
    console.log(that.data.list);

    var tm = this.dateFormat(this.data.currentDate);

    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'excelselect',
      // 传给云函数的参数
      data: {
        list: that.data.list,
        filename: tm
      },
      // 成功回调
      success(res) {
        console.log("保存成功", res)
        that.getFileUrl(res.result.fileID)
      },
      fail(res) {
        console.log("保存失败", res)
      }
    })
  },

  //获取云存储文件下载地址，这个地址有效期一天
  async getFileUrl(fileID) {
    let that = this;
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
        // get temp file URL
        console.log("文件下载链接", res.fileList[0].tempFileURL)
        that.setData({
          fileUrl: res.fileList[0].tempFileURL
        })
        console.log("1");
      },
      fail: err => {
        // handle error
      }
    })
  },
})