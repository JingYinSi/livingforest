// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    banner: '../../imgs/gongxiu.jpg',
    list: {
      img: '../../imgs/gongke_logo.png',
      items: [
        {
          text: "马金鹏三尊心咒",
          desc: "开始30天 300人 共修3219399494遍"
        },
        {
          text: "普获悉地祈祷文",
          desc: "开始30天 300人 共修3219399494遍"
        },
        {
          text: "莲花生大士师心咒",
          desc: "开始30天 300人 共修3219399494678904555遍"
        }
      ]
    }
  },
  imageError: function(e) {
    console.log('image3发生error事件，携带值为', e.detail.errMsg)
  }
})