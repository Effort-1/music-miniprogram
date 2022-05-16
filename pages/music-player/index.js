// pages/music-player/index.js
import { audioContext } from "../../store/index";
import { playStore } from "../../store/player-store";
const playModeNames = ["order", "repeat", "random"];
Page({
  data: {
    // 当前播放歌曲id
    id: "",
    // 当前播放歌曲信息
    currentSong: [],
    // 当前页
    currentPage: 0,
    // 内容高度
    contentHeight: 0,
    // 是否显示歌词
    isMusicLyric: true,
    // 当前播放时间戳(m)
    currentTime: 0,
    // 歌曲总时长(ms)
    durationTime: 0,
    // 当前 seild 组件的 value 属性值
    selidValue: 0,
    // 进度条是否处于被拖动状态
    isSelidChanging: false,
    // 歌词内容
    lyricInfos: [],
    // 当前播放歌词内容
    currentLyricText: "",
    // 索引
    currentLyricIndex: 0,
    // 歌词向上移动的距离
    lyricScrollTop: 35,

    // 播放模式索引
    playModeIndex: 0,
    // 播放模式名称
    playModeName: "order",

    // 播放状态
    isPlaying: false,
    // 播放状态图标
    playName: "pause",
  },

  onLoad(options) {
    const id = options.id;
    this.setData({ id });
    // 获取页面数据
    this.setupPlayerStoreListener();

    // 动态计算内容区域高度(屏幕高度-状态栏-导航栏)
    const globalData = getApp().globalData;
    const screenHeight = globalData.screenHeight;
    const statusBarHeight = globalData.statusBarHeight;
    const navBarHeight = globalData.navBarHeight;
    const deviceRadio = globalData.deviceRadio;
    const contentHeight = screenHeight - statusBarHeight - navBarHeight;
    this.setData({ contentHeight, isMusicLyric: deviceRadio >= 2 });
  },

  // =======================事件处理===================
  // 轮播图滚动事件
  handleSwiperChange(event) {
    const currentPage = event.detail.current;
    this.setData({ currentPage });
  },
  // 监听 selid 进度条事件,进度条 value区间(0-100)
  handleSliderChange(event) {
    // 获取selid变化的值
    const value = event.detail.value;
    // 计算拖动进度条对应的时间戳(ms)
    const currentTime = (this.data.durationTime * value) / 100;
    this.setData({ currentTime });
    // 拖动进度条时,暂停播放
    audioContext.pause();
    // 播放时间戳对应的歌曲内容
    audioContext.seek(currentTime / 1000);
    // 记录当前的value
    this.setData({ selidValue: value, isSelidChanging: false, currentTime });
  },
  // 监听 selid 的changing事件
  handleSliderChanging(event) {
    const value = event.detail.value;
    const currentTime = (this.data.durationTime * value) / 100;
    console.log(currentTime);
    this.setData({ isSelidChanging: true, currentTime });
  },

  // 监听暂停按钮事件
  handlePauseBtnClick() {
    playStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying);
  },

  // 监听返回事件
  handleBackBtnClick() {
    wx.navigateBack();
  },
  // 监听播放模式事件
  handlePalyModeClick() {
    let playModeIndex = this.data.playModeIndex + 1;
    if (playModeIndex === 3) playModeIndex = 0;
    playStore.setState("playModeIndex", playModeIndex);
  },

  // 监听 playStore 中的数据变化
  setupPlayerStoreListener() {
    playStore.onStates(
      ["currentSong", "durationTime", "lyricInfos"],
      ({ currentSong, durationTime, lyricInfos }) => {
        if (currentSong) this.setData({ currentSong });
        if (durationTime) this.setData({ durationTime });
        if (lyricInfos) this.setData({ lyricInfos });
      }
    );

    playStore.onStates(
      ["currentTime", "currentLyricText", "currentLyricIndex"],
      ({ currentTime, currentLyricText, currentLyricIndex }) => {
        // 时间变化
        if (currentTime && !this.data.isSelidChanging) {
          const selidValue =
            ((currentTime * 1000) / this.data.durationTime) * 100;
          this.setData({ currentTime, selidValue });
        }
        // 歌词滚动
        if (currentLyricIndex) {
          this.setData({
            currentLyricIndex,
            lyricScrollTop: currentLyricIndex * 35,
          });
        }
        if (currentLyricText) {
          this.setData({ currentLyricText });
        }
      }
    );

    // 监听播放模式 和 播放状态相关
    playStore.onStates(
      ["playModeIndex", "isPlaying"],
      ({ playModeIndex, isPlaying }) => {
        if (playModeIndex !== undefined) {
          this.setData({
            playModeIndex,
            playModeName: playModeNames[playModeIndex],
          });
        }
        if (isPlaying !== undefined) {
          this.setData({ isPlaying, playName: isPlaying ? "pause" : "resume" });
        }
      }
    );
  },

  // 上一曲
  handlePrevBtnClick() {
    playStore.dispatch("changeNewMusicAction", false);
  },
  // 下一曲
  handleNextBtnClick() {
    playStore.dispatch("changeNewMusicAction", true);
  },
});
