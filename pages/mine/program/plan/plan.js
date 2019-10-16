// pages/mine/program/plan/plan.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan: {},
    array: [],
    key: null,
    num: 0,
    hasChange: false,
    index: null,
    ctime: null,
    time_key: null,
    times: ['5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30']
  },

  /**
   * 添加项目
   */
  addItem: function () {
    if (this.data.key == null) return
    if (this.data.plan[this.data.key]) {
      wx.showToast({
        title: '训练项目不要重复哦',
        duration: 1000
      })
      return
    }
    this.data.plan[this.data.key] = this.data.num
    this.setData({ plan: this.data.plan, key: null, num: 0, hasChange: true})
  },

  /**
   * 删除项目
   */
  delItem: function (e) {
    const ds = e.currentTarget.dataset
    delete this.data.plan[ds.index]
    this.setData({plan: this.data.plan, hasChange: true})
  },

  /**
   * 选择项目
   */
  checkItem: function (e) {
    let key = e.detail.value
    this.setData({ key: key})
  },

  /**
   * 输入项目数量
   */
  checkItemNum: function (e) {
    console.log(e)
    let num = e.detail.value
    this.setData({ num: num })
  },

  /**
   * 选择训练开始时间
   */
  checkTime: function (e) {
    console.log(e)
    let index = e.detail.value
    this.setData({ time_key: index, ctime: this.data.times[index], hasChange: true })
  },

  /**
   * 添加训练计划
   */
  uploadPlan: function () {
    console.log(this.data.plan)
    if (this.data.time_key == null) {
      wx.showToast({
        title: '请选择开始时间',
        duration: 2000
      })
      return
    }
    if (Object.keys(this.data.plan).length == 0) {
      wx.showToast({
        title: '请添加项目',
        duration: 2000
      })
      return
    }
    let that = this
    let token = wx.getStorageSync('token')
    let id = 0
    if (this.data.index != null && app.globalData.plans[this.data.index]) {
      id = app.globalData.plans[this.data.index].id
    }
    app.wxRequest('addUserClick', { token: token, content: this.data.plan, ctime: this.data.ctime, title: '综合训练', id: id}, data => {
      for (let i in app.globalData.plans) app.globalData.plans[i].state = 0
      if (id == 0) app.globalData.plans.push(data.data)
      else app.globalData.plans[that.data.index] = data.data
      wx.showToast({
        title: '上传成功！',
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this
    let index = options.index
    if (app.globalData.plans[index]) {
      let time_key = this.data.times.indexOf(app.globalData.plans[index].ctime)
      this.setData({ plan: app.globalData.plans[index].content, time_key: time_key, ctime: app.globalData.plans[index].ctime, index: index})
    }
    console.log(app.globalData.configs)
    if (app.globalData.configs['sports_item']) {
      this.setData({ array: app.globalData.configs.sports_item})
    }else {
      let token = wx.getStorageSync('token')
      app.wxRequest('getConfig', {token: token}, data => {
        that.setData({array: data.list.sports_item})
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