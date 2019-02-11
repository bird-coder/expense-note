const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const getTimeStamp = () => {
  let timestamp = Date.parse(new Date())
  return timestamp/1000
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const max = (n1, n2) => {
  return Math.max(n1, n2)
}

const len = arr => {
  arr = arr || []
  return arr.length
}

const inArray = (arr, key, val) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

const ab2hex = (buffer) => {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

const decodeBuffer = (buffer) => {
  let view = new Uint8Array(buffer)
  let index = 0
  let offset = 0
  let arr = []
  while(offset in view){
    let len = parseInt(view[offset].toString(16))
    index++
    if (index > 3) {
      let a = view[offset + 1]
      let b = view.slice(offset + 2, offset + 2 + len)
      arr.push({ 'type': a.toString(16), 'value': b.map(int2hex).join('') })
    }
    offset += len + 2
  }
  return arr
}

const checkDevice = (data) => {
  if (!(0 in data) || !(1 in data)) return false
  const res = {'name': '', 'mine': false}
  if (data[0]['type'] == 0x03) {
    switch (data[0]['value']){
      case 0x00ff: res.name = '踏步机';break;
    }
  }
  if (data[1]['type'] == 0xff && data[1]['value'] == 0xaa5502) res.mine = true
  return res
}

const checkSign = (a3, a4, a5, a6) => {
  const key = 0x27
  let sign = (a3 ^ key).toString(16) + (a3 ^ key & a4).toString(16) + (a4 ^ key).toString(16) + (a4 ^ key & a5).toString(16) + (a5 ^ key).toString(16) + (a5 ^ key & a6).toString(16) + (a6 ^ key).toString(16) + (a6 ^ key & a4).toString(16)
  return sign
}

const int2hex = function(num){
  return ('00' + num.toString(16)).slice(-2)
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  getTimeStamp: getTimeStamp,
  max: max,
  len: len,
  inArray: inArray,
  ab2hex: ab2hex,
  checkSign: checkSign,
  decodeBuffer: decodeBuffer,
  checkDevice: checkDevice
}
