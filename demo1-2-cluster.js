// const t1 = Date.now();
// for (var i = 0; i < 1000000; i++) {}
// const t2 = Date.now();
// console.log("耗时", t2 - t1, "毫秒");
//耗时20毫秒

// require("http")
//   .createServer((req, res) => {
//     for (var i = 0; i < 1000000; i++) {}
//     //返回文本
//     res.statusCode = 200;
//     res.setHeader("Content-Type", "text/plain;charset=utf-8");
//     res.end("经过一个耗时操作,这是返回的一段文本 \n");
//   })
//   .listen(5000, "127.0.0.1", () => console.log("服务启动了"));

const http = require("http");
const cluster = require("cluster");
//通过os模块拿到当前计算机上的cpu
const cpus = require("os").cpus();

//通过if else区分下主进程和子进程各自的启动逻辑
if (cluster.isMaster) masterProcess();
else childProcess();

function masterProcess() {
  for (let i = 0; i < 2; i++) {
    let worker = cluster.fork();
  }

  cluster.on("online", (worker) => {
    console.log("子进程" + worker.process.pid + " 创建成功");
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(`子进程 ${worker.process.pid} 退出`);
  });
}
function childProcess() {
  console.log(`子进程开始${process.pid} 开始启动服务器`);

  http
    .Server((req, res) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain;charset=utf-8");
      console.log("来自子进程id为" + cluster.worker.id + "的响应");
      res.end("Hello Juejin!");
      process.exit(1);
    })
    .listen(5000, () => {
      console.log("子进程" + process.pid + "已成功监听5000端口");
    });
}
