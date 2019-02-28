// pages/machine/index.js
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    devices: [],
    connected: false,
    chs: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("寻找到新设备")
    // this.setData({
    //   devices: [
    //     {'name': 'aaa', 'deviceId': '111'},
    //     { 'name': 'bbb', 'deviceId': '222' },
    //     { 'name': 'ccc', 'deviceId': '333' },
    //   ]
    // })
    this.onBluetoothDeviceFound()
  },
  //监听寻找到新设备的事件
  onBluetoothDeviceFound() {
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          return
        }
        if (!device.advertisData) return
        let deviceData = utils.ab2hex(device.advertisData)
        console.log(deviceData)
        if (deviceData.slice(0, 4) !== 'aa55') return
        let deviceName = deviceData.slice(4)
        switch (deviceName){
          case '020101': device.name = '健腹机';break;
        }
        const foundDevices = this.data.devices
        const idx = utils.inArray(foundDevices, 'deviceId', device.deviceId)
        const data = {}
        if (idx === -1) {
          data[`devices[${foundDevices.length}]`] = device
        } else {
          data[`devices[${idx}]`] = device
        }
        this.setData(data)
      })
    })
  },
  //连接低功耗蓝牙设备
  createBLEConnection(e) {
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId
    const name = ds.name
    let that = this
    wx.createBLEConnection({
      deviceId,
      success: (res) => {
        this.setData({
          connected: true,
          name,
          deviceId,
        })
        this.connectCallback(deviceId)
      },
      fail: function() {
        wx.showToast({
          title: '连接失败',
          image: '../../images/ad_close.png',
          duration: 2000
        })
      }
    })
    //this.stopBluetoothDevicesDiscovery()
  },
  connectCallback(deviceId) {
    wx.showToast({
      title: '连接成功',
      duration: 2000,
      success: function () {
        wx.setStorage({
          key: 'checkedId',
          data: deviceId,
          success: function () {
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]
            prevPage.setData({isBack: true})
            wx.navigateBack({
              delta: 1,
            })
          }
        })
      }
    })
  },
  //断开蓝牙连接
  closeBLEConnection() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId
    })
    this.setData({
      connected: false,
      chs: [],
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