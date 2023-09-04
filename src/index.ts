const fs = require("fs");

import * as path from 'path'
// const { handI18n,createLocalesGather,travel } = require("./checkUtils");
const { handI18n,createLocalesGather,travel } = require("./checkUtils");
async function i18nUtil(
  dir: string,
  filesList?: { fileName: string; jsxStrList: string[] }[]
) {

  const targetDir = path.join(process.cwd(), dir);
  const localesGather: { [key: string]: "string" } = {};
  if (filesList) {
    filesList.forEach((fileObject) => {
      const currentDirName = path.join(targetDir, fileObject.fileName);
      handI18n(currentDirName, localesGather, fileObject.jsxStrList);
    });
    createLocalesGather(localesGather,targetDir)
    return;
  }
  // 遍历文件
  fs.readdirSync(targetDir).forEach(function (file: any) {
    var pathname = path.join(targetDir, file);
    // 如果是目录 就不处理
    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname,handI18n,localesGather)
    } else {
      handI18n(pathname, localesGather);
    }
  });
  createLocalesGather(localesGather,targetDir)
  console.log('程序执行结束！')
}

module.exports = { i18nUtil };


