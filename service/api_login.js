import { loginRequest } from "../service/index";
export function getLoginCode() {
  return new Promise((resolve, reject) => {
    // 获取code
    wx.login({
      timeout: 1000,
      success: (res) => {
        const code = res.code;
        resolve(code);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}

// 根据 code 获取到 token(向服务器发送请求)
export function codeToToken(code) {
  return loginRequest.post("/login", { code });
}

export function checkToken(token) {
  return loginRequest.post("/auth", {}, { token });
}

/**
 * 检查session有效期
 */
export function checkSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: (res) => {
        resolve(true);
      },
      fail: () => {
        reject(false);
      },
    });
  });
}

// 获取用户信息 
export function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: "你好啊,小杨",
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        console.log(err);
      },
    });
  });
}
