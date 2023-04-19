const app = getApp();
Component({
  properties: {
    myLessonInsHref:String
  },
  data: {
    isShowTarget:false,
    myLessonIns:{},
    applyLogList:[]
  },
  lifetimes: {
    created: function () {
      console.info("页面创建");
    },
    attached: function () {
      console.info("页面加载");
      this.getLessonList()
    },
    detached: function () {
      console.info("页面加载");
    },
  },
  methods: {
    getLessonList:function(){
      var token = app.checkLogin()
      if(token == null || token == ""){
        return;
      }
      var that = this
      let myLessonInsHref = this.properties.myLessonInsHref;
      wx.request({
        url: myLessonInsHref,
        header:{
          "authorization":"Bearer " + token
        },
        data:{},
        success:function(res){
          let myLessonIns = res.data.MyLessonIns
          for(var i=0;i<res.data.links.length;i++){
            if("myReports" == res.data.links[i].rel){
              wx.request({
                url: res.data.links[i].href,
                header:{
                  "authorization":"Bearer " + token,
                  "Cache-Control":"no-cache"
                },
                data:{},
                success:function(res){
                  let applyLogList = res.data.collection.items;
                  that.setData({
                    applyLogList:applyLogList
                  })
                  for(let i=0;i<res.data.collection.items.length;i++){
                    wx.request({
                      url: res.data.collection.items[i].link.href,
                      header:{
                        "authorization":"Bearer " + token,
                        "Cache-Control":"no-cache"
                      },
                      data:{},
                      success:function(res){
                        let applyLogList = that.data.applyLogList
                        applyLogList[i] = res.data.Report
                        that.setData({
                          applyLogList:applyLogList
                        })
                      }
                    })
                  }
                }
              })
            }

            if("lessonInstance" == res.data.links[i].rel){
              wx.request({
                url: res.data.links[i].href,
                header:{
                  "authorization":"Bearer " + token,
                  "Cache-Control":"no-cache"
                },
                data:{},
                success:function(res){
                  let totalTarget = res.data.LessonInstance.totalTarget
                  for(var i=0;i<res.data.links.length;i++){
                    if("lesson" == res.data.links[i].rel){
                      wx.request({
                        url: res.data.links[i].href,
                        header:{
                          "authorization":"Bearer " + token,
                          "Cache-Control":"no-cache"
                        },
                        data:{},
                        success:function(res){
                          myLessonIns.name = res.data.Lesson.name
                          myLessonIns.totalTarget = totalTarget
                          let prev 
                          if(totalTarget > 0 ){
                            prev = Math.floor((myLessonIns.totalTimes/myLessonIns.totalTarget)*100)
                            if(prev > 100){
                              prev = 100
                            }
                          }else{
                            prev = 100
                          }
                          myLessonIns.prev = prev
                          that.setData({
                            myLessonIns:myLessonIns
                          })
                        }
                      })
                    }
                  }
                }
              })
            }
          }
        }
      })
    },
    showTarget: function (event) {
      this.setData({
        isShowTarget:true
      })
    },
    closeTarget: function (event) {
      this.setData({
        isShowTarget:false
      })
    },
    submitTarget: function (event) {
      this.setData({
        isShowTarget:false
      })
    },
    toShowBook: function (event) {
      wx.switchTab({
        url: '/pages/book/book'
      })
    }
  },
});