const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myInfo:{},
    myInfoHref:"",
    isShowHuiSet:false,
    isShowIdeaSet:false,
    isShowContactUs:false,
    currentWord: 0,
    prayerTextHref:"",
    ideaHref:"",
    inputTemp:"",
    windowWidth:'',
    windowHeight:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          "windowWidth": res.windowWidth, //可使用窗口宽度，单位px
          "windowHeight": res.windowHeight, //可使用窗口高度，单位px
        })
        console.log(res.windowWidth, that.data.windowWidth);
        console.log(res.windowHeight, that.data.windowHeight);
      }
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
    this.getMyInfo();
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
          if("suggest" == res.data.links[i].rel){
            that.setData({
              ideaHref:res.data.links[i].href
            })
          }
          if("myInfos" == res.data.links[i].rel){
            wx.request({
              url: res.data.links[i].href,
              header:{
                "authorization":"Bearer " + token,
                "Cache-Control":"no-cache"
              },
              data:{},
              success:function(res){
                let myInfoHref = res.data.collection.items[0].link.href
                wx.request({
                  url: res.data.collection.items[0].link.href,
                  header:{
                    "authorization":"Bearer " + token,
                    "Cache-Control":"no-cache"
                  },
                  data:{},
                  success:function(res){
                    let prayerTextHref = ""
                    for(var i=0;i<res.data.links.length;i++){
                      if("prayerText" == res.data.links[i].rel){
                        prayerTextHref = res.data.links[i].href
                      }
                    }
                    that.setData({
                      myInfo:res.data.MyInfo,
                      myInfoHref:myInfoHref,
                      prayerTextHref:prayerTextHref
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
  showGuide: function (event) {
    wx.navigateTo({
      url: '/packageTab4/pages/guide/guide'
    })
  },
  showHuiSet: function (event) {
    let prayerText = this.data.myInfo.prayerText
    this.setData({
      isShowHuiSet:true,
      currentWord: 0,
      inputTemp: prayerText?prayerText:""
    })
  },
  closeHuiSet: function (event) {
    this.setData({
      isShowHuiSet:false
    })
  },
  submitHuiSet: function (event) {
    var that = this
    var token = app.checkLogin()
    if(token == null || token == ""){
      return;
    }
    wx.request({
      url: this.data.prayerTextHref,
      header:{
        "authorization":"Bearer " + token
      },
      method:"PUT",
      data:{
        prayerText:this.data.inputTemp
      },
      success:function(res){
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duratio:1000,
          mask:true,
          success: function () {
            setTimeout(function () {
              that.setData({
                isShowHuiSet:false
              })
            }, 1000) //延迟时间
          }
        })
      }
    })
  },
  showIdeaSet: function (event) {
    this.setData({
      isShowIdeaSet:true,
      currentWord: 0
    })
  },
  closeIdeaSet: function (event) {
    this.setData({
      isShowIdeaSet:false
    })
  },
  submitIdeaSet: function (event) {
    var that = this
    var token = app.checkLogin()
    if(token == null || token == ""){
      return;
    }
    wx.request({
      url: this.data.ideaHref,
      header:{
        "authorization":"Bearer " + token
      },
      method:"POST",
      data:{
        text:this.data.inputTemp
      },
      success:function(res){
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duratio:1000,
          mask:true,
          success: function () {
            setTimeout(function () {
              that.setData({
                isShowIdeaSet:false
              })
            }, 1000) //延迟时间
          }
        })
      }
    })
  },
  limitWord:function(e){    
    var that = this;
    var value = e.detail.value;   
    var wordLength = parseInt(value.length); 
    if (that.data.maxWord < wordLength) {
      return ;
    }
    that.setData({
      currentWord: wordLength,
      inputTemp:value
    });
  },
  toShowUserinfo: function (event) {
    wx.navigateTo({
      url: '/packageTab4/pages/userinfo/userinfo?myInfoHref=' + this.data.myInfoHref
    })
  },
  showContactUs: function (event) {
    this.setData({
      isShowContactUs:true
    })
  },
  closeContactUs: function (event) {
    this.setData({
      isShowContactUs:false
    })
  },
});
