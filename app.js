//app.js
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
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
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
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  globalData: {
    userInfo: null,
    adFrom: "",
    env: 'dev',
    background: false,
  },
  onShow: function() {
    console.log('应用前台显示')
    this.globalData.background = false
  },
  onHide: function() {
    console.log('应用进入后台')
    this.globalData.background = true
  }
})