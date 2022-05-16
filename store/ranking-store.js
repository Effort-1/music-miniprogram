import { HYEventStore } from "hy-event-store";
import { getRankings } from "../service/api_music";

const rankingNameMap = {
  0: "newRanking",
  1: "hotRanking",
  2: "originRanking",
  3: "upRanking",
};
const rankingStore = new HYEventStore({
  state: {
    newRanking: {}, // 0 新歌榜
    hotRanking: {}, // 1 推荐歌曲
    originRanking: {}, // 2 原创榜1
    upRanking: {}, // 3 飙升榜
  },
  actions: {
    getRankingsDataAction(ctx, payload) {
      for (let i = 0; i < 4; i++) {
        // 0:新歌榜  1:热歌榜  2:原创榜  3:飙升榜
        getRankings(i).then((res) => {
          const rankingName = rankingNameMap[i];
          ctx[rankingName] = res.playlist;
          // console.log("rankingName: ", ctx[rankingName]);
          /*           switch(i) {
            case 0:
              console.log('0: ', res);
              break
            case 1:
              console.log('1: ', res);
              break
            case 2:
              console.log('2: ', res);
              break
            case 3:
              console.log('3: ', res);
              break
          } */
        });
      }
    },
  },
});

export { rankingStore, rankingNameMap };
