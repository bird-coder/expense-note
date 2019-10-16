// pages/mine/program/default/default.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plans: [
      // {id: 1, title: '腹肌训练', ctime: '8:30', content: '111', state: 1 },
      // { id: 2, title: '腿部训练', ctime: '8:30', content: '222' },
      // { id: 3, title: '上肢训练', ctime: '8:30', content: '333' },
    ],
    idx: -1,
    hasChange: false,
    array: [],
    ctime: null,
    time_key: null,
    times: ['5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30']
  },

  /**
   * 选择训练开始时间
   */
  checkTime: function (e) {
    console.log(e)
    let index = e.detail.value
    this.setData({ time_key: index, ctime: this.data.times[index] })
  },

  /**
   * 选择训练计划
   */
  checkPlan: function (e) {
    const ds = e.currentTarget.dataset
    let data = { idx: this.data.idx, hasChange: this.data.hasChange }
    if (this.data.idx != ds.index) data.idx = ds.index
    data.hasChange = true
    this.setData(data)
  },

  /**
   * 上传训练计划
   */
  uploadPlan: function () {
    if (this.data.time_key == null) {
      wx.showToast({
        title: '请选择开始时间',
        duration: 2000
      })
      return
    }
    if (this.data.idx == null) {
      wx.showToast({
        title: '请选择训练计划',
        duration: 2000
      })
      return
    }
    let plan = this.data.plans[this.data.idx]
    console.log(plan)
    let that = this
    let token = wx.getStorageSync('token')
    app.wxRequest('addUserClick', { token: token, content: plan.content, title: plan.title, ctime: this.data.ctime }, data => {
      for (let i in app.globalData.plans) app.globalData.plans[i].state = 0
      app.globalData.plans.push(data.data)
      wx.showToast({
        title: '添加成功！',
        duration: 2000,
        success: function () {
          let pages = getCurrentPages()
          let prevPage = pages[pages.length - 2]
          prevPage.setData({ isUpdate: true })
          wx.navigateBack({
            delta: 1,
          })
        }
      })
    })
  },

  /**
   * 获取训练计划
   */
  getPlans: function () {
    let that = this
    if (app.globalData.default_plans) {
      that.setData({ plans: app.globalData.default_plans })
    }else {
      let token = wx.getStorageSync('token')
      app.wxRequest('getDefaultUserClick', { token: token }, data => {
        that.setData({ plans: data.list })
        app.globalData.default_plans = data.list
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlans()
    if (app.globalData.configs['sports_item']) {
      this.setData({ array: app.globalData.configs.sports_item })
    } else {
      let token = wx.getStorageSync('token')
      app.wxRequest('getConfig', { token: token }, data => {
        that.setData({ array: data.list.sports_item })
        app.globalData.configs = data.list
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