// @ts-nocheck
/**
 * vscode版本的图片压缩工具（没有 tinypng 的上传数量限制）
 * */

const fs = require("fs");
const path = require("path");
const https = require("https");
const { URL } = require("url");
const { getRandomIP, readDirToPathArr } = require('./utils');
const { EXTS, IMGMAX, OPTIONS } = require('./config');

let reduceCallback = null;

/**
 * 压缩入口
 * 
 * @param {*} filePath 文件路径
 * @param {*} callback  回调函数
 */
exports.tinypngInit = (filePath, callback) => {
  let files = readDirToPathArr(filePath) // 读取文件路径信息
  reduceCallback = callback; // 挂载回调事件
  files.forEach((full) => fileFilter(full)) // 执行压缩
}



// 执行压缩
function fileFilter(file) {
  // 校验程序
  if (!isPngOrJpg(file)) return;
  
  OPTIONS.headers["X-Forwarded-For"] = getRandomIP(); // 通过 X-Forwarded-For 头部伪造客户端IP
  fileUpload(file); // console.log('可以压缩：' + file);
}

// 判断图片类型和大小是否符合预期
function isPngOrJpg(file) {
  let stats = fs.statSync(file);
  if (stats.size <= IMGMAX && stats.isFile() && EXTS.includes(path.extname(file))) {
    return true;
  }
  return false
}

// 异步API,压缩图片
function fileUpload(img) {
  let req = https.request(OPTIONS, function (res) {
    res.on("data", async (buf) => {
      let obj = JSON.parse(buf.toString());
      obj.error
        ? console.log(`[${img}]：压缩失败！报错：${obj.message}`)
        : await fileUpdate(img, obj);
    });
  });
  req.write(fs.readFileSync(img), "binary");
  req.on("error", (e) => console.error(e));
  req.end();
}

// 该方法被循环调用,请求图片数据
function fileUpdate(imgpath, obj) {
  return new Promise((resovle, rejet) => {
    if (!fs.existsSync(imgpath)) {
      fs.mkdirSync(imgpath);
    }

    let options = new URL(obj.output.url);
    let req = https.request(options, (res) => {
      let body = "";
      res.setEncoding("binary");
      res.on("data", function (data) {
        body += data;
      });
      res.on("end", function () {
        fs.writeFile(imgpath, body, "binary", (err) => {
          if (err) {
            console.error(err);
            rejet(err)
          }

          // 回调信息注入
          let imgpathArr = imgpath.split('/');
          reduceCallback({
            input: obj.input.size / 1000, // 压缩前大小（kb）
            output: obj.output.size / 1000, // 压缩后大小（kb）
            imgpath: imgpath, // 图片路径
            currentImg: imgpathArr[imgpathArr.length - 1], // 当前图片的名称
            ratio: Math.ceil((1 - obj.output.ratio) * 100) + '%' // 压缩比例 
          })
          resovle();
        });
      });
    });
    req.on("error", (e) => console.error(e));
    req.end();
  })
}