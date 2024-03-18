import { IFilesExcelDataListItem } from "@/route";
import * as path from "path";
import {debounce} from 'lodash'

const Excel = require("exceljs");
function getRandomHexColor() {
  // 生成随机的红、绿、蓝颜色分量
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  // 将每个颜色分量转换为十六进制字符串，并补齐两位
  const rHex = r.toString(16).padStart(2, "0");
  const gHex = g.toString(16).padStart(2, "0");
  const bHex = b.toString(16).padStart(2, "0");

  // 返回颜色字符串，例如 "#ffff00"
  return `${rHex}${gHex}${bHex}12`;
}
// 获取文件路径;
export function getFileAbsolutePath(dir: string) {
  return path.join(process.cwd(), dir);
}

const EXCEL_FILE_NAME =
  process.argv[process.argv.length - 1].slice(1) + ".xlsx";
export function createExcel(columns,dataSource) {
  // 创建工作表对象
  let workbook = new Excel.Workbook();

  // 添加一个工作表
  let worksheet = workbook.addWorksheet('子应用数据');

  // 添加表头
  worksheet.columns = columns
  // 添加数据行
  dataSource.forEach(item => {
    worksheet.addRow(item)
  })

  // todo 不知道为什么不生效
  worksheet.view = [{
      state: 'frozen',
      xSplit: 1, // 冻结列
      ySplit: 1, // 冻结行
    }]
   worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) {
        const bgColor = getRandomHexColor();
        row.eachCell({ includeEmpty: false }, (cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: bgColor }, // 辣眼睛背景
          };
        });
      }
  });
  // 保存工作簿到硬盘
  workbook.xlsx.writeFile(EXCEL_FILE_NAME);
}

export const updateExcel = debounce(
  async (columns, dataSource, pathString = EXCEL_FILE_NAME) => {
    const workbook = new Excel.Workbook();
    console.log('执行一遍')
    // 读取Excel文件
    await workbook.xlsx.readFile(pathString);
    const sheetName = "子应用URL数据";
    const sheet = workbook.getWorksheet(sheetName);
    if (sheet) {
      workbook.removeWorksheet(sheet);
    }

    // 添加一个工作表
    let worksheet = workbook.addWorksheet(sheetName);

    // 添加表头
    worksheet.columns = columns;
    // 添加数据行
    dataSource.forEach((item) => {
      worksheet.addRow(item);
    });

    // todo 不知道为什么不生效
    worksheet.view = [
      {
        state: "frozen",
        xSplit: 1, // 冻结列
        ySplit: 1, // 冻结行
      },
    ];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) {
        const bgColor = getRandomHexColor();
        row.eachCell({ includeEmpty: false }, (cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: bgColor }, // 辣眼睛背景
          };
        });
      }
    });
    // 保存工作簿到硬盘
    workbook.xlsx.writeFile(EXCEL_FILE_NAME);
  },
  10000
);

export async function readExcel<T>(
  headers: string[],
  index = 1,
  pathString = EXCEL_FILE_NAME,
) {
  const workbook = new Excel.Workbook();

  // 读取Excel文件
  await workbook.xlsx.readFile(pathString);

  workbook.getWorksheet(index);
  const worksheet = workbook.getWorksheet(index);
  const dataSource: T[] = [];
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    // 数据行从1开始 第一行是表头
    if (rowNumber > 1) {
      const coloum = {};
      row._cells.forEach((cell, index) => {
        coloum[headers[index]] = cell._value.model?.value;
      });
      dataSource.push(coloum as T);
    }
  });
  return dataSource;
  // 获取第一个工作表

  // 遍历工作表中的所有行
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    console.log(`Row ${rowNumber}:${row._cells}`);
  });
}

export function getHideInMenu(
  dataSource: IFilesExcelDataListItem[],
  path: string
) {
  // console.log(path);
  // console.log(dataSource);
  const replacePath = path.replace(".tsx", "");
  let subReplacePath = path.replace("index", "");
  if (replacePath.endsWith("index")) {
    subReplacePath = path.replace("index", "");
  }
  // debugger
  const filerData = dataSource.filter(
    (item) => item.filePath === replacePath || item.filePath === subReplacePath
  );
  if (filerData?.some?.((item) => item.hideInMenu === true)) {
    // debugger;
    return true;
  }
  return false;
}

export function getTargetCode(
  dataSource: IFilesExcelDataListItem[],
  path: string
) {
  // console.log(path);
  // console.log(dataSource);
  const replacePath = path.replace(".tsx", "");
  let subReplacePath = path.replace("index", "");
  if (replacePath.endsWith("/index")) {
    subReplacePath = replacePath.replace("/index", "");
  }
  const filerData =
    dataSource.filter(
      (item) =>
        item.filePath.includes(replacePath) ||
        item.filePath.includes(subReplacePath)
    ) || [];
  return [...new Set(filerData?.map?.((i) => i.code))]?.join?.("确定一下") || "";
}

export function getTargetURIPath(
  dataSource: IFilesExcelDataListItem[],
  path: string
) {
  // console.log(path);
  // console.log(dataSource);
  const replacePath = path.replace(".tsx", "");
  let subReplacePath = path.replace("index", "");
  if (replacePath.endsWith("/index")) {
    subReplacePath = replacePath.replace("/index", "");
  }
  const filerData = dataSource.filter(
    (item) => item.filePath === replacePath || item.filePath === subReplacePath
  );
  return [...new Set(filerData?.map?.((i) => i.path))]?.join?.("确定一下") || "";
}

export function getComponentPath(
  contentString:string
){
  if (
    contentString.includes("import") &&
    contentString.includes("from") &&
    (contentString.includes("./") || contentString.includes("../"))
  ) {
    return contentString.split("from")[1].trim();
  }
  return "";
}

export  function getUrlString(contentString: string) {
  const prefixStrList = [
    "/posretail",
    "/pay",
    "/stock",
    "/oms-ops",
    "/pos-ops",
    "/items",
    "/basic",
    "/drp-ops",
    "/wms-ops",
    "/channel-manage",
    "/dcopis",
    "/bop",
    "/purchasing",
    "/marketingChannel",
    "/sca",
    "/scd",
    "/user",
    "/settle",
    // 这个扑街搞特殊
    "handleBaseUrlPre",
  ];
  if (
    prefixStrList.find((item) => contentString.includes(item)) &&
    (contentString.includes("url:") || contentString.includes("url ="))
  ) {
    const regex = /(`[^`\r\n]*`)|('[^'\r\n]*')/g;
    let obj = contentString.match(regex);
    let targetUrl = obj?.filter((item) =>
      prefixStrList.some((sItem) => item.includes(sItem))
    )?.[0];
    return targetUrl?.replaceAll("'", "") || "";
  }
  return "";
}

export const REGEX = {
  COMPONENT: /component:\s'\.\/([\w/]+)'/i,
  PATH: /path:\s'([\w\-/:\.]+)'/i,
  CODE: /code:\s'([a-zA-Z0-9-_]+)'/i,
  ANNOTATION_CODE: /\/\/code:\s'([a-zA-Z0-9-_]+)'/i,
  NAME: /name:\s'([a-zA-Z0-9-_]+)'/i,
  ANNOTATION: /\/\//g,
  HIDEINMENU: /hideInMenu:\s*true/i,
  // todo
  // IMPORT: /import\s+(?:\w+\s+from\s+)?['"](?:\.\/|\.\.\/)[^'"]+['"]/i,
  // IMPORT: /import\s+(\w+)\s+from\s+'\.\.\/(\w+)'/,
  // IMPORT: /import\s+(\w+)\s+from\s+'(\.\.?\/[\w\.-]+)'/,
  // URL:/\/(?:posretail|pay|stock|oms-ops|pos-ops)\/[\w-]+$/,
  URL: /^\/(posretail|pay|stock|oms-ops|pos-ops|items)(?:\?.*)?$/,
  METHOD: /method:\s'([a-zA-Z0-9-_]+)'/i,
  CONTENT: /[,;]\n/,
};

export const handleBaseUrlPre = (baseName: string) => {
  const baseUrlMap = new Map([
    ["basicDataFront", "/basic"],
    ["basicDchannelataFront", "/channel-manage"],
    ["dcop", "/dcopis/api"],
    ["channel", "/channel-manage"],
    ["bop", "/bop/api"],
    ["purchasing", "/purchasing/api"],
    ["mca", "/marketingChannel/api"],
    ["sca", "/sca/"],
    ["scd", "/scd/"],
    ["userFront", "/user"],
    ["itemFront", "/items"],
    ["settleFront", "/settle"],
    ["stockFront", "/stock"],
  ]);
  let result = baseUrlMap.get(baseName) || null;
  return result;
};


export const SEPARATOR = "{\n";
export const CONTENT_SEPARATOR = ";\n";
export const DOU_SEPARATOR = ",\n";
export const ENDSUFFIX=['.tsx','/index.tsx','.js']
export const PREFIX_SUFFIX = ["/posretail", "/pay", "/stock", "/oms-ops"];

export interface IURLITEM {
  url: string;
  code: string;
  method: string;
  codeTodo?: boolean;
  methodNameTodo?: boolean;
  filePath: string;
  isSub?:boolean;
  hideInMenu?:boolean;
  parentPath?:string;
  path:string;
}
