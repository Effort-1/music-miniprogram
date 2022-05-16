// pages/home-video/index.js
import { getTopMvs } from "../../service/api_video";
import { playStore } from "../../store/player-store";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    topMvs: [],
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    /* getTopMvs(0).then(res=>{
      console.log(res.data.data);
      this.setData({topMvs:res.data})
    }) */

    /* const { data } = await getTopMvs(0, 20);
    this.setData({ topMvs: data }); */

    this.getTopMvsData(0, 20);
  },

  // 封装网络请求的方法
  async getTopMvsData(offset, limit = 10) {
    // 判断是否可以请求
    if (!this.data.hasMore) return;

    // 展示加载动画
    wx.showNavigationBarLoading();

    // 请求数据
    const { data, hasMore } = await getTopMvs(offset, limit);
    let newData = this.data.topMvs;
    if (offset === 0) {
      newData = data;
    } else {
      newData = this.data.topMvs.concat(data);
    }
    // 保存数据
    this.setData({ topMvs: newData });
    this.setData({ hasMore: hasMore });

    // 隐藏加载动画
    wx.hideNavigationBarLoading();

    // 隐藏下拉加载动画
    if (offset === 0) {
      wx.stopPullDownRefresh();
    }
  },

  // 处理事件
  handleVideoItemClick(event) {
    const id = event.currentTarget.dataset.item.id;
    console.log(id);
    // 进行页面跳转
    wx.navigateTo({
      // 条转到的页面
      url: `../detail-video/index?id=${id}`,
    });

    // 如果有其他歌曲在播放将其关闭
    playStore.dispatch("changeMusicPlayStatusAction", false);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // 下拉刷新
  async onPullDownRefresh() {
    // 下拉刷新就是发送第一次请求
    /*  const { data } = await getTopMvs(0);
    this.setData({ topMvs: data });
    wx.stopPullDownRefresh(); */

    this.getTopMvsData(0, 20);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // 上拉加载
  async onReachBottom() {
    /*  // 被请求的数据是有限的,所以我们在发送请求前需要判断是否还有数据,如果没有数据则返回
    if (!this.data.hasMore) return;
    //上拉请求更多数据
    const { data, hasMore } = await getTopMvs(this.data.topMvs.length);
    // 将新增数据追加到原来数据之后(不是覆盖原来的数据)
    this.setData({ topMvs: this.data.topMvs.concat(data) });
    // 将最新的hasMore保存
    this.setData({ hasMore: hasMore }); */

    this.getTopMvsData(this.data.topMvs.length);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
