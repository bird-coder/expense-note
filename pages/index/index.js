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
    isBack: false
  },
  startTrainning: function() {
    console.log('训练开始')
    // wx.navigateTo({
    //   url: '../machine/index',
    // })
    if (this.data.trainning) this.setData({trainning: false})
    else this.setData({ trainning: true })
  },
  increaseCount: function(num) {
    let type = parseInt(num.substr(0, 2), 16)
    let value = parseInt(num.substr(2), 16)
    //大端转小端
    value = ('0000' + ((value << 8) | (value >> 8)).toString(16)).slice(-4)
    let count = parseInt(value)
    switch(type){
      case 0x01: 
        console.log("踏步机计数");break;
      case 0x02: 
        console.log("健身自行车");break;
      case 0x03: 
        console.log("卧推器材");break;
      default: console.log("器材类型错误"); return
    }
    if (this.data.trainning) this.setData({ total: this.data.total + count })
  },
  onLoad: function () {
    
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
    const checkedId = wx.getStorageSync('checkedId') || null
    console.log(checkedId);
    if (checkedId && this.data.isBack) {
      this.setData({ 
        connected: true,
        trainning: true,
        deviceId: checkedId,
        isBack: false
      })
      this.stopBluetoothDevicesDiscovery()
      this.getBLEDeviceServices(checkedId)
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
              that.startBluetoothDevicesDiscovery()
            }
          })
        }
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
      total: 0
    })
    this._discoveryStarted = false
  },
  onShareAppMessage: function () {
    return app.getShare();
  }
})
