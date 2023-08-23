import { match } from "assert";
import { replace } from "lodash";

const fs = require("fs");
const path = require("path");
const utils: Record<string, Function> = {};
// 正则 连续的中文 数字 空格 不含 纯数字 空格
const TARGERT_ATTERN =
  /[\u4E00-\u9FFF]*[\u4E00-\u9FFF]+[\u4E00-\u9FFFa-zA-Z0-9.]*/g;
// 完整标签的正则
// <div>111</div>

utils.handI18n = function (
  fileName: string,
  localesGather: { [key: string]: string }
) {
  let pathList: string[] = [];
  if (fileName.includes("pages")) {
    pathList = fileName
      .substring(fileName.indexOf("pages"))
      .replaceAll("/", ".")
      .replaceAll("\\", ".")
      .split(".");
  } else if (fileName.includes("components")) {
    pathList = fileName
      .substring(fileName.indexOf("components"))
      .replaceAll("/", ".")
      .split(".");
  }
  // 用正则也是可以的 可惜我正则弱鸡
  pathList.pop();
  // 公共前缀key
  const prefixKey = pathList.join(".") + ".";
  // 目前只处理tsx
  if (/\.(tsx)$/.test(fileName)) {
    let data: string = fs.readFileSync(fileName, "utf8");
    TARGERT_ATTERN.lastIndex = 0;
    if (!TARGERT_ATTERN.test(data)) {
      return;
    }
    try {
      // 如果不包含处理函数
      if (!data.includes("i18nLocal")) {
        data =
          "import { i18nLocal } from '@/utils/utils';\n " +
          fs.readFileSync(fileName, "utf8");
        if (data.indexOf("export default") > -1) {
          data = data.replace(
            "export default",
            (match: string) =>
              "const prefixKey=" +
              JSON.stringify(prefixKey) +
              ";\n" +
              "function getI18n(key: string) {\n" +
              "return i18nLocal(prefixKey + key);\n" +
              "}\n" +
              match
          );
        } else {
          data = data.replace(
            "import { i18nLocal } from '@/utils/utils';\n ",
            (match) =>
              match +
              "const prefixKey=" +
              JSON.stringify(prefixKey) +
              ";\n" +
              "function getI18n(key: string) {\n" +
              "return i18nLocal(prefixKey + key);\n" +
              "}\n"
          );
        }
      }
      data = data.replaceAll("'", "龘");
      data = data.replaceAll('"', "齉");
      data = data.replaceAll("`", "鱻");
      console.log(data);
      debugger;
      try {
        TARGERT_ATTERN.lastIndex = 0;
        data.replace(TARGERT_ATTERN, (match: string, offset: number) => {
          TARGERT_ATTERN.lastIndex = 0;
          const [left, right] = [
            data.lastIndexOf("\n", offset) === -1
              ? offset
              : data.lastIndexOf("\n", offset),
            data.indexOf("\n", offset),
          ];
          const str = data.substring(left, right).replaceAll("\n", "");
          debugger;
          // * /* 注释无需替换 tsx单行注释无需处理
          const trimStringStr = str.trimStart();
          if (
            trimStringStr.startsWith("//") ||
            trimStringStr.startsWith("/*") ||
            trimStringStr.startsWith("*") ||
            trimStringStr === "龘" ||
            trimStringStr === "齉"
          ) {
            return match;
          }
          if (str.includes("//")) {
            const annotationIndex = str.indexOf("//");
            const strIndex = str.indexOf(match);
            if (annotationIndex < strIndex) {
              return match;
            }
          }
          // 单双引号的情况
          if (match.startsWith("龘") || match.startsWith("齉")) {
            const innerMatch = match.substring(1, match.length - 1);
            if (["龘", "齉", "鱻"].includes(innerMatch)||!TARGERT_ATTERN.test(innerMatch)) {
              TARGERT_ATTERN.lastIndex===0
              return match;
            }
            localesGather[prefixKey + match.substring(1, match.length - 1)] =
              match.substring(1, match.length - 1);
            if (match.startsWith("龘")) {
              return `getI18n(${match.substring(1, match.length - 1)})`;
            } else {
              return `{getI18n(${match.substring(1, match.length - 1)})}`;
            }
          }
          localesGather[prefixKey + match] = match;
          if (match.startsWith("鱻")) return match;
          return `{getI18n(${match})}`;
        });
      } catch (error) {
        console.log(error);
      }
      fs.writeFile(fileName, data, "utf8", (err) => {
        if (err) {
          console.error("写入文件时出错:", err);
          return;
        }
        console.log("文件写入成功!");
      });
      // 处理文件内容
    } catch (err) {
      // 处理错误
    }
    return;
  }
};

utils.createLocalesGather = function (
  localesGather: {
    [key: string]: "string";
  },
  targetDir: string
) {
  fs.writeFile(
    path.join(targetDir, "/locales.json"),
    JSON.stringify(localesGather),
    "utf8",
    (err) => {
      if (err) {
        console.error("写入文件时出错:", err);
        return;
      }
      console.log("文件写入成功!");
    }
  );
};

utils.travel = function (
  dir: string,
  handI18n: any,
  localesGather: { [key: string]: string }
) {
  fs.readdirSync(dir).forEach(function (file) {
    var pathname = path.join(dir, file);
    if (fs.statSync(pathname).isDirectory()) {
      utils.travel(pathname, handI18n, localesGather);
    } else {
      handI18n(pathname, localesGather);
    }
  });
};

module.exports = utils;
