// pages/home-music/index.js
import { getBanners, getSongMenus } from "../../service/api_music";
// import { getUserInfo } from "../../service/api_login";
import { rankingStore, rankingNameMap, playStore } from "../../store/index";
import queryRect from "../../utils/query-rect";
import throttle from "../../utils/throttle";
// 节流函数
const throttleQueryRect = throttle(queryRect, 100, { trailing: true });

Page({
  /**
   * 页面的初始数据
   */
  data: {
    banners: [], // 轮播图
    swiperHeight: 0, // 动态设置的轮播组件高度
    recommendSongs: [], // 推荐歌曲
    hotSongMenus: [], // 热门歌单
    // 巅峰榜
    rankings: { 0: {}, 2: {}, 3: {} },
    // 当前播放音乐
    currentSong: {},
    // 播放状态
    isPlaying: false,
    // 旋转动画状态
    playAnimState: "paused",
  },

  onLoad: function (options) {
    // playerStore.dispatch("playMusicWithSongIdAction", { id: 1891469546 })

    this.getPageData();

    // 发起共享数据的请求
    rankingStore.dispatch("getRankingsDataAction");
    // 从store中获取共享数据
    this.setupPlayerStoreListener();
  },
  // 获取用户个人信息
  // async handleUserInfo() {
  //   const { userInfo } = await getUserInfo();
  //   console.log(userInfo);
  // },

  // 点击跳转到搜索页面
  handleSearchClick() {
    wx.navigateTo({
      url: "../detail-search/index",
    });
  },

  // 请求首页数据
  getPageData() {
    // 请求轮播图
    getBanners(2).then((res) => {
      this.setData({ banners: res.banners });
    });
    // 发起共享数据的请求
    rankingStore.dispatch("getRankingsDataAction");

    // 从 store 中获取共享的数据
    this.setupPlayerStoreListener();
    // 从store保存共享的数据(推荐歌曲的请求)
    rankingStore.onState("hotRanking", (res) => {
      if (!res.tracks) return;
      const recommendSongs = res.tracks.slice(0, 6);
      this.setData({ recommendSongs });
    });
    // 请求热门歌单
    getSongMenus().then((res) => {
      this.setData({ hotSongMenus: res.playlists });
    });
    // 请求推荐歌单
    getSongMenus("华语").then((res) => {
      this.setData({ recommendSongMenus: res.playlists });
    });
  },

  // 请求巅峰榜相关数据
  getRankingHandler(idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return;
      const name = res.name;
      const coverImgUrl = res.coverImgUrl;
      const playCount = res.playCount;
      const songList = res.tracks.slice(0, 3);
      const rankingObj = {
        name,
        coverImgUrl,
        playCount,
        songList,
      };
      const newRankings = {
        ...this.data.rankings,
        [idx]: rankingObj,
      };
      this.setData({
        rankings: newRankings,
      });
    };
  },

  // 点击更多跳转到详情页面
  handleRecommendMoreClick() {
    this.navigateToDetailSongsPage("hotRanking");
  },
  // 点击榜单跳转到详情页面
  handleRankingItemClick(event) {
    const idx = event.currentTarget.dataset.idx;
    const rankingName = rankingNameMap[idx];
    this.navigateToDetailSongsPage(rankingName);
  },
  navigateToDetailSongsPage(rankingName) {
    wx.navigateTo({
      url: `../more-songs/index?ranking=${rankingName}&type=rank`,
    });
  },

  // 处理轮播图兼容性
  handleSwiperImageLoaded() {
    throttleQueryRect().then((res) => {
      this.setData({ swiperHeight: res[0].height });
    });
  },

  // 点击列表歌曲将歌曲所在列表歌曲数据和索引保存
  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index;
    playStore.setState("playListSongs", this.data.recommendSongs);
    playStore.setState("playListIndex", index);
  },

  // 点击切换播放状态
  handlePlayBtnClick() {
    playStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying);
  },

  // 点击 playBar 跳转到播放详情页面
  handlePlayBarClick() {
    wx.navigateTo({
      url: "../music-player/index?id=" + this.data.currentSong.id,
    });
  },

  setupPlayerStoreListener() {
    // 取出hotRankings数据 对应显示在推荐歌曲中
    rankingStore.onState("hotRanking", (res) => {
      if (!res.tracks) return;
      const recommendSongs = res.tracks.slice(0, 6);
      this.setData({ recommendSongs });
    });

    rankingStore.onState("newRanking", this.getRankingHandler(0));
    rankingStore.onState("originRanking", this.getRankingHandler(2));
    rankingStore.onState("upRanking", this.getRankingHandler(3));

    playStore.onStates(
      ["currentSong", "isPlaying"],
      ({ currentSong, isPlaying }) => {
        if (currentSong) {
          this.setData({ currentSong });
        }
        if (isPlaying !== undefined) {
          this.setData({
            isPlaying,
            playAnimState: isPlaying ? "running" : "paused",
          });
        }
      }
    );
  },
});
