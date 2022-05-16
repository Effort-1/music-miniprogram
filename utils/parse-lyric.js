// 格式化歌词
// 匹配时间
const timeRegExp = /\[(\d{2}):(\d{2}).(\d{2,3})\]/;
export function parseLyric(lyricString) {
  const lyricStrings = lyricString.split("\n");
  const lyricInfos = [];
  for (const lineString of lyricStrings) {
    // "[02:38.35]爱你孤身走暗巷"
    // 截取时间
    const timeRes = timeRegExp.exec(lineString);
    if (!timeRes) continue;
    const minute = timeRes[1] * 60 * 1000;
    const second = timeRes[2] * 1000;
    const millsecondTime = timeRes[3];
    const millsecond =
      millsecondTime.length === 2 ? millsecondTime * 10 : millsecondTime * 1;
    const time = minute + second + millsecond;

    // 格式化歌词
    const text = lineString.replace(timeRegExp, "");
    lyricInfos.push({ time, text });
  }
  return lyricInfos;
}
