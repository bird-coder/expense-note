// pages/mine/feedback/feedback.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedback: '',
  },

  getFeedback: function (e) {
    console.log(e.detail)
    this.setData({feedback: e.detail.value})
  },

  postFeedback: function () {
    let that = this
    let token = wx.getStorageSync('token')
    app.wxRequest('feedback', {
      token: token,
      type: 1,
      text: that.data.feedback,
    }, function (res) {
      that.setData({feedback: ''})
      wx.showToast({
        title: res.msg,
      })
    }, 'POST')
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

  }
})