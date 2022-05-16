// app.js
// import {
//   getLoginCode,
//   codeToToken,
//   checkToken,
//   checkSession,
// } from "./service/api_login";
App({
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44,
    deviceRadio: 0,
  },
  onLaunch() {
    // 获取设备信息
    const info = wx.getSystemInfoSync();
    this.globalData.screenWidth = info.screenWidth;
    this.globalData.screenHeight = info.screenHeight;
    this.globalData.statusBarHeight = info.statusBarHeight;
    // 屏幕宽高比
    const deviceRadio = info.screenHeight / info.screenWidth;
    this.globalData.deviceRadio = deviceRadio;

    // 判断用户是否需要登录
    // this.checkLoginAndLogin();
  },
  /*  async checkLoginAndLogin() {
    // 判断用户要不要登录， 检查本地有没有token， 检查token有效期，检查session是否过期
    const token = wx.getStorageSync("token_key");
    const checkResult = await checkToken(token);
    const isSessionExpire = await checkSession();

    if (!token || checkResult.errorCode || !isSessionExpire) {
      this.loginAction();
    }
  },

  async loginAction() {
    // 获取code
    const code = await getLoginCode();
    // 根据 code 获取 token
    const { token } = await codeToToken(code);
    console.log(token);
    wx.setStorageSync("token_key", token);
  }, */
});
