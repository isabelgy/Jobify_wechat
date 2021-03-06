var app = getApp()
Page({
  data: {
    my_jobs: [],
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    dataLoaded: false
  },
  onLoad: function () {
    const page = this
    const user = wx.getStorageSync('user')
    let data = { id: user.id }

    wx.request({
      url: `https://jobify.wogengapp.cn/api/v1/users/${user.id}`,
      // url: `http://localhost:3000/api/v1/users/${user.id}`,
      method: 'POST',
      data: data,
      success: function (res) {
      console.log(res)
      page.setData({ my_jobs: res.data, dataLoaded: true })
      // console.log(page.data.my_jobs)
      for (var i = 0; i < page.data.my_jobs.length; i++) {
        page.data.items.push({
          job_id: page.data.my_jobs[i].id,
          job_title: page.data.my_jobs[i].title,
          company_name: page.data.my_jobs[i].company,
          image: page.data.my_jobs[i].image,
          isTouchMove: false //默认全隐藏删除
        })
      }
      page.setData({items: page.data.items})
      console.log(page.data.items)
      }
       })



        

  /**
   * 生命周期函数--监听页面加载
   */

  },

  createJob: function (e) {
    wx.navigateTo({
      url: '/pages/addjob/addjob',
    })
  },

  touchstart: function (e) {
    const page = this
    //开始触摸时 重置所有删除
    page.data.items.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    page.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: page.data.items
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    console.log(e)
    const page = this
    const user = wx.getStorageSync('user')
    const index = e.currentTarget.dataset.index
    const id = e.currentTarget.dataset.id
    page.data.items.splice(e.currentTarget.dataset.index, 1)
    page.setData({
      items: page.data.items
    })

    // const data = { user_id: user.id, i: index }
    wx.request({
      url: `https://jobify.wogengapp.cn/api/v1/jobs/${id}`,
      // url: `http://localhost:3000/api/v1/jobs/${id}`,
      method: 'DELETE',
      // data: data,

      success: function (res) {
        console.log(res)
      }

    })
  },

  click: function(e){
    console.log(e.currentTarget.dataset.id)
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/singlejob/singlejob?id=${id}`,
    })
      }
 



}, )