// 搜索页面相关请求
import yRequest from "./index";

// 获取热门搜索关键字
export function getSearchHot() {
  return yRequest.get("/search/hot");
}

// 获取搜索建议
export function getSearchSuggest(keywords) {
  return yRequest.get("/search/suggest", {
    keywords,
    type: "mobile",
  });
}
