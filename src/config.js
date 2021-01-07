exports.EXTS = [".jpg", ".png"]; // 允许压缩的类型
exports.IMGMAX = 10240000 // 最大压缩的图片大小（10MB）

// 请求配置
exports.OPTIONS = {
  method: "POST",
  hostname: "tinypng.com",
  path: "/web/shrink",
  headers: {
    rejectUnauthorized: false,
    "Postman-Token": Date.now(),
    "Cache-Control": "no-cache",
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
  },
};