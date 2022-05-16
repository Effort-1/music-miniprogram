// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest } from "../../service/api_search";
import { getSearchResult } from "../../service/api_music";
import debounce from "../../utils/debounce";
const debounceGetSearchSuggest = debounce(getSearchSuggest, 300);
Page({
  data: {
    hotKeywords: [],
    // 搜索建议数据
    suggestSongs: [],
    // 输入框输入数据
    searchValue: "",
    // 富文本节点
    suggestSongsNodes: [],
    // 搜索匹配结果
    resultSongs: [],
  },
  onLoad() {
    this.getPageData();
  },

  // 搜索页面所有请求
  getPageData() {
    // 获取热门搜索关键字
    getSearchHot().then((res) => {
      this.setData({ hotKeywords: res.result.hots });
    });
  },

  // 事件处理
  handleSearchChange(event) {
    // 获取输入框输入的内容
    const searchValue = event.detail;
    this.setData({ searchValue });
    // 根据输入框内容发送请求
    // 输入框内容为空不发送请求
    if (!searchValue.length) {
      this.setData({ suggestSongs: [], resultSongs: [] });
      // 搜索结果清空后不发送请求
      debounceGetSearchSuggest.cancel();
      return;
    }
    // 根据关键字进行搜索
    debounceGetSearchSuggest(searchValue).then((res) => {
      // 搜索内容为空时不发送请求(一种方案,还可以使用防抖的取消)
      // if (!this.data.searchValue) return;
      // 匹配关键字的内容
      const suggestSongs = res.result.allMatch;
      this.setData({ suggestSongs });
      // 搜索结果为空时不转换为节点
      if (!suggestSongs) return;

      // 转成node节点
      const suggestKeywords = suggestSongs.map((item) => item.keyword);
      const suggestSongsNodes = [];
      for (const keyword of suggestKeywords) {
        const nodes = [];
        // 忽略大小写,匹配显示高亮部分
        if (keyword.toUpperCase().startsWith(searchValue.toUpperCase())) {
          const key1 = keyword.slice(0, searchValue.length);
          const node1 = {
            name: "span",
            attrs: { style: "color: #26ce8a" },
            children: [{ type: "text", text: key1 }],
          };
          nodes.push(node1);
          const key2 = keyword.slice(searchValue.length);
          const node2 = {
            name: "span",
            attrs: { style: "color:black" },
            children: [{ type: "text", text: key2 }],
          };
          nodes.push(node2);
        } else {
          const node = {
            name: "span",
            attrs: { style: "color:black" },
            children: [{ type: "text", text: keyword }],
          };
          nodes.push(node);
        }
        suggestSongsNodes.push(nodes);
      }
      this.setData({ suggestSongsNodes });
    });
  },

  // 点击确认 根据关键词进行搜索,并将搜索结果保存
  handleSearchAction() {
    const keyword = this.data.searchValue;
    getSearchResult(keyword).then((res) => {
      this.setData({ resultSongs: res.result.songs });
    });
  },

  // 将下面两条请求封装(两者只是获取关键字的方式不同,我们直接让他传过来关键字)
  handleKeywordItemClck(event) {
    // 获取点击的关键字
    const keyword = event.currentTarget.dataset.keyword;
    // 将关键字设置到searchValue中
    this.setData({ searchValue: keyword });
    // 发送搜索请求
    this.handleSearchAction();
  },
  /* 
	// 点击搜索建议搜索
	handleSuggestItemClick(event) {
		// 获取点击的关键字
		const index = event.currentTarget.dataset.index;
		const keyword = this.data.suggestSongs[index].keyword;
		// 将关键字设置到searchValue中
		this.setData({ searchValue: keyword });
		// 发送搜索请求
		this.handleSearchAction();
	},

	// 点击热门搜索关键字进行搜索
	handleHotSearchClick(event) {
		// 获取热门搜索的关键字
		const keyword = event.currentTarget.dataset.keyword;
		// 将关键字保存
		this.setData({ searchValue: keyword });
		// 发送请求
		this.handleSearchAction();
	}, */
});
