//app.js
const utils = require('./utils/util.js')

App({
  onLaunch: function (res) {
    let that = this
    if (typeof wx.getUpdateManager === 'function'){
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        console.log(res)
        if (res.hasUpdate){
          wx.showModal({
            title: '更新提示',
            content: '有新版本正在下载中！',
          })
        }else{
          for (let i in res.query){
            if (i === 'from'){
              that.globalData.adFrom = res.query[i]
            }
          }
        }
      })
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
              for (let i in res.query) {
                if (i === "from") {
                  that.globalData.adFrom = res.query[i];
                }
              }
            }
          }
        })
      })
      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
          title: '更新提示',
          content: '新版本下载失败，请删除图标重新搜索',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              // 应用更新失败退出游戏
              wx.navigateBack({
                delta: 0
              })
            }
          }
        })
      })
    } else {
      wx.showModal({
        title: '更新提示',
        content: '为了正常运行，建议您先升级至微信最高版本！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // 微信版本过低退出游戏
            wx.navigateBack({
              delta: 0
            })
          }
        }
      })
    }
    let systemInfo = wx.getSystemInfoSync()
    if (systemInfo.system.toLowerCase().indexOf('ios') != -1) that.globalData.device = 'ios'
    else this.globalData.device = 'android'
    wx.checkSession({
      success: function() {
        let token = wx.getStorageSync('token')
        that.wxRequest('auth', { token: token}, data => {
          that.globalData.userInfo = data.user
          that.globalData.token = data.token
          wx.setStorageSync('token', data.token)
        }, 'POST')
        that.getWeekly()
      },
      fail: function() {
        that.globalData.overdue = true
      }
    })
  },
  startTimer: function () {
    let that = this
    that.globalData.oldTime = utils.getTimeStamp()
    that.stopTimer(that.globalData.timer)
    that.globalData.timer = setInterval(function () {
      that.updateUserSports()
    }, 1000 * 600)
  },
  stopTimer: function (timer) {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  },
  updateUserSports: function () {
    let that = this
    if (that.globalData.newData.time && that.globalData.newData.time > that.globalData.oldTime)
    that.wxRequest('updateUserSports', {
      token: that.globalData.token,
      type: 1,
      count: that.globalData.newData.count,
      duration: that.globalData.newData.time - that.globalData.oldData.time,
      consume: that.globalData.newData.consume,
    }, data => {
      console.log('数据汇报结果：' + data.msg)
      that.globalData.oldTime = that.globalData.newData.time
      that.globalData.newData = {count: 0, time: null, consume: 0}
    }, 'POST')
  },
  //分享内容
  getShare: function () {
    return {
      title: '今天的健身计划完成了吗？',
      imageUrl: 'https://mm.shmxplay.com/cdn/gamebox/1.png',
    }
  },
  login: function(cb) {
    //开启分享
    // wx.showShareMenu({
    //   withShareTicket: true
    // });
    let that = this
    if (!that.globalData.userInfo){
      wx.showLoading({
        title: '加载中',
      })
      wx.login({
        success: res => {
          console.log(res)
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          that.wxRequest('login', {
            platform: 'weixin',
            device: that.globalData.device,
            ver: that.globalData.ver,
            code: res.code,
          }, data => {
            that.globalData.userInfo = data.user
            that.globalData.token = data.token
            wx.setStorageSync('token', data.token)
          }, 'POST')
        }
      })
    }
  },
  getWeekly: function (cb) {
    let that = this
    let token = wx.getStorageSync('token')
    that.wxRequest('getWeekly', { token: token}, data => {
      that.globalData.weekly = {charts: data.charts, list: data.list}
      typeof cb === 'function' && cb()
    }, 'POST')
  },
  //请求服务器
  wxRequest: function (url, params, cb, type = 'GET') {
    console.log(params)
    wx.request({
      url: 'https://ble.jltop.top/mobile/' + url,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: type,
      data: params,
      success: function (res) {
        wx.hideLoading();
        console.log(res.data);
        if (res.data.ret != 0) wx.showToast({
          title: res.data.msg,
        })
        else typeof cb == "function" && cb(res.data)
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        })
      },
      complete: function (res) { },
    });
  },
  globalData: {
    overdue: false,
    userInfo: null,
    token: null,
    adFrom: "",
    env: 'dev',
    background: false,
    device: 'ios',
    ver: '1.0.0',
    timer: null,
    oldTime: null,
    newData: {
      count: 0,
      time: null,
      consume: 0,
    },
    weekly: null,
  },
  onShow: function() {
    console.log('应用前台显示')
    if (this.globalData.background) this.startTimer()
    this.globalData.background = false
  },
  onHide: function() {
    console.log('应用进入后台')
    this.globalData.background = true
    this.stopTimer(this.globalData.timer)
    this.updateUserSports()
  }
})