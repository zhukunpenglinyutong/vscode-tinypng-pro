// @ts-nocheck
const fs = require("fs");

/**
 * 生成随机IP， 赋值给 X-Forwarded-For
 */
exports.getRandomIP = () => {
    return Array.from(Array(4))
      .map(() => parseInt(Math.random() * 255))
      .join(".");
}


/**
 * 传入一个文件夹路径，返回这个文件夹下所有的文件路径数组
 * @param { String } 文件夹路径
 * @return { Array } 此文件夹下所有的文件相对路径数组
 */
exports.readDirToPathArr = (foldPath) => {
    let pathArr = []
    function recursion(foldPath) {
      let files = fs.readdirSync(foldPath)
      files.forEach(item => {
        if (item === '.DS_Store') return;
        let isDir = fs.statSync(`${foldPath}/${item}`).isDirectory(); // 是否是文件夹
        isDir
          ? recursion(`${foldPath}/${item}`)
          : pathArr.push(`${foldPath}/${item}`)
      })
    }

    recursion(foldPath)
    return pathArr
}