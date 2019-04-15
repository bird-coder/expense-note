// pages/mine/weekly/weekly.js
const app = getApp()
const utils = require('../../../utils/util.js')
const wxCharts = require('../../../utils/wxcharts-min.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '周报',
    ename: 'weekly',
    image: '../../../images/weekly.jpg',
    list: {
      'duration': {num: '0.00', old: '0.00', rate: '0.00%'},
      'step': { num: 0, old: 0, rate: '0.00%'},
      'distance': { num: '0.00', old: '0.00', rate: '0.00%' },
      'consume': { num: '0.0', old: '0.0', rate: '0.00%'}
    },
    charts: {
      'duration': { id: 'durationCharts', categories: [], series: [
          {name: '运动时间', data: []}
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
    daily: {
      charts: null,
      list: null,
    },
    hasCharts: false,
    hasDayCharts: false,
    update: false,
    type: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.initCharts()
    let that = this
    if (app.globalData.weekly && !that.needUpdateWeekly()) {
      that.setData({
        charts: app.globalData.weekly.charts,
        list: app.globalData.weekly.list
      })
      that.initCharts(that.data.charts)
    }else {
      that.setData({update: true})
      wx.showLoading({
        title: '周报生成中。。。',
        mask: true,
      })
      app.getWeekly(function () {
        that.setData({
          charts: app.globalData.weekly.charts,
          list: app.globalData.weekly.list
        })
        that.initCharts(that.data.charts)
        that.setData({ update: false })
      })
    }
    if (app.globalData.daily){
      that.setData({
        daily: {
          charts: app.globalData.daily.charts,
          list: app.globalData.daily.list
        }
      })
    }
  },
  needUpdateWeekly: function () {
    let timeDiff = utils.getTimeStamp() - app.globalData.weeklyUpdateTime
    if (app.globalData.weeklyUpdateTime && timeDiff >= 3600) return true
    return false
  },
  needUpdateDaily: function () {
    let timeDiff = utils.getTimeStamp() - app.globalData.dailyUpdateTime
    if (app.globalData.dailyUpdateTime && timeDiff >= 3600) return true
    return false
  },
  initCharts: function (charts, type = 0) {
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
      if (!type && !this.data.hasCharts) this.setData({hasCharts: true})
      else if (type && !this.data.hasDayCharts) this.setData({ hasDayCharts: true })
    }
  },
  
  switchWeekly: function () {
    if (this.data.type == 1) this.setData({type: 0})
    this.initCharts(this.data.charts)
  },
  switchDaily: function () {
    let that = this
    if (this.data.type == 0) this.setData({ type: 1 })
    if (this.needUpdateDaily()){
      wx.showLoading({
        title: '数据生成中。。。',
        mask: true,
      })
      app.getDaily(function () {
        that.setData({
          daily: {
            charts: app.globalData.daily.charts,
            list: app.globalData.daily.list
          }
        })
        that.initCharts(that.data.daily.charts, 1)
      })
    }else {
      that.initCharts(that.data.daily.charts, 1)
    }
  },
  visitHistory: function () {
    wx.navigateTo({
      url: './history/history',
    })
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
    let that = this
    if (that.needUpdateWeekly() && !that.data.update) {
      wx.showLoading({
        title: '周报生成中。。。',
        mask: true,
      })
      app.getWeekly(function () {
        that.setData({
          charts: app.globalData.weekly.charts,
          list: app.globalData.weekly.list
        })
        that.initCharts(that.data.charts)
      })
    }
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