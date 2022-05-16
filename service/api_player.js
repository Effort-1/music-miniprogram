// 播放页相关数据请求
import yRequest from "./index";

// 获取歌曲详情
export function getPlaySongDetail(ids) {
  return yRequest.get("/song/detail", { ids });
}

// 获取歌词
export function getSongLyrics(id) {
  return yRequest.get("/lyric", { id });
}
