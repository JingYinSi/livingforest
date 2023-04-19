const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lessonInstances:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.showShareMenu({//具体详见文档
      menus: ['shareAppMessage', 'shareTimeline'],
      success(res) {},
      fail(e) {}
    })  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.pageName = this
    this.getLessonList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onShow()
    setTimeout(function () {
      // 不加这个方法真机下拉会一直处于刷新状态，无法复位
      wx.stopPullDownRefresh()
    },2000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '功课广场',
      desc: '功课广场',
      path: '/pages/square/square'
    }
  },
  onShareTimeline() {
		return {
      title: '功课广场'
	  }
  },
  
  getLessonList:function(){
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
          if("currentLessonInstances" == res.data.links[i].rel){
            wx.request({
              url: res.data.links[i].href,
              header:{
                "authorization":"Bearer " + token,
                "Cache-Control":"no-cache"
              },
              data:{},
              success:function(res){
                let lessonInstances = res.data.collection.items;
                that.setData({
                  lessonInstances:lessonInstances
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
                      let lessonInstance = res.data.LessonInstance
                      lessonInstance.href = res.data.href
                      for(var j=0;j<res.data.links.length;j++){
                        if("lesson" == res.data.links[j].rel){
                          wx.request({
                            url: res.data.links[j].href,
                            header:{
                              "authorization":"Bearer " + token,
                              "Cache-Control":"no-cache"
                            },
                            data:{},
                            success:function(res){
                              lessonInstance.lesson = res.data.Lesson
                              let lessonInstances  = that.data.lessonInstances;
                              lessonInstances[i] = lessonInstance
                              that.setData({
                                lessonInstances:lessonInstances
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
  showTrendsItem: function (event) {
    var index = event.currentTarget.dataset.index;
    var href = this.data.lessonInstances[index].href
    wx.navigateTo({
      url: "/packageTab2/pages/trends/trends?currentLessonHref="+href
    })
  }
});
