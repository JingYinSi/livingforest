const app = getApp();
Component({
  properties: {
    currentLessonHref:String
  },
  data: {
    currentLesson:{},
    userList:[]
  },
  lifetimes: {
    created: function () {
      console.info("页面创建");
    },
    attached: function () {
      console.info("页面加载");
      this.getLessonInfo()
    },
    detached: function () {
      console.info("页面卸载");
    },
  },
  methods: {
    getLessonInfo:function(){
      var token = app.checkLogin()
      if(token == null || token == ""){
        return;
      }
      var that = this
      wx.request({
        url: this.properties.currentLessonHref,
        header:{
          "authorization":"Bearer " + token,
          "Cache-Control":"no-cache"
        },
        data:{},
        success:function(res){
          let lessonInstance = res.data.LessonInstance
          for(var i=0;i<res.data.links.length;i++){
            if("reportsRank" == res.data.links[i].rel){
              lessonInstance.reportsRankHref = res.data.links[i].href
              that.setData({
                currentLesson:lessonInstance
              })
            }
            if("lesson" == res.data.links[i].rel){
              wx.request({
                url: res.data.links[i].href,
                header:{
                  "authorization":"Bearer " + token,
                  "cache-control":"no-cache"
                },
                data:{},
                success:function(res){
                  lessonInstance.name = res.data.Lesson.name
                  that.setData({
                    currentLesson:lessonInstance
                  })
                }
              })
            }
            if("reports" == res.data.links[i].rel){
              wx.request({
                url: res.data.links[i].href,
                header:{
                  "authorization":"Bearer " + token,
                  "Cache-Control":"no-cache"
                },
                data:{},
                success:function(res){
                  let userList = res.data.collection.items;
                  that.setData({
                    userList:userList
                  })
                  for(let i=0;i<res.data.collection.items.length;i++){
                    wx.request({
                      url: res.data.collection.items[i].link.href,
                      header:{
                        "authorization":"Bearer " + token,
                        "cache-control":"no-cache"
                      },
                      data:{},
                      success:function(res){ 
                        var times = res.data.Report.times
                        for(var j=0;j<res.data.links.length;j++){
                          if("user" == res.data.links[j].rel){
                            wx.request({
                              url: res.data.links[j].href,
                              header:{
                                "authorization":"Bearer " + token,
                                "cache-control":"no-cache"
                              },
                              data:{},
                              success:function(res){
                                let userList = that.data.userList
                                let user = res.data.User
                                user.times = times
                                userList[i] = user
                                that.setData({
                                  userList:userList
                                })
                              }
                            })
                          }
                        }
                      }
                    })
                  }
                }
              })
            }
          }
        }
      })
    },
    showRanking: function (event) {
      wx.navigateTo({
        url: "../ranking/ranking?reportsRankHref="+this.data.currentLesson.reportsRankHref
      })
    },
    toShowSquare: function (event) {
      wx.switchTab({
        url: "/pages/square/square"
      })
    }
  },
});
