// components/song-menu-area/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "默认歌单",
    },
    SongMenus: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    screenWidth: app.globalData.screenWidth,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleMenuItemClick(event) {
      const item = event.currentTarget.dataset.item;
      wx.navigateTo({
        url: `../../pages/more-songs/index?id=${item.id}&type=menu`,
      });
    },
  },
});
