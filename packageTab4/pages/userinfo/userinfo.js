const app = getApp();
Component({
  properties: {
    myInfoHref:String
  },
  data: {
    isShowNameSet:false,
    currentWord: 0,
    pic:"",
    upPicUrl:"",
    userName:"",
    inputTemp:"",
    myInfo:{},
    region: [],
    windowWidth:'',
    windowHeight:''
  },
  lifetimes: {
    created: function () {
      console.info("页面创建");
    },
    attached: function () {
      var that = this
      wx.getSystemInfo({
        success: function(res) {
          that.setData({
            "windowWidth": res.windowWidth, //可使用窗口宽度，单位px
            "windowHeight": res.windowHeight, //可使用窗口高度，单位px
          })
        },
      })
      console.info("页面加载");
      this.getMyInfo()
    },
    detached: function () {
      console.info("页面卸载");
    },
  },
  methods: {
    getMyInfo:function(){
      var token = app.checkLogin()
      if(token == null || token == ""){
        return;
      }
      var that = this
      wx.request({
        url: this.properties.myInfoHref,
        header:{
          "authorization":"Bearer " + token,
          "Cache-Control":"no-cache"
        },
        data:{},
        success:function(res){
          let upPicUrl = ""
          for(var i=0;i<res.data.links.length;i++){
            if("avatar" == res.data.links[i].rel){
              upPicUrl = res.data.links[i].href
            }
          }
          let myInfo = res.data.MyInfo
          let region = that.data.region
          region[0] = myInfo.prov
          region[1] = myInfo.city
          region[2] = myInfo.district
          that.setData({
            region:region,
            pic:myInfo.pic,
            upPicUrl:upPicUrl,
            myInfo:myInfo,
            userName:myInfo.name
          })
        }
      })
    },
    chooseImage: function () {
      var that = this;
      wx.chooseMedia({
        count: 1, // 默认9
        mediaType: ['image'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePath = res.tempFiles[0].tempFilePath;
          var token = app.checkLogin()
          if(token == null || token == ""){
            return;
          }
          wx.uploadFile({
            url: that.data.upPicUrl, //此处换上你的接口地址
            filePath: tempFilePath,
            name: 'img',
            header: {
              "Content-Type": "multipart/form-data",
              'accept': 'application/json',
              "authorization":"Bearer " + token
            },
            formData: {},
            success: function (res) {
              wx.showToast({
                title: '头像保存成功',
                icon: 'success',
                duratio:2000,
                mask:true,
                success: function () {
                  setTimeout(function () {
                    that.getMyInfo()
                  }, 1000) //延迟时间
                }
              })
            },
            fail: function (res) {
              console.log('fail');
            },
          })
        }
      })
    },
    toShowMine: function (event) {
      wx.switchTab({
        url: "/pages/mine/mine"
      })
    },
    showNameSet: function (event) {
      this.setData({
        isShowNameSet:true,
        currentWord: 0,
        inputTemp:this.data.userName
      })
    },
    closeNameSet: function (event) {
      this.setData({
        isShowNameSet:false
      })
    },
    submitNameSet: function (event) {
      var that = this;
      this.setData({
        isShowNameSet:false
      })
      that.setData({
        userName:this.data.inputTemp
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
    getUserAddress:function(e){
      this.setData({
        region: e.detail.value
      })
    },
    saveUserInfo:function(e){
      var token = app.checkLogin()
      if(token == null || token == ""){
        return;
      }
      let name = this.data.userName;
      let region = this.data.region
      wx.request({
        url: this.properties.myInfoHref,
        header:{
          "authorization":"Bearer " + token,
          "if-match":this.data.myInfo.__v
        },
        method:"put",
        data:{
          name:name,
          prov:region[0],
          city:region[1],
          district:region[2],
          __v:this.data.myInfo.__v
        },
        success:function(res){
          console.log(res)
          if('412' == res.statusCode){
            wx.showToast({
              title: '保存信息失败',
              icon: 'error',
              duratio:2000,
              mask:true,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  this.getMyInfo()
                }, 1500) //延迟时间
              }
            })
          }else{
            wx.showToast({
              title: '保存信息成功',
              icon: 'success',
              duratio:2000,
              mask:true,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  wx.reLaunch({
                    url: "/pages/mine/mine"
                  })
                }, 1500) //延迟时间
              }
            })
          }
        }
      })
    }
  },
});
