// pages/detail-video/index.js
import {
  getMvURL,
  getMvDetail,
  getRelatedVideo,
} from "../../service/api_video";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mvURLInfo: {},
    mvDetail: {},
    mvRelated: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // options 保存的是页面跳转时传过来的参数
    // 获取 id
    const id = options.id;

    this.getPageData(id);
  },
  
  getPageData(id) {
    // 请求 mv 视频信息
    getMvURL(id).then((res) => {
      this.setData({ mvURLInfo: res.data });
    });

    // 请求 mv 详情
    getMvDetail(id).then((res) => {
      this.setData({ mvDetail: res.data });
    });

    // 请求 mv 相关视频
    getRelatedVideo(id).then((res) => {
      this.setData({ mvRelated: res.data });
    });
  },
});
