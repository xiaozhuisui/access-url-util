import { indexOf } from "lodash";

// @ts-ignore
const fs = require("fs");
const utils: { [key: string]: Function } = {};
// 正则 连续的中文 数字 空格 不含 纯数字 空格
// /[\u4E00-\u9FFF\u3000-\u303F]+(?:[\u4E00-\u9FFF\u3000-\u303F\d\s]*[\u4E00-\u9FFF\u3000-\u303F]+)*/;
const TARGERT_ATTERN = /[\u4E00-\u9FFF\u3000-\u303F]+[\w\d\s]*/;
// 特殊情况
const CROSS_ATTERN = /[\u4E00-\u9FFF]+(?:\s*\{\w+\}\s*)+/;
// 匹配单行单标签 换行的不管
// 类似 <div title="标题" title1={"标题1"} title2={{title:"标题1"}}>
// <div title3={{ title: '标题1', title1: '标题1', title2: '标题2' }} title4="标题4"/>
function handleMatchSingleTag(str: string):
  | false
  | {
      type: "{{" | "=";
      str: string | undefined;
    }[] {
  const array = str.split(TARGERT_ATTERN);
  if (array.length === 1) {
    return false;
  }
  const matchs = str.match(TARGERT_ATTERN);
  debugger;
  array.pop();
  return array.map((item, index) => {
    if ((item.indexOf("{{") || item.indexOf(":")) > item.indexOf("="))
      return { type: "{{", str: matchs?.[index] };
    return { type: "=", str: matchs?.[index] };
  });
}
// <div title3={{ title: '标题1', title1: '标题1', title2: '标题2' }} >
function handleHalfTag(str: string, tagList: string[]) {
  const array = str.split(TARGERT_ATTERN);
  if (str.startsWith("<")) {
    // 进行tag处理
    tagList.push(array[0].split(" ")[0]);
  }
  if (array.length === 1) {
    return false;
  }
  array.pop();
  return array.map((item) => {
    if (item.startsWith("<") && !item.includes("/>")) {
      // 进行tag处理
      tagList.push(item.split(" ")[0]);
    }
    if (item.includes("/>")) {
      tagList.pop();
    }
    if (item.indexOf("{{") || item.indexOf(":") || item.indexOf("=")) {
      if ((item.indexOf("{{") || item.indexOf(":")) > item.indexOf("=")) {
        return "{{";
      }
      return "=";
    }
    // 不然暂定是纯汉字 和=是同一种逻辑
    if (item.indexOf("/>")) {
      return "=";
    }
  });
}
// 从指定位置开始匹配
function replacePos(
  text: string,
  start: { value: number },
  content: string,
  replacetext: string
) {
  const mystr =
    text.substring(0, start.value) +
    text.substring(start.value).replace(content, replacetext);
  start.value = Math.max(mystr.indexOf(replacetext, start.value), start.value);
  debugger;
  return mystr;
}

utils.handI18n = function (
  fileName: string,
  localesGather: { [key: string]: "string" }
) {
  console.log(fileName);
  // 公共前缀key
  let prefixKey = "";
  let pathList: string[] = [];
  if (fileName.includes("pages")) {
    pathList = fileName
      .substring(fileName.indexOf("pages"))
      .replaceAll("/", ".")
      .split(".");
  } else if (fileName.includes("components")) {
    pathList = fileName
      .substring(fileName.indexOf("components"))
      .replaceAll("/", ".")
      .split(".");
  }
  // 用正则也是可以的 可惜我正则弱鸡
  pathList.pop();
  prefixKey = pathList.join(".") + ".";
  const tagList = [];
  const startIndex = { value: 0 };
  // 目前只处理ts 和 tsx
  if (/\.(ts|tsx)$/.test(fileName)) {
    try {
      let data: string =
        "import { i18nLocal, utilsLocal } from '@/utils/utils';\n " +
        fs.readFileSync(fileName, "utf8");
      if (!TARGERT_ATTERN.test(data)) {
        return;
      }
      // 通过换行符处理 处理前后空格
      const strList = data.split("\n").map((item) => item.trim());
      strList.forEach((str) => {
        debugger;
        // * /* 注释无需替换 tsx单行注释无需处理
        if (/^(\/\*|\*|\/\/)|{\/\*.*?\*\/}/.test(str)) {
          debugger;
          return;
        }
        // 特殊情况暂不处理
        if (CROSS_ATTERN.test(str) || !TARGERT_ATTERN.test(str)) {
          debugger;
          return;
        }
        // 单标签
        // 类似 <div title="标题" title1={"标题1"} title2={{title:"标题1"}}>
        // <div title3={{ title: '标题1', title1: '标题1', title2: '标题2' }} />

        if (/<[^>]+\/>/.test(str) && handleMatchSingleTag(str)) {
          const result = handleMatchSingleTag(str);
          (
            result as {
              type: "{{" | "=";
              str: string | undefined;
            }[]
          ).forEach((item) => {
            if (item.type === "=") {
              // 需要加个花括号
              debugger;
              data = replacePos(
                data,
                startIndex,
                `"${item.str}"`,
                `{utilsLocal(${JSON.stringify(prefixKey + item?.str)})}`
              );
              debugger;
            } else {
              data = data.replace(
                `'${item.str}'`,
                `utilsLocal(${JSON.stringify(prefixKey + item?.str)})`
              );
            }
          });
          debugger;
          return;
        }
        // 如果是单行标签 不用管是不是完整的 先加个
        // <div>12345中</div> 与这种作区分
        // <div title="标题1"> | <div>
        // 完整标签 可能含着中文
        if (/<[^>]+>/.test(str) && handleHalfTag(str, tagList)) {
          const result = handleMatchSingleTag(str);
          (
            result as {
              type: "{{" | "=";
              str: string | undefined;
            }[]
          ).forEach((item) => {
            if (item.type === "=") {
              // 需要加个花括号
              data = data.replace(
                `'${item}'`,
                `{utilsLocal(${JSON.stringify(prefixKey + item)})}`
              );
            } else {
              data = data.replace(
                `'${item}'`,
                `utilsLocal(${JSON.stringify(prefixKey + item)})`
              );
            }
          });
          debugger;
          return;
        }
        if (/<\/\w+>/.test(str)) {
          debugger;
          return tagList.pop();
        }
        // 最难的已经过去了 轻舟已过万重山 真j8难 睡觉
        if (TARGERT_ATTERN.test(str)) {
          const matchs = str.match(TARGERT_ATTERN);
          matchs?.forEach((item) => {
            if (tagList.length) {
              data = data.replace(
                `'${item}'`,
                `{utilsLocal(${JSON.stringify(prefixKey + item)})}`
              );
              debugger;
            } else {
              data = data.replace(
                `'${item}'`,
                `utilsLocal(${JSON.stringify(prefixKey + item)})`
              );
              debugger;
            }
          });
          debugger;
        }
        debugger;
      });
      // {/*} 进行特殊处理
      console.log(data);
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

module.exports = utils;
