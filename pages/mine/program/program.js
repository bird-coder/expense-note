// pages/mine/program/program.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasPlan: false,
    plans: {
      1:{id: 1, title: '腹肌训练', ctime: '8:30', ctype: 1, target: 10, num: 3 },
      2:{ id: 2, title: '腿部训练', ctime: '8:30', ctype: 2, target: 10, num: 3 },
      3:{ id: 3, title: '上肢训练', ctime: '8:30', ctype: 3, target: 10, num: 3 },
    },
    idx: 0,
    idx_tmp: 0,//初始值
    hasChange: false
  },

  /**
   * 添加训练计划
   */
  addPlan: function () {
    wx.navigateTo({
      url: './plan/plan',
    })
  },

  /**
   * 编辑训练计划
   */
  editPlan: function (e) {
    const ds = e.currentTarget.dataset
    wx.navigateTo({
      url: './plan/plan?id='+ds.id,
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
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let that = this
    // let token = wx.getStorageSync('token')
    // app.wxRequest('getUserClick', {token: token}, data => {
      
    // })
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