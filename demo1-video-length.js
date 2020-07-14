const fs = require("fs");
const path = require("path");
const moment = require("moment");
const util = require("util");

const open = util.promisify(fs.open);
const read = util.promisify(fs.read);

function getTime(buffer) {
  const start = buffer.indexOf(Buffer.from("mvhd")) + 17;
  const timeScale = buffer.readUInt32BE(start);
  const duration = buffer.readUInt32BE(start + 4);
  const movieLength = Math.floor(duration / timeScale);
  return movieLength;
}

function getLocaleTime(seconds) {
  return moment
    .duration(seconds, "seconds")
    .toJSON()
    .replace(/[PTHMS]/g, (str) => {
      switch (str) {
        case "H":
          return "小时";
        case "M":
          return "分钟";
        case "S":
          return "秒";
        default:
          return "";
      }
    });
}

(async function () {
  const dir = path.resolve(__dirname + "/video");
  const files = fs.readdirSync(dir).map((file) => path.resolve(dir, file));
  console.log(dir);
  const videos = await Promise.all(
    files.map(async (file) => {
      const fd = await open(file, "r");
      // 分配一个容纳 100 字节（取用 120 150 都可以）的 Buffer 缓冲区
      // 100 字节就足以把 MP4 的文件头（包含 mvhd box 的数据）都放进去了
      // 不需要去读取更多甚至整个 MP4 的数据，因为我们所需要的仅仅是一个 mvhd
      const buff = Buffer.alloc(100);
      const { buffer } = await read(fd, buff, 0, 100, 0);
      const time = getTime(buffer);
      return { file, time };
    })
  );
  const res = {
    视频总数: videos.length,
    视屏总时长: getLocaleTime(
      videos.reduce((prev, e) => {
        return prev + e.time;
      }, 0)
    ),
  };
  console.log(res);
  return res;
})();
