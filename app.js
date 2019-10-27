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
        wx.showLoading({
          title: '登录中。。。',
          mask: true,
        })
        that.globalData.hasLogin = true
        let token = wx.getStorageSync('token')
        that.wxRequest('auth', { token: token }, data => {
          if (data.user && data.token){
            that.globalData.userInfo = data.user
            that.globalData.token = data.token
            wx.setStorageSync('token', data.token)
            wx.hideLoading()
          }else{
            wx.hideLoading()
            that.login()
          }
        }, 'POST', false)
        that.getDaily()
        that.getWeekly()
        that.getConfig()
        that.getCourse()
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
  startClearTimer: function (cb) {
    let that = this
    that.stopTimer(that.globalData.clearTimer)
    that.globalData.clearTimer = setInterval(function () {
      if (typeof cb === 'function') cb()
    }, 1000 * 10)
  },
  updateUserSports: function () {
    let that = this
    if (that.globalData.newData.time && that.globalData.newData.time > that.globalData.oldTime && that.globalData.machine == 'count'){
      that.wxRequest('updateUserSports', {
        token: that.globalData.token,
        type: 1,
        count: that.globalData.newData.count,
        duration: that.globalData.newData.time - that.globalData.oldTime,
        consume: that.globalData.newData.consume,
      }, data => {
        console.log('count数据汇报结果：' + data.msg)
        that.globalData.oldTime = that.globalData.newData.time
        that.globalData.newData = { count: 0, time: null, consume: 0 }
      }, 'POST')
    } else if (that.globalData.speedData.time && that.globalData.speedData.time > that.globalData.oldTime && that.globalData.machine == 'speed') {
      that.wxRequest('updateUserSports', {
        token: that.globalData.token,
        type: 2,
        distance: that.globalData.speedData.distance,
        duration: that.globalData.speedData.time - that.globalData.oldTime,
        consume: that.globalData.speedData.consume,
        maxSpeed: that.globalData.speedData.maxSpeed,
        turns: that.globalData.speedData.turns,
      }, data => {
        console.log('speed数据汇报结果：' + data.msg)
        that.globalData.oldTime = that.globalData.speedData.time
        that.globalData.speedData = {
          speed: 0,
          distance: 0,
          time: null,
          consume: 0,
          maxSpeed: 0,
          turns: 0, }
      }, 'POST')
    }else{
      that.globalData.oldTime = utils.getTimeStamp()
    }
  },
  //分享内容
  getShare: function (title, page) {
    return {
      title: title || '今天的健身计划完成了吗？',
      path: page || 'pages/index/index',
      imageUrl: 'https://ble.jltop.top/client/images/timg.jpg',
    }
  },
  login: function(cb) {
    //开启分享
    // wx.showShareMenu({
    //   withShareTicket: true
    // });
    let that = this
    wx.showLoading({
      title: '登录中。。。',
      mask: true,
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.login({
            success: dt => {
              wx.getUserInfo({
                success: res => {
                  console.log(res)
                  that.wxRequest('login', {
                    platform: 'weixin',
                    device: that.globalData.device,
                    ver: that.globalData.ver,
                    code: dt.code,
                    encryptedData: res.encryptedData,
                    iv: res.iv,
                  }, data => {
                    that.globalData.userInfo = data.user
                    that.globalData.token = data.token
                    wx.setStorageSync('token', data.token)
                    wx.hideLoading()
                    typeof cb === 'function' && cb()
                  }, 'POST', false)
                }
              })
            }
          })
        }
      }
    })
  },
  getDaily: function (cb) {
    let that = this
    let token = wx.getStorageSync('token')
    that.wxRequest('getDaily', { token: token }, data => {
      that.globalData.daily = { charts: data.charts, list: data.list }
      that.globalData.dailyUpdateTime = data.updateTime
      typeof cb === 'function' && cb()
    }, 'POST')
  },
  getWeekly: function (cb) {
    let that = this
    let token = wx.getStorageSync('token')
    that.wxRequest('getWeekly', { token: token }, data => {
      that.globalData.weekly = {charts: data.charts, list: data.list}
      that.globalData.weeklyUpdateTime = data.updateTime
      typeof cb === 'function' && cb()
    }, 'POST')
  },
  getHistoryWeekly: function (monday = false, cb) {
    let that = this
    let token = wx.getStorageSync('token')
    if (!monday) monday = utils.getMonday(1)
    that.wxRequest('getWeekly', { token: token, monday: monday }, data => {
      if (!that.globalData.historyWeekly) that.globalData.historyWeekly = {}
      that.globalData.historyWeekly[monday] = { charts: data.charts, list: data.list }
      typeof cb === 'function' && cb()
    }, 'POST')
  },
  getHistoryList: function (cb) {
    let that = this
    let token = wx.getStorageSync('token')
    that.wxRequest('getHistoryList', { token: token }, data => {
      that.globalData.historyList = data.list
      typeof cb === 'function' && cb()
    }, 'POST')
  },
  uploadFormID: function () {
    if (this.globalData.formIds.length == 0) return
    let form_ids = this.globalData.formIds.join(';')
    let that = this
    let token = wx.getStorageSync('token')
    that.wxRequest('uploadFormID', { token: token, form_ids: form_ids }, data => {
      that.globalData.formIds = []
    }, 'POST')
  },
  getCourse: function (cb) {
    let that = this
    let token = wx.getStorageSync('token')
    that.wxRequest('getCourse', {token: token}, data => {
      that.globalData.course = data.course
      typeof cb == 'function' && cb()
    })
  },
  //获取配置
  getConfig: function () {
    let that = this
    let token = wx.getStorageSync('token')
    that.wxRequest('getConfig', { token: token }, data => {
      that.globalData.configs = data.list
    }, 'GET')
  },
  //返回登录
  backToLogin: function () {
    wx.showToast({
      title: '请先登录！',
      duration: 2000,
      success: function () {
        setTimeout(function(){
          wx.switchTab({
            url: '/pages/mine/index',
          })
        }, 1500)
      }
    })
  },
  //请求服务器
  wxRequest: function (url, params, cb, type = 'GET', isHide = true) {
    console.log(params)
    let that = this
    wx.request({
      url: 'https://ble.jltop.top/mobile/' + url,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: type,
      data: params,
      success: function (res) {
        if (isHide) wx.hideLoading();
        console.log(res.data);
        if (res.data.ret != 0) {
          if (res.data.msg && !res.data.relogin) wx.showToast({
            title: res.data.msg,
          })
        }
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
    clearTimer: null,
    oldTime: null,
    newData: {
      count: 0,
      time: null,
      consume: 0,
    },
    speedData: {
      speed: 0,
      distance: 0,
      time: null,
      consume: 0,
      maxSpeed: 0,
      turns: 0,
    },
    daily: null,
    dailyUpdateTime: null,
    weekly: null,
    weeklyUpdateTime: null,
    historyWeekly: null,
    historyList: null,
    trainning: false,
    machine: 'count',
    formIds: [],
    plans: [],
    default_plans: null,
    configs: {},
    hasLogin: false,
    course: null,
  },
  onShow: function() {
    console.log('应用前台显示')
    if (this.globalData.background) {
      this.startTimer()
      if (this.globalData.trainning){
        this.globalData.backToIndex = true
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    }
    this.globalData.background = false
  },
  onHide: function() {
    console.log('应用进入后台')
    this.globalData.background = true
    this.stopTimer(this.globalData.timer)
    this.stopTimer(this.globalData.clearTimer)
    this.updateUserSports()
    this.uploadFormID()
  },
  onError: function(msg) {
    this.wxRequest('feedback', { text: msg, }, null, 'POST')
  }
})