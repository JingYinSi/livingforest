const app = getApp();
Component({
  properties: {},
  data: {
    recommendList:[]
  },
  lifetimes: {
    created: function () {
      console.info("页面创建");
    },
    attached: function () {
      console.info("页面加载");
      this.getRecommendList()
    },
    detached: function () {
      console.info("页面卸载");
    },
  },
  methods: {
    getRecommendList:function(){
      var token = app.checkLogin()
      if(token == null || token == ""){
        return;
      }
      var that = this
      wx.request({
        url: app.globalData.indexHref,
        header:{
          "authorization":"Bearer " + token
        },
        data:{},
        success:function(res){
          for(var i=0;i<res.data.links.length;i++){
            if("currentRecommends" == res.data.links[i].rel){
              wx.request({
                url: res.data.links[i].href,
                header:{
                  "authorization":"Bearer " + token
                },
                data:{},
                success:function(res){
                  for(var i=0;i<res.data.collection.items.length;i++){
                    wx.request({
                      url: res.data.collection.items[i].link.href,
                      header:{
                        "authorization":"Bearer " + token
                      },
                      data:{},
                      success:function(res){
                        let recommendList = that.data.recommendList
                        recommendList.push(res.data.Recommend)
                        that.setData({
                          recommendList:recommendList
                        })
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
    showIndex: function (event) {
      wx.switchTab({
        url: "/pages/index/index"
      })
    },
    showRecommends: function (event) {
      let currentUrl = event.currentTarget.dataset.src
      let currentTitle = event.currentTarget.dataset.title
      wx.navigateTo({
        url: '/packageTab1/pages/recommendout/recommendout?link='+encodeURIComponent(currentUrl)+'&title=' +currentTitle
      })
    }
  },
});
