// index.js

// 获取应用实例
const app = getApp()
const currentActivaty = {
  text: "萨嘎月",
  selected: true,
  lessons: [
    {
      text: "莲师",
      selected: true,
      title: "莲花生大士心咒",
      subtitle: "每日需完成3000遍",
      tangCard: "../../data/lotus.jpg",
      apply: null,
      target: 3000
    }
    ,
    {
      text: "文殊",
      title: "文殊心咒",
      subtitle: "每日需完成10000遍",
      tangCard: "../../data/lotus.jpg",
      apply: null,
      target: 10000
    },
    {
      text: "马金",
      title: "马金鹏心咒",
      subtitle: "每日需完成100遍",
      tangCard: "../../data/lotus.jpg",
      apply: null,
      target: 100
    }
  ]
}
Page({
  data: {
    card: "../../data/lotus.jpg",
    activaties: [
      currentActivaty
      ,
      {
        text: "百日共修",
        lessons: [
          {
            text: "莲师",
            selected: true,
            title: "莲花生大士心咒",
            subtitle: "每日需完成3000遍",
            tangCard: "../../data/lotus.jpg",
            apply: null,
            target: 3000
          },
          {
            text: "普获悉地",
            title: "普获悉地祈祷文",
            subtitle: "每日需完成100遍",
            tangCard: "../../data/lotus.jpg",
            apply: null,
            target: 100
          },
          {
            text: "马金",
            title: "马金鹏心咒",
            subtitle: "每日需完成100遍",
            tangCard: "../../data/lotus.jpg",
            apply: null,
            target: 100
          }
        ]
      },
      {
        text: "日常",
        lessons: [
          {
            text: "观音",
            selected: true,
            title: "观音心咒",
            subtitle: "每日需完成2000遍",
            tangCard: "../../data/lotus.jpg",
            apply: null,
            target: 2000
          }
        ]
      }
    ],
    lessons: currentActivaty.lessons,
    tools: [
      {
        text: "报数",
        img: "toApply",
        current: "1"
      },
      {
        text: "统计",
        img: "toStatus"
      },
      {
        text: "我的",
        img: "toMine"
      }
    ],
    currentActivaty: currentActivaty,
    currentLesson: currentActivaty.lessons[0],
    apply: currentActivaty.lessons[0].apply,
    focusOnApply: false,
  },
  onLoad: function(options) {
    this.selectFromActivaties({currentTarget: {dataset: {tosel: currentActivaty}}})
  },
  selectFromActivaties: function (event) {
    var {tosel} = event.currentTarget.dataset
    var coll = this.data.activaties
    var currentActivaty, lessons, currentLesson, apply
    coll = coll.map(element => {
      if (element.selected) element.selected = undefined
      if (element.text == tosel.text) {
        currentActivaty = element
        currentActivaty.selected = true
        lessons = currentActivaty.lessons
        currentLesson = lessons.find(item => {
          return item.selected
        })
        if (!currentLesson) currentLesson = lessons[0]
        currentLesson.selected = true
        apply = currentLesson.apply
      }
      return element
    });
    var obj = {activaties: coll, currentActivaty, lessons, currentLesson, apply}
    this.setData(obj)
  },
  selectFromLessons: function (event) {
    var {tosel} = event.currentTarget.dataset
    var coll = this.data.lessons
    var currentActivaty = this.data.currentActivaty
    var currentLesson, apply
    coll = coll.map(element => {
      if (element.selected) element.selected = undefined
      if (element.text == tosel.text) {
        element.selected = true
        currentLesson = element
        apply = currentLesson.apply
      }
      return element
    });
    currentActivaty.lessons = coll
    var obj = {currentActivaty, lessons: coll, currentLesson, apply}
    this.setData(obj)
  },
  selectApply: function (event) {
    var focusOnApply = !this.data.focusOnApply
    this.setData({focusOnApply})
  },
  submitApply: function (event) {
    var currentLesson = this.data.currentLesson
    currentLesson.apply = this.data.apply
    this.setData({currentLesson})
  }
})