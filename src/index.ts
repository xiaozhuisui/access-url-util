import { handi18n } from "./utils";

const fs = require("fs");
const path = require("path");
export function i18nUtils(dir: string, fileNameList?: string[]) {
  if (fileNameList) {
    fileNameList.forEach((fileName) => {});
  }

  fs.readdirSync(dir).forEach(function (file:any) {
    var pathname = path.join(dir, file);

    if (fs.statSync(pathname).isDirectory()) {
      return;
    } else {
      handi18n(pathname);
    }
  });
}
