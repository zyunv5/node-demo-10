const fs = require("fs");

fs.readFile("./image/img.png", (err, buffer) => {
  console.log(
    Buffer.isBuffer(buffer) && "readFile 读取图片拿到的是 Buffer 数据"
  );

  fs.writeFile("./image/logo.png", buffer, function (err) {});

  const base64Image = Buffer.from(buffer).toString("base64");
  console.log(base64Image);

  const decodedImage = Buffer.from(base64Image, "base64");

  console.log(Buffer.compare(buffer, decodedImage));
  fs.writeFile("img_decoded.jpg", decodedImage, (err) => {});
});
