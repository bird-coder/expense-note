// pages/auth/auth.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  bindGetUserInfo: function(e) {
    console.log(e)
    if (e.detail.userInfo) {
      wx.showLoading({
        title: '授权登录中。。。',
        mask: true,
      })
      wx.login({
        success: res => {
          app.wxRequest('login', {
            platform: 'weixin',
            device: app.globalData.device,
            ver: app.globalData.ver,
            code: res.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
          }, data => {
            app.globalData.userInfo = data.user
            app.globalData.token = data.token
            app.globalData.overdue = false
            wx.setStorageSync('token', data.token)
            wx.switchTab({
              url: '/pages/index/index',
            })
          }, 'POST')
        }
      })
    }else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权后再进入',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res){
          if (res.confirm) {
            console.log('用户点击授权')
          }
        }
      })
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