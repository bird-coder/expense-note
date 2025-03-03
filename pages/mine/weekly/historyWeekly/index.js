// pages/mine/weekly/historyWeekly/index.js
const app = getApp()
const utils = require('../../../../utils/util.js')
const wxCharts = require('../../../../utils/wxcharts-min.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '周报',
    ename: 'weekly',
    image: '../../../../images/weekly.jpg',
    list: {
      'duration': { num: '0.00', old: '0.00', rate: '0.00%' },
      'step': { num: 0, old: 0, rate: '0.00%' },
      'distance': { num: '0.00', old: '0.00', rate: '0.00%' },
      'consume': { num: '0.0', old: '0.0', rate: '0.00%' }
    },
    charts: {
      'duration': {
        id: 'durationCharts', categories: [], series: [
          { name: '运动时间', data: [] }
        ], unit: '时间(小时)', title: '一周运动时间统计'
      },
      'step': {
        id: 'stepCharts', categories: [], series: [
          { name: '步数', data: [] },
          { name: '个数', data: [] },
        ], unit: '步数(步)', title: '一周步数统计'
      },
      'distance': {
        id: 'distanceCharts', categories: [], series: [
          { name: '骑行里程', data: [] },
          { name: '个数', data: [] },
        ], unit: '骑行里程(km)', title: '一周骑行里程统计'
      },
      'consume': {
        id: 'consumeCharts', categories: [], series: [
          { name: '消耗卡路里', data: [] }
        ], unit: '卡路里(大卡)', title: '一周消耗卡路里统计'
      },
    },
    hasCharts: false,
    start: null,
    end: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this
    let start = options.start
    let end = options.end
    if (start && end){
      this.setData({ start: start, end: end })
      let historyWeekly = app.globalData.historyWeekly
      let weekly = historyWeekly ? historyWeekly[start] : null
      if (historyWeekly && weekly){
        that.setData({
          charts: weekly.charts,
          list: weekly.list
        })
        that.initCharts(that.data.charts)
      }else{
        wx.showLoading({
          title: '周报生成中。。。',
          mask: true,
        })
        app.getHistoryWeekly(start, function () {
          if (!weekly && app.globalData.historyWeekly) weekly = app.globalData.historyWeekly[start]
          that.setData({
            charts: weekly.charts,
            list: weekly.list
          })
          that.initCharts(that.data.charts)
        })
        // that.initCharts(that.data.charts)
      }
    }else{
      wx.navigateBack({
        delta: 1,
      })
    }
  },

  initCharts: function (charts) {
    let windowWidth = 320
    let res = wx.getSystemInfoSync()
    console.log(res)
    if (res && res.windowWidth) windowWidth = res.windowWidth
    let length = 0
    for (let i in charts) {
      length++
      new wxCharts({
        canvasId: charts[i]['id'],
        type: 'area',
        categories: charts[i]['categories'],
        series: charts[i]['series'],
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          title: charts[i]['unit'],
          min: 0,
          max: utils.getArrSum(charts[i]['series'][0]['data']) == 0 ? 1 : null
        },
        width: windowWidth,
        height: 200,
        dataLabel: true,
        legend: false
      });
    }
    if (length > 0) {
      this.setData({ hasCharts: true })
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