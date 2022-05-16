const BASE_URL = "http://123.207.32.32:9001";
const LOGIN_BASE_URL = "http://123.207.32.32:3000";
class YRequest {
  constructor(baseURl) {
    this.baseURl = baseURl;
  }
  reuqest(url, method, params, header = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURl + url,
        method: method,
        header: header,
        data: params,
        success: function (res) {
          resolve(res.data);
        },
        fail: function (err) {
          reject(err);
        },
      });
    });
  }
  get(url, params, header) {
    return this.reuqest(url, "GET", params, header);
  }
  post(url, data, header) {
    return this.request(url, "POST", data, header);
  }
}

const yRequest = new YRequest(BASE_URL);
const loginRequest = new YRequest(LOGIN_BASE_URL);
export default yRequest;
export { loginRequest };
