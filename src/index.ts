// @ts-ignore
const fs = require("fs");
// @ts-ignore
const path = require("path");
const inquirer = require("inquirer");
const { handI18n,createLocalesGather,travel } = require("./utils");
async function i18nUtil(
  dir: string,
  filesList?: { fileName: string; jsxStrList: string[] }[]
) {
  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "你源码git提交了没有 没提交出问题风险自负！",
      default: false,
    },
  ]);
  if (!confirm) {
    // 终止线程
    process.exit(1);
  }

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
  console.log(localesGather)
  debugger
  createLocalesGather(localesGather,targetDir)
}

module.exports = { i18nUtil };
