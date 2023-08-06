// @ts-ignore
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { handI18n } = require("./utils");
async function i18nUtil(dir: string, fileNameList?: string[]) {
  // const { confirm } = await inquirer.prompt([
  //   {
  //     type: "confirm",
  //     name: "confirm",
  //     message: "你源码git提交了没有 没提交出问题风险自负！",
  //     default: false,
  //   },
  // ]);
  // if (!confirm) {
  //   // 终止线程
  //   process.exit(1);
  // }

  const targetDir = path.join(process.cwd(), dir);
  const localesGather: { [key: string]: "string" } = {};
  if (fileNameList) {
    fileNameList.forEach((fileName) => {
      const currentDirName = path.join(targetDir, fileName);
      handI18n(currentDirName);
    });
  }
  fs.readdirSync(targetDir).forEach(function (file: any) {
    var pathname = path.join(targetDir, file);
    // 如果是目录 就不处理
    if (fs.statSync(pathname).isDirectory()) {
      return;
    } else {
      handI18n(pathname, localesGather);
    }
  });
}
module.exports = { i18nUtil };
