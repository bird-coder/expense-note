// pages/mine/weekly/weekly.js
const wxCharts = require('../../../utils/wxcharts-min.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '周报',
    ename: 'weekly',
    image: '../../../images/weekly.jpg',
    charts: {
      'time': { id: 'timeCharts', categories: [1, 2, 3, 4, 5, 6], series: [
          {name: '运动时间', data: [50,30,10,12,46,20]}
        ], unit: '时间(小时)', title: '一周运动时间统计'
      },
      'step': {
        id: 'stepCharts', categories: [1, 2, 3, 4, 5, 6], series: [
          { name: '步数', data: [50, 30, 10, 12, 46, 20] },
          { name: '个数', data: [20, 36, 50, 45, 24, 10] },
        ], unit: '步数(步)', title: '一周步数统计'
      },
      'consume': {
        id: 'consumeCharts', categories: [1, 2, 3, 4, 5, 6], series: [
          { name: '消耗卡路里', data: [50, 30, 10, 12, 46, 20] }
        ], unit: '卡路里(千焦)', title: '一周消耗卡路里统计'
      },
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let windowWidth = 320
    let res = wx.getSystemInfoSync()
    console.log(res)
    if (res && res.windowWidth) windowWidth = res.windowWidth
    for (let i in this.data.charts){
      new wxCharts({
        canvasId: this.data.charts[i]['id'],
        type: 'area',
        categories: this.data.charts[i]['categories'],
        series: this.data.charts[i]['series'],
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          title: this.data.charts[i]['unit'],
          min: 0
        },
        width: windowWidth,
        height: 200,
        dataLabel: true,
        legend: false
      });
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