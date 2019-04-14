//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js')

Page({
  data: {
    searching: false,
    connected: false,
    trainning: false,
    chs: [],
    total: 0,
    speedData: {
      speed: 0,
      distance: 0,
      turns: 0,
    },
    isBack: false,
  },
  startTrainning: function() {
    console.log('训练开始')
    // wx.navigateTo({
    //   url: '../machine/index',
    // })
    if (this.data.trainning) {
      wx.setKeepScreenOn({
        keepScreenOn: false,
      })
      this.setData({trainning: false})
      app.globalData.trainning = false
      app.stopTimer(app.globalData.timer)
      app.stopTimer(app.globalData.clearTimer)
      this.clearCount()
    }
    else {
      wx.setKeepScreenOn({
        keepScreenOn: true,
      })
      this.setData({ trainning: true })
      app.globalData.trainning = true
      app.startTimer()
      app.startClearTimer(this.clearCount)
    }
  },
  clearCount: function() {
    if (this.data.total > 0 && app.globalData.machine == 'count'){
      this.setData({ total: 0 })
      app.updateUserSports()
    }else if (this.speedData.distance > 0 && app.globalData.machine == 'speed') {
      this.setData({
        speedData: {
          speed: 0,
          distance: 0,
          turns: 0,
        }
      })
      app.updateUserSports()
    }else{
      app.globalData.oldTime = utils.getTimeStamp()
    }
  },
  increaseCount: function(num) {
    let type = parseInt(num.substr(0, 2), 16)
    let machine = 'count'
    switch(type){
      case 0x01: 
        console.log("踏步机计数");break;
      case 0x02: 
        console.log("健腹机");break;
      case 0x03: 
        machine = 'speed'
        console.log("动感单车");break;
      default: console.log("器材类型错误"); return
    }
    if (this.data.trainning && !app.globalData.background) {
      if (machine == 'count') {
        let value = parseInt(num.substr(2), 16)
        let count = utils.bigToSmall(value)
        this.setData({ total: this.data.total + count })
        let total = app.globalData.newData.count + count
        app.globalData.newData = {
          count: total,
          time: utils.getTimeStamp(),
          consume: total * 0.1,
        }
        app.startClearTimer(this.clearCount)
      } else {
        let length = parseInt(num.substr(2, 2), 16)
        let val1 = parseInt(num.substr(4, length), 16)
        let val2 = parseInt(num.substr(4+length, length), 16)
        let speed = utils.bigToSmall(val1)
        let turns = utils.bigToSmall(val2)
        let distance = parseFloat((speed / 3600).toFixed(2))
        console.log('speed', distance)
        //处理单车数据
        let distance2 = parseFloat((this.data.speedData.distance + distance).toFixed(2))
        this.setData({
          speedData: {
            speed: speed,
            distance: distance2,
            turns: turns,
          }
        })
        let total = parseFloat((app.globalData.speedData.distance + distance).toFixed(2))
        let maxSpeed = speed > app.globalData.speedData.maxSpeed ? speed : app.globalData.speedData.maxSpeed
        app.globalData.speedData = {
          speed: speed,
          distance: total,
          time: utils.getTimeStamp(),
          consume: total * 20,
          maxSpeed: maxSpeed,
          turns: turns,
        }
        app.startClearTimer(this.clearCount)
      }
    }
  },
  onLoad: function () {
    // app.login()
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          if (app.globalData.overdue){
            wx.showLoading({
              title: '登录中。。。',
              mask: true,
            })
            wx.login({
              success: dt => {
                wx.getUserInfo({
                  success: res => {
                    console.log(res)
                    app.wxRequest('login', {
                      platform: 'weixin',
                      device: app.globalData.device,
                      ver: app.globalData.ver,
                      code: dt.code,
                      encryptedData: res.encryptedData,
                      iv: res.iv,
                    }, data => {
                      app.globalData.userInfo = data.user
                      app.globalData.token = data.token
                      app.globalData.overdue = false
                      wx.setStorageSync('token', data.token)
                      wx.hideLoading()
                    }, 'POST', false)
                  }
                })
              }
            })
          }
        }else {
          wx.redirectTo({
            url: '/pages/auth/auth',
          })
        }
      }
    })
  },
  onReady: function () {
    var that = this;
    var shareAnimation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
      //delay: 0,
      //transformOrigin: '"50% 50% 0"',
    });
    var next = true;
    setInterval(function () {
      if (next) {
        shareAnimation.translateX(-6).step()
        next = !next;
      } else {
        shareAnimation.translateX(0).step()
        next = !next;
      }
      // 更新数据
      that.setData({
        // 导出动画示例
        shareAnimation: shareAnimation.export(),
      })
    }.bind(that), 500);
    var increaseAnimation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-inout',
    })
    var increase = true
    setInterval(function() {
      if (increase){
        increaseAnimation.scale(1.5).step()
        increaseAnimation.opacity(0.8).step()
        increase = !increase
      }else{
        increaseAnimation.scale(1).step()
        increaseAnimation.opacity(1).step()
        increase = !increase
      }
      that.setData({
        increaseAnimation: increaseAnimation.export()
      })
    }.bind(that), 500)
    var fingerAnimation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-inout',
    })
    var finger = true
    setInterval(function () {
      if (finger) {
        fingerAnimation.translateY(10).step()
        finger = !finger
      } else {
        fingerAnimation.translateY(0).step()
        finger = !finger
      }
      that.setData({
        fingerAnimation: fingerAnimation.export()
      })
    }.bind(that), 500)
  },
  onShow: function() {
    if (app.globalData.backToIndex){
      app.globalData.backToIndex = false
      app.startClearTimer(this.clearCount)
      this.setData({total: 0})
      this.setData({
        speedData: {
          speed: 0,
          distance: 0,
          turns: 0,
        }
      })
    }
    const checkedId = wx.getStorageSync('checkedId') || null
    console.log(checkedId);
    if (checkedId && this.data.isBack) {
      this.setData({ 
        connected: true,
        trainning: true,
        deviceId: checkedId,
        isBack: false
      })
      wx.setKeepScreenOn({
        keepScreenOn: true,
      })
      app.startTimer()
      app.startClearTimer(this.clearCount)
      this.stopBluetoothDevicesDiscovery()
      this.getBLEDeviceServices(checkedId)
      this.onBLEConnectionStateChange()
    }
  },
  //打开蓝牙
  openBluetoothAdapter() {
    console.log('开始搜索')
    let that = this
    if (this.data.searching){
      this._discoveryStarted = false
      this.stopBluetoothDevicesDiscovery()
      return
    }else{
      this.setData({ searching: true })
    }
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        this.startBluetoothDevicesDiscovery()
      },
      fail: (res) => {
        if (res.errCode === 10001) {
          wx.showToast({
            title: '请打开手机蓝牙',
            duration: 2000
          })
          wx.onBluetoothAdapterStateChange(function (res) {
            console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              if (that.data.searching) that.startBluetoothDevicesDiscovery()
            }
          })
        }
      }
    })
  },
  //监听蓝牙连接状态
  onBLEConnectionStateChange() {
    let that = this
    wx.onBLEConnectionStateChange(function(res) {
      console.log('连接断开')
      if (!res.connected){
        wx.showToast({
          title: '连接已断开',
          image: '../../images/ad_close.png',
          duration: 2000,
          success: function() {
            app.stopTimer(app.globalData.timer)
            app.stopTimer(app.globalData.clearTimer)
            app.updateUserSports()
            that.closeBluetoothAdapter()
          }
        })
      }
    })
  },
  //开始搜索蓝牙设备
  startBluetoothDevicesDiscovery() {
    if (this._discoveryStarted) {
      return
    }
    this._discoveryStarted = true
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: (res) => {
        console.log('startBluetoothDevicesDiscovery success', res)
        wx.navigateTo({
          url: '../machine/index',
        })
        //this.onBluetoothDeviceFound()
      },
    })
  },
  //停止搜索
  stopBluetoothDevicesDiscovery() {
    this.setData({searching: false})
    wx.stopBluetoothDevicesDiscovery()
  },
  //获取蓝牙设备所有服务
  getBLEDeviceServices(deviceId) {
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].uuid.indexOf('ff00') != -1 || res.services[i].uuid.indexOf('FF00') != -1) {
            this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
            return
          }
        }
      }
    })
  },
  //获取蓝牙设备某个服务的所有特征值
  getBLEDeviceCharacteristics(deviceId, serviceId) {
    let that = this
    wx.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
        console.log('getBLEDeviceCharacteristics success', res.characteristics)
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.uuid.indexOf('ff01') == -1 && item.uuid.indexOf('FF01') == -1) continue
          // if (item.properties.read) {
          //   wx.readBLECharacteristicValue({
          //     deviceId,
          //     serviceId,
          //     characteristicId: item.uuid,
          //     success: function (res) {
          //       console.log("readBLECharacteristicValue")
          //       console.log(res)
          //     }
          //   })
          // }
          // if (item.properties.write) {
          //   console.log('can write...')
          //   this.setData({
          //     canWrite: true
          //   })
          //   this._deviceId = deviceId
          //   this._serviceId = serviceId
          //   this._characteristicId = item.uuid
          //   this.writeBLECharacteristicValue()
          // }
          if (item.properties.notify || item.properties.indicate) {
            //订阅特征值变化
            wx.notifyBLECharacteristicValueChange({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              state: true,
              success: function(res){
                console.log(res)
              },
              fail: function(res){
                console.log(res)
              }
            })
          }
        }
      },
      fail(res) {
        console.error('getBLEDeviceCharacteristics', res)
      }
    })
    // 操作之前先监听，保证第一时间获取数据
    wx.onBLECharacteristicValueChange((characteristic) => {
      let count = utils.ab2hex(characteristic.value)
      console.log(count)
      if (count) that.increaseCount(count)
    })
  },
  //向蓝牙设备特征值写入二进制数据
  // writeBLECharacteristicValue() {
  //   // 向蓝牙设备发送一个0x00的16进制数据
  //   let buffer = new ArrayBuffer(1)
  //   let dataView = new DataView(buffer)
  //   dataView.setUint8(0, Math.random() * 255 | 0)
  //   console.log("发送的数据：")
  //   for (let i = 0; i < dataView.byteLength; i++) {
  //     console.log("0x" + dataView.getUint8(i).toString(16))
  //   }
  //   wx.writeBLECharacteristicValue({
  //     deviceId: this._deviceId,
  //     serviceId: this._deviceId,
  //     characteristicId: this._characteristicId,
  //     value: buffer,
  //     success: function (res) {
  //       console.log("success 指令发送成功！")
  //     }
  //   })
  // },
  //断开蓝牙连接
  closeBLEConnection() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId
    })
    this.setData({
      connected: false,
      chs: [],
      canWrite: false,
    })
  },
  //关闭蓝牙
  closeBluetoothAdapter() {
    wx.closeBluetoothAdapter()
    wx.clearStorageSync('checkedId')
    this.setData({
      connected: false,
      searching: false,
      trainning: false,
      total: 0,
      speedData: {
        speed: 0,
        distance: 0,
        turns: 0,
      }
    })
    this._discoveryStarted = false
    app.globalData.trainning = false
    app.globalData.machine = 'count'
    app.stopTimer(app.globalData.timer)
    app.stopTimer(app.globalData.clearTimer)
    app.updateUserSports()
  },
  onShareAppMessage: function () {
    return app.getShare();
  }
})
