// pages/mine/milestone/milestone.js
const app = getApp()
const utils = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: '../../../images/milestone.jpg',
    data: [
      // {num: '5 h', ltime: '2019-01-11', icon: 'icon-jianshen', type: '单日运动时间'},
      // { num: '2100 步', ltime: '2019-01-11', icon: 'icon-ziyuan', type: '单日步数' },
      // { num: '300 大卡', ltime: '2019-01-11', icon: 'icon-xiaohao', type: '单日消耗卡路里' },
    ],
    list: [
      {duration: '0h', max_duration: '0h'},
      { step: '0步', max_step: '0步' },
      { consume: '0大卡', max_consume: '0大卡' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        data: [
          { num: utils.timeToHour(app.globalData.userInfo.max_duration) + ' h', ltime: utils.formatDate(new Date(app.globalData.userInfo.mdtime * 1000)), icon: 'icon-jianshen', type: '单日运动时间', state: app.globalData.userInfo.max_duration ? true : false},
          { num: app.globalData.userInfo.max_step + ' 步', ltime: utils.formatDate(new Date(app.globalData.userInfo.mstime * 1000)), icon: 'icon-ziyuan', type: '单日步数', state: app.globalData.userInfo.max_step > 0 ? true : false },
          { num: app.globalData.userInfo.max_distance + ' km', ltime: utils.formatDate(new Date(app.globalData.userInfo.mdstime * 1000)), icon: 'icon-weizhi', type: '单日骑行里程', state: app.globalData.userInfo.max_distance > 0 ? true : false },
          { num: app.globalData.userInfo.max_consume + ' 大卡', ltime: utils.formatDate(new Date(app.globalData.userInfo.mctime * 1000)), icon: 'icon-xiaohao', type: '单日消耗卡路里', state: app.globalData.userInfo.max_consume > 0 ? true : false },
          { num: app.globalData.userInfo.max_speed + ' km/h', ltime: utils.formatDate(new Date(app.globalData.userInfo.mctime * 1000)), icon: 'icon-shijian1', type: '最大骑行速度', state: app.globalData.userInfo.max_speed > 0 ? true : false },
        ],
        list: {
          duration: { total: utils.timeToHour(app.globalData.userInfo.duration) + 'h', max: utils.timeToHour(app.globalData.userInfo.max_duration) + 'h'},
          step: { total: app.globalData.userInfo.step + '步', max: app.globalData.userInfo.max_step + '步' },
          distance: { total: app.globalData.userInfo.distance + 'km', max: app.globalData.userInfo.max_distance + 'km' },
          consume: { total: app.globalData.userInfo.consume + '大卡', max: app.globalData.userInfo.max_consume + '大卡' },
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