const app = getApp();
Component({
  properties: {
    reportsRankHref:String
  },
  data: {
    userList:[]
  },
  lifetimes: {
    created: function () {
      console.info("页面创建");
    },
    attached: function () {
      console.info("页面加载");
      this.getRankingList()
    },
    detached: function () {
      console.info("页面卸载");
    },
  },
  methods: {
    getRankingList:function(){
      var token = app.checkLogin()
      if(token == null || token == ""){
        return;
      }
      var that = this
      wx.request({
        url: this.properties.reportsRankHref,
        header:{
          "authorization":"Bearer " + token
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
                var times = res.data.Report.times;
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
    },
    toShowTrends: function (event) {
      wx.navigateBack({
        url: "../trends/trends"
      })
    },
  },
});
