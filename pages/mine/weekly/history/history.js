// pages/mine/weekly/history/history.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      // {
      //   title: '2019', data: [
      //     {index: '1', start: '2019-02-04', end: '2019-02-07'},
      //     { index: '2', start: '2019-02-08', end: '2019-02-14' },
      //     { index: '3', start: '2019-02-15', end: '2019-02-21' },
      //   ]
      // },
      // {
      //   title: '2018', data: [
      //     { index: '1', start: '2018-02-01', end: '2018-02-07' },
      //     { index: '2', start: '2018-02-01', end: '2018-02-07' },
      //     { index: '3', start: '2018-02-01', end: '2018-02-07' },
      //   ]
      // }
    ],
    hasData: false,
  },

  visitWeekly: function (e) {
    console.log(e)
    let start = e.currentTarget.dataset.start
    let end = e.currentTarget.dataset.end
    if (start && end){
      wx.navigateTo({
        url: '../historyWeekly/index?start=' + start + '&end=' + end,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (app.globalData.historyList){
      that.setData({ list: app.globalData.historyList, hasData: true})
    }else{
      wx.showLoading({
        title: '加载中。。。',
        mask: true,
      })
      app.getHistoryList(function () {
        that.setData({ list: app.globalData.historyList, hasData: true })
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