const BASE_URL = "http://123.207.32.32:9001";
class YRequest {
  reuqest(url, method, params) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + url,
        method: method,
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
  get(url, params) {
    return this.reuqest(url, "GET", params);
  }
  post(url,data){
    return this.request(url,'POST',data)
  }
}

const yRequest = new YRequest();
export default yRequest;
