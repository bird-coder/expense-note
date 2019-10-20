// pages/mine/program/program.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasPlan: false,
    plans: [
      // {id: 1, title: '腹肌训练', ctime: '8:30', content: '111', state: 1 },
      // { id: 2, title: '腿部训练', ctime: '8:30', content: '222' },
      // { id: 3, title: '上肢训练', ctime: '8:30', content: '333' },
    ],
    idx: -1,
    idx_tmp: -1,//初始值
    hasChange: false,
    isUpdate: false,
    array: [],
  },

  /**
   * 查看推荐训练计划
   */
  goToDefault: function () {
    if (!app.globalData.hasLogin) {
      app.backToLogin()
      return
    }
    wx.navigateTo({
      url: './default/default',
    })
  },

  /**
   * 添加训练计划
   */
  addPlan: function () {
    if (!app.globalData.hasLogin) {
      app.backToLogin()
      return
    }
    if (this.data.plans.length >= 10) {
      wx.showToast({
        title: '最多能添加10个训练计划',
        duration: 2000,
      })
      return
    }
    wx.navigateTo({
      url: './plan/plan',
    })
  },

  /**
   * 编辑训练计划
   */
  editPlan: function (e) {
    if (!app.globalData.hasLogin) {
      app.backToLogin()
      return
    }
    const ds = e.currentTarget.dataset
    wx.navigateTo({
      url: './plan/plan?index='+ds.index,
    })
  },

  /**
   * 选择训练计划
   */
  checkPlan: function (e) {
    const ds = e.currentTarget.dataset
    let data = {idx: this.data.idx, hasChange: this.data.hasChange}
    if (this.data.idx != ds.index) data.idx = ds.index
    if (this.data.idx_tmp != ds.index) data.hasChange = true
    else data.hasChange = false
    this.setData(data)
  },

  /**
   * 更新训练计划
   */
  updatePlan: function () {
    if (!app.globalData.hasLogin) {
      app.backToLogin()
      return
    }
    let id = this.data.plans[this.data.idx].id
    console.log(id)
    let that = this
    let token = wx.getStorageSync('token')
    app.wxRequest('switchUserClick', {token: token, id: id}, data => {
      that.setData({idx_tmp: that.data.idx, hasChange: false})
      wx.showToast({
        title: '切换成功！',
        duration: 2000
      })
    })
  },

  /**
   * 获取训练计划
   */
  getPlans: function () {
    let that = this
    let token = wx.getStorageSync('token')
    app.wxRequest('getUserClick', { token: token }, data => {
      that.data.idx = data.index
      that.data.idx_tmp = data.index
      that.setData({ plans: data.list, idx: that.data.idx, idx_tmp: that.data.idx_tmp })
      app.globalData.plans = data.list
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlans()
    if (app.globalData.configs['sports_item']) {
      this.setData({ array: app.globalData.configs.sports_item })
    } else {
      let that = this
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
    if (this.data.isUpdate) {
      for (let i in app.globalData.plans) {
        if (app.globalData.plans[i].state == 1) {
          if (this.data.idx != i) this.data.idx = i
          if (this.data.idx_tmp != i) this.data.hasChange = true
          else this.data.hasChange = false
        }
      }
      this.setData({plans: app.globalData.plans, idx: this.data.idx, hasChange: this.data.hasChange, isUpdate: false})
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