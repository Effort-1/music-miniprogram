import { rankingStore, playStore } from "../../store/index";
import { getMenuSongsDetail } from "../../service/api_music";
Page({
  data: {
    type: "",
    rankingName: "",
    songsInfo: {},
  },
  onLoad(options) {
    const type = options.type;
    this.setData({ type });
    console.log(this.data.type);
    if (type === "menu") {
      const id = options.id;
      getMenuSongsDetail(id).then((res) => {
        this.setData({ songsInfo: res.playlist });
      });
    } else if (type === "rank") {
      const rankingName = options.ranking;
      this.setData({ rankingName });
      // 触发回调拿到 rankingName(hotRanking) 所对应的数据
      rankingStore.onState(rankingName, this.getRankingDataHandler);
    }
  },
  onUnload() {
    if (this.data.ranking) {
      rankingStore.offState(this.data.rankingName, this.getRankingDataHandler);
    }
  },
  getRankingDataHandler(res) {
    console.log(res);
    this.setData({ songsInfo: res });
  },

  // 点击列表歌曲将歌曲所在列表歌曲数据和索引保存
  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index;
    playStore.setState("playListSongs", this.data.songsInfo.tracks);
    playStore.setState("playListIndex", index);
  },
});
