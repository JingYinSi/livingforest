// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    card: "../../data/lotus.jpg",
    activaties: [
      {
        text: "萨嘎月",
        selected: true
      },
      {
        text: "百日共修"
      },
      {
        text: "日常"
      }
    ],
    lessons: [
      {
        text: "莲师",
        selected: true
      },
      {
        text: "文殊"
      },
      {
        text: "马金"
      }
    ],
    title: "莲花生大士心咒",
    subtitle: "每日需完成3000遍"
  },
  imageError: function(e) {
    console.log('image3发生error事件，携带值为', e.detail.errMsg)
  }
})