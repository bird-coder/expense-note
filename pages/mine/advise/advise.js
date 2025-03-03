// pages/mine/advise/advise.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdn: 'https://ble.jltop.top/client/',
    essays: [],
    videos: []
  },

  checkEssay: function(e) {
    const ds = e.currentTarget.dataset
    wx.navigateTo({
      url: './essay/essay?index='+ds.index,
    })
  },

  checkVideo: function (e) {
    const ds = e.currentTarget.dataset
    wx.navigateTo({
      url: './video/video?index=' + ds.index,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (app.globalData.course) this.setData({essays: app.globalData.course['essays'], videos: app.globalData.course['videos']})
    else {
      app.getCourse(function () {
        that.setData({ essays: app.globalData.course['essays'], videos: app.globalData.course['videos']})
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