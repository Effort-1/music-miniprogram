import yRequest from "./index.js";

// 获取轮播图
export function getBanners(type) {
  return yRequest.get("/banner", { type });
}

// 获取推荐歌曲
export function getRankings(idx) {
  return yRequest.get("/top/list", { idx });
}

// 获取热门歌单
export function getSongMenus(cat = "全部", limit = 6, offset = 0) {
  return yRequest.get("/top/playlist", {
    cat,
    limit,
    offset,
  });
}

// 请求歌单歌曲详情
export function getMenuSongsDetail(id) {
  return yRequest.get("/playlist/detail", { id });
}

// 请求搜索的歌曲
export function getSearchResult(keywords) {
  return yRequest.get("/search", {
    keywords,
  });
}
