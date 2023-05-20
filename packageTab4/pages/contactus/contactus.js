Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth:'',
    windowHeight:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {title} = options;
    wx.setNavigationBarTitle({
      title
    })

    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          "windowWidth": res.windowWidth, //可使用窗口宽度，单位px
          "windowHeight": res.windowHeight, //可使用窗口高度，单位px
        })
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
  toShowMine: function (event) {
    wx.switchTab({
      url: "/pages/mine/mine"
    })
  }
});
