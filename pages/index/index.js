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
  selectFromCollection: function (event) {
    var {collname, tosel} = event.currentTarget.dataset
    var coll = this.data[collname]
    coll = coll.map(element => {
      if (element.selected) element.selected = undefined
      if (element.text == tosel.text) element.selected = true
      return element
    });
    var obj = {}
    obj[collname] = coll
    this.setData(obj)
  }
})