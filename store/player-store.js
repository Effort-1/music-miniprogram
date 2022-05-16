import { HYEventStore } from "hy-event-store";
import { getPlaySongDetail, getSongLyrics } from "../service/api_player";
import { parseLyric } from "../utils/parse-lyric";

// const audioContext = wx.createInnerAudioContext();
// 背景播放
const audioContext = wx.getBackgroundAudioManager();

const playStore = new HYEventStore({
  state: {
    // 当前歌曲id
    id: 0,
    // 当前播放歌曲
    currentSong: [],
    // 歌曲总时长(ms)
    durationTime: 0,
    // 歌词内容
    lyricInfos: [],
    // 当前播放时间戳(m)
    currentTime: 0,
    // 当前播放歌词内容
    currentLyricText: "",
    // 索引
    currentLyricIndex: 0,
    // 播放模式 0:顺序 1:单曲 2:随机
    playModeIndex: 0,
    // 播放状态
    isPlaying: false,
    // 播放列表
    playListSongs: [],
    // 播放列表歌曲索引
    playListIndex: 0,
    // 是否是第一次播放
    isFirstPlay: true,
    // 是否处于停止状态
    isStoping: false,
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      if (ctx.id === id) {
        this.dispatch("changeMusicPlayStatusAction", true);
        return;
      }

      // 切换到下一首修改播放状态
      ctx.isPlaying = true;
      ctx.currentSong = {};
      ctx.durationTime = 0;
      ctx.lyricInfos = [];
      ctx.currentTime = 0;
      ctx.currentLyricIndex = 0;
      ctx.currentLyricText = "";

      ctx.id = id;
      ctx.isPlaying = true;
      // 根据 id 获取歌曲相关数据
      getPlaySongDetail(id).then((res) => {
        ctx.currentSong = res.songs[0];
        ctx.durationTime = res.songs[0].dt;
        audioContext.title = res.songs[0].name;
      });

      // 根据 id 获取歌词
      getSongLyrics(id).then((res) => {
        const lyricString = res.lrc.lyric;
        const lyric = parseLyric(lyricString);
        ctx.lyricInfos = lyric;
      });

      // 根据 id 获取播放歌曲
      // 切换到下一首暂停上一首播放
      audioContext.stop();
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      audioContext.title = id;
      // 播放
      audioContext.autoplay = true;

      // 事件监听相关
      if (ctx.isFirstPlay) {
        this.dispatch("setupAudioContextListenerAction");
        ctx.isFirstPlay = false;
      }
    },

    // 事件监听相关
    setupAudioContextListenerAction(ctx) {
      // 准备完成后播放
      audioContext.onCanplay(() => {
        audioContext.play();
      });
      audioContext.onTimeUpdate(() => {
        // 1 获取当前播放时间戳(m)
        const currentTime = audioContext.currentTime;
        ctx.currentTime = currentTime;

        // 2根据当前时间查找播放的歌词
        for (let i = 0; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i];
          // 获取播放时的索引和歌词
          if (currentTime * 1000 < lyricInfo.time) {
            const currentIndex = i - 1;
            if (ctx.currentLyricIndex !== currentIndex) {
              const currentLyricInfo = ctx.lyricInfos[currentIndex];
              ctx.currentLyricText = currentLyricInfo.text;
              ctx.currentLyricIndex = currentIndex;
            }
            break;
          }
        }
      });
      // 3 播放完当前音乐自动切换到下一首
      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicAction");
      });

      // 播放状态
      audioContext.onPlay(() => {
        ctx.isPlaying = true;
      });
      // 暂停状态
      audioContext.onPause(() => {
        ctx.isPlaying = false;
      });
      // 停止状态
      audioContext.onStop(() => {
        ctx.isPlaying = false;
        ctx.isStoping = true;
      });
    },

    // 播放状态(暂停/播放)
    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying;
      if (ctx.isPlaying && ctx.isStoping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`;
        audioContext.title = currentSong.name;
        audioContext.startTime = currentTime;
        ctx.isStoping = false;
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause();
    },

    // 上一首 下一首
    changeNewMusicAction(ctx, isNext = true) {
      // 获取当前索引
      let index = ctx.playListIndex;
      // 根据不同的播放模式,获取下一首的索引
      switch (ctx.playModeIndex) {
        case 0: //顺序播放
          index = isNext ? index + 1 : index - 1;
          if (index === -1) index = ctx.playListSongs.length - 1;
          if (index === ctx.playListSongs.length) index = 0;
          break;
        case 1: // 单曲循环
          break;
        case 2: // 随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length);
          if (index === ctx.playListIndex) {
            index = Math.floor(Math.random() * ctx.playListSongs.length);
          }
          break;
      }
      // 获取歌曲
      let currentSong = ctx.playListSongs[index];
      if (!currentSong) {
        currentSong = ctx.currentSong;
      } else {
        // 记录最新索引值
        ctx.playListIndex = index;
      }
      // 播放新的歌曲
      this.dispatch("playMusicWithSongIdAction", {
        id: currentSong.id,
        isRefresh: true,
      });
    },
  },
});
export { audioContext, playStore };
