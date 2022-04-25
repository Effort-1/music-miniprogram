import yRequest from "./index";

// 请求mv的数据请求
export function getTopMvs(offset, limit = 10) {
  return yRequest.get("/mv/all", { offset, limit });
}

// 请求 mv 视频地址
export function getMvURL(id) {
  return yRequest.get("/mv/url", { id });
}

// 请求 mv 详情
export function getMvDetail(mvid) {
  return yRequest.get("/mv/detail", { mvid });
}

// 请求 mv 相关视频
export function getRelatedVideo(id) {
  return yRequest.get("/related/allvideo", { id });
}
