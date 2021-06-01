// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    upPic: "../../imgs/上部.png",
    activaties: {
      items: [
        {
          text: "萨嘎月",
          selected: true
        },
        {
          text: "日常"
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