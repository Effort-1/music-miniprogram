// baseui/nav-bar/index.js
Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    title: {
      type: String,
      value: "默认内容",
    },
  },
  data: {
    // 获取当前设备的状态栏高度
    statusBarHeight: getApp().globalData.statusBarHeight,
    navBarHeight: getApp().globalData.navBarHeight,
  },
  methods: {
    handleBackClick() {
      this.triggerEvent("click");
    },
  },
});
