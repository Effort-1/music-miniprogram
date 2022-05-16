// components/song-item-v1/index.js
import { playStore } from "../../store/player-store";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {},
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemClick(event) {
      // 可以直接获取properties的属性,这样就不用使用event传值
      const id = this.properties.item.id;
      wx.navigateTo({
        url: "../../pages/music-player/index?id=" + id,
      });

      // 请求播放页相关数据请求
      playStore.dispatch("playMusicWithSongIdAction", { id });
    },
  },
});
