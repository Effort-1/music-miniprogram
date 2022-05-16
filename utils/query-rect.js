export default function queryRect(){
  return new Promise((resolve,reject)=>{
        // 获取轮播图下的图片高度(将图片的高度设置为swiper组件的高度,解决显示面板指示点兼容性)
        const query = wx.createSelectorQuery();
        query.select(".swiper-image").boundingClientRect();
        // 获取滚动相关的内容
        // query.selectViewport().scrollOffset();

        // 可以将下面代码简写
        query.exec(resolve)
        /* query.exec((res) => {
          const rect = res[0];
          this.setData({ swiperHeight: rect.height });
        }); */
  })
}