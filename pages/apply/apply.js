// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    activaties: {
      items: [
        {
          text: "萨嘎月",
          selected: true
        },
        {
          text: "日常功课"
        },
        {
          text: "共修"
        }
      ]
    }
  },
  imageError: function(e) {
    console.log('image3发生error事件，携带值为', e.detail.errMsg)
  }
})