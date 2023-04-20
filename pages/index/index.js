const app = getApp();
Page({
  data: {
    isShowApply:false,
    isShowHui:false,
    isShowDesc:false,
    selctIndex:0,
    currentLessonIns:{},
    applyCount:"",
    prayerText:"",
    lessonInstances:[],
    windowWidth:'',
    windowHeight:''
  },
  onLoad: function() {
    var that = this
    wx.showShareMenu({//具体详见文档
      menus: ['shareAppMessage', 'shareTimeline'],
      success(res) {},
      fail(e) {}
    }),
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          "windowWidth": res.windowWidth, //可使用窗口宽度，单位px
          "windowHeight": res.windowHeight, //可使用窗口高度，单位px
        })
      },
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
      title: '报数',
      desc: '报数',
      path: '/pages/index/index'
    }
  },
  onShareTimeline() {
		return {
      title: '报数'
	  }
	},
  inputCom: function (event) {
    let applyCount = event.detail.value
    if(!(/^(-?[1-9]\d*|-)$/.test(applyCount))){
      wx.showToast({
        title: '请输入正确的数字',
        icon: 'none'
      })
      applyCount =  applyCount.substring(0,applyCount-1);
    }
    this.setData({
      applyCount:applyCount
    })
    return applyCount
  },
  showItem:function(event){
    var that = this
    var index = event.currentTarget.dataset.index;
    that.setData({
      selctIndex:index,
      currentLessonIns:that.data.lessonInstances[index],
      applyCount:that.data.lessonInstances[index].target
    })
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
        "authorization":"Bearer " + token,
        "Cache-Control":"no-cache"
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
                      let lessonInstance = res.data.LessonInstance;
                      let reportHref = "";
                      for(var j=0;j<res.data.links.length;j++){
                        if("report" == res.data.links[j].rel){
                          reportHref = res.data.links[j].href;
                        }
                      }
                      lessonInstance.reportHref = reportHref;
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
                              if(i == 0){
                                that.setData({
                                  selctIndex:0,
                                  currentLessonIns:that.data.lessonInstances[0],
                                  applyCount:that.data.lessonInstances[0].target
                                })
                              }
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
    this.getMyInfo();
  },
  getMyInfo:function(){
    var token = app.checkLogin()
    if(token == null || token == ""){
      return;
    }
    var that = this
    wx.request({
      url: app.globalData.indexHref,
      header:{
        "authorization":"Bearer " + token,
        "Cache-Control":"no-cache"
      },
      data:{},
      success:function(res){
        for(var i=0;i<res.data.links.length;i++){
          if("myInfos" == res.data.links[i].rel){
            wx.request({
              url: res.data.links[i].href,
              header:{
                "authorization":"Bearer " + token,
                "Cache-Control":"no-cache"
              },
              data:{},
              success:function(res){
                wx.request({
                  url: res.data.collection.items[0].link.href,
                  header:{
                    "authorization":"Bearer " + token,
                    "Cache-Control":"no-cache"
                  },
                  data:{},
                  success:function(res){
                    that.setData({
                      prayerText:res.data.MyInfo.prayerText
                    })
                  }
                })
              }
            })
          }
        }
      }
    })
  },
  showRecommend: function (event) {
    wx.navigateTo({
      url: '/packageTab1/pages/recommend/recommend'
    })
  },
  showApply: function (event) {
    this.setData({
      isShowApply:true
    })
  },
  closeApply: function (event) {
    this.setData({
      isShowApply:false
    })
  },
  submitApply: function (event) {
    var that = this
    let times = that.data.applyCount;
    if(times == "-"){
      wx.showToast({
        title: '请输入正确的数字',
        icon: 'none'
      })
      return;
    }
    var token = app.checkLogin()
    if(token == null || token == ""){
      return;
    }
    
    var href = event.currentTarget.dataset.href;
    wx.request({
      url: href,
      header:{
        "authorization":"Bearer " + token
      },
      method:"post",
      data:{"times":that.data.applyCount},
      success:function(res){
        that.setData({
          isShowApply:false,
          isShowHui:true
        })
        setTimeout(function(){
          that.setData({
            isShowApply:false,
            isShowHui:false,
          })
        },6000)
      }
    })
  },
  closeHui: function (event) {
    this.setData({
      isShowHui:false
    })
  },
  showDesc: function (event) {
    this.setData({
      isShowDesc:true
    })
  },
  closeDesc:function (event) {
    this.setData({
      isShowDesc:false
    })
  }
});