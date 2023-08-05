const fs = require("fs");
const path = require("path");
const { add } = require("lodash");
const { handI18n } = require("./utils");
function i18nUtil(dir: string, fileNameList?: string[]) {
  const targetDir = path.join(process.cwd(), dir);
  const localesGather: { [key: string]: "string" } = {};
  if (fileNameList) {
    fileNameList.forEach((fileName) => {
      const currentDirName = path.join(targetDir,fileName);
      handI18n(currentDirName);
    });
  }
  fs.readdirSync(targetDir).forEach(function (file: any) {
    var pathname = path.join(targetDir, file);
    if (fs.statSync(pathname).isDirectory()) {
      return;
    } else {
      handI18n(pathname, localesGather);
    }
  });
}
module.exports = { i18nUtil };
