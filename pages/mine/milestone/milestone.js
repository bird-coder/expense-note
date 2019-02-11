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
      {num: '5 h', ltime: '2019-01-11', icon: 'icon-jianshen', type: '单日运动时间'},
      { num: '2100 步', ltime: '2019-01-11', icon: 'icon-ziyuan', type: '单日步数' },
      { num: '300 千焦', ltime: '2019-01-11', icon: 'icon-xiaohao', type: '单日消耗卡路里' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        data: [
          { num: app.globalData.userInfo.max_duration + ' h', ltime: utils.formatDate(new Date(app.globalData.userInfo.mdtime)), icon: 'icon-jianshen', type: '单日运动时间', state: app.globalData.userInfo.max_duration ? true : false},
          { num: app.globalData.userInfo.max_step + ' 步', ltime: utils.formatDate(new Date(app.globalData.userInfo.mstime)), icon: 'icon-ziyuan', type: '单日步数', state: app.globalData.userInfo.max_step ? true : false },
          { num: app.globalData.userInfo.max_consume + ' 千焦', ltime: utils.formatDate(new Date(app.globalData.userInfo.mctime)), icon: 'icon-xiaohao', type: '单日消耗卡路里', state: app.globalData.userInfo.max_consume ? true : false },
        ]
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