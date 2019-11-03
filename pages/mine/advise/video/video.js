// pages/mine/advise/video/video.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdn: 'https://ble.jltop.top/client/',
    video: '',
    title: ''
  },

  fullscreen: function () {
    let that = this
    this.video = wx.createVideoContext('myvideo', this)
    setTimeout(function () {
      that.video.requestFullScreen()
    }, 100)
  },

  fullscreenChange: function (e) {
    console.log(e.detail)
    if (!e.detail.fullScreen) wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let index = options.index
    let videos = app.globalData.course['videos']
    if (videos[index]) this.setData({ video: videos[index].url, title: videos[index].title })
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