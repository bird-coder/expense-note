// pages/mine/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    options: [
      { 'name': '周报', 'ename': 'weekly', 'img': '../../images/weekly.jpg', 'url': './weekly/weekly' },
      { 'name': '里程碑', 'ename': 'milestone', 'img': '../../images/milestone.jpg', 'url': './milestone/milestone' },
      { 'name': '训练计划', 'ename': 'program', 'img': '../../images/program.jpg', 'url': './program/program' },
      { 'name': '教程', 'ename': 'course', 'img': '../../images/advise.jpg', 'url': './advise/advise' },
      // { 'name': '反馈', 'ename': 'feedback', 'img': '../../images/feedback.jpg', 'url': './feedback/feedback' },
      { 'name': '健身交流', 'ename': 'friends', 'img': '../../images/friends.jpg', 'url': './friends/friends' },
      { 'name': '设置', 'ename': 'config', 'img': '../../images/config.jpg', 'url': './config/config' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      if (!app.globalData.hasLogin) return
      let token = wx.getStorageSync('token')
      let that = this
      app.wxRequest('auth', { token: token }, data => {
        app.globalData.userInfo = data.user
        app.globalData.token = data.token
        wx.setStorageSync('token', data.token)
        that.setData({
          userInfo: data.user,
          hasUserInfo: true
        })
      }, 'POST')
    }
  },
  selectItem: function(e) {
    const ds = e.currentTarget.dataset
    const id = ds.id
    console.log(id)
    // if ([3].indexOf(id*1) != -1) {
    //   wx.showToast({
    //     title: '此功能暂未开放，敬请期待！',
    //     duration: 2000
    //   })
    //   return
    // }
    wx.navigateTo({
      url: this.data.options[id]['url'],
    })
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: './config/config',
    })
  },
  bindLogin: function() {
    wx.redirectTo({
      url: '/pages/auth/auth',
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