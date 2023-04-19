// app.js
App({
  onLaunch() {
  },
  globalData: {
    indexHref:"https://wx.mygdh.top/index",
    loginHref:"https://wx.mygdh.top/auth/login",
    pageName:""
  },
  checkLogin:function(){
    var token = wx.getStorageSync("token");
    if(token == null || token == "" || token == "undefined"){
      console.log("到这边来1");
      this.getLoginInfo()
    }else{
      console.log("到这边来2");
      return token
    }
  },
  getLoginInfo: function () {
    var that = this
    wx.login({
      success: res =>{
        wx.request({
          url: this.globalData.loginHref,
          method:"post",
          data:{"code":res.code},
          success:function(res){
            wx.setStorageSync("token",res.data.token);
            that.globalData.pageName.onShow()
          }
        })
      }
    })
  }
})
