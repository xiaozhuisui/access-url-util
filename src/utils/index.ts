import { IFilesExcelDataListItem } from "@/route";
import * as path from "path";
import {debounce, result} from 'lodash'
import moment from "moment";
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
  async (
    columns,
    dataSource,
    startTime: number,
    pathString = EXCEL_FILE_NAME
  ) => {
    const workbook = new Excel.Workbook();
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
    console.log(
        "程序运行结束",
        "运行时间 " + moment.duration(Date.now() - startTime)
      );
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
  readExcelDataSourceMap:Record<string, IFilesExcelDataListItem> = {},
  path: string
) {
  return Boolean(readExcelDataSourceMap[path]?.hideInMenu);
}

export function getTargetCode(
  readExcelDataSourceMap:Record<string, IFilesExcelDataListItem> = {},
  path: string
) {
  return String(readExcelDataSourceMap[path]?.code)
}


export function getTargetURIPath(
  readExcelDataSourceMap:Record<string, IFilesExcelDataListItem> = {},
  path: string
) {
  // debugger
  return String(readExcelDataSourceMap[path]?.path)
}

export function getComponentPath(
  contentString:string
){
  // import xxx from './../';
  if (
    contentString.includes("import") &&
    contentString.includes("from") &&
    (contentString.includes("./") || contentString.includes("../"))
  ) {
    return contentString.split("from")[1].trim();
  }
  return "";
}

export  function getUrlString(contentString: string,isSub=false) {
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
  if(isSub){
    debugger
  }
  if (
    prefixStrList.find((item) => contentString.includes(item)) &&
    (contentString.includes("url:") ||
      contentString.includes("url =") ||
      contentString.includes("request"))
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
  TH: /th:\s'([\w\-/:\.]+)'/i,
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

export function handleBaseUrlPre(baseName: string){
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


export function getBaseUrlPreString(content){
    const map = {
      "handleBaseUrlPre(basicDataFront)": "/basic",
      "handleBaseUrlPre(channel)": "/channel",
      "handleBaseUrlPre(itemFront)": "/items",
    };
    for (const key in map) {
      if(content.includes(key)){
        return content.replace(key,map[key]);
      }
    }

  return;
}

export const SEPARATOR = "{\n";
export const CONTENT_SEPARATOR = ";\n";
export const CONFIG_CONTENT_SEPARATOR = "children: [";
export const DOU_SEPARATOR = ",\n";
export const ENDSUFFIX=['.tsx','/index.tsx','.js']
export const PREFIX_SUFFIX = ["/posretail", "/pay", "/stock", "/oms-ops"];

export const URLItemHeaders = [
      { header: "接口路径", key: "url", width: 80 },
      { header: "请求方式", key: "method", width: 30 },
      { header: "检查方法", key: "methodNameTodo", width: 30 },
      { header: "权限编码页面或按钮", key: "code", width: 30 },
      { header: "统一资源标识符", key: "path", width: 30 },
      { header: "文件位置", key: "filePath", width: 80 },
      { header: "检查页面Code", key: "codeTodo", width: 30 },
      { header: "引用文件位置", key: "parentPath", width: 30 },
      { header: "是子引用", key: "isSub", width: 30 },
      { header: "是否非菜单页面", key: "hideInMenu", width: 30 },
      { header: "隐藏页面Code", key: "HideInMenuCode", width: 30 },
    ];

export interface IURLITEM {
  url: string;
  code: string;
  method: string;
  codeTodo?: boolean;
  methodNameTodo?: boolean;
  filePath: string;
  isSub?: boolean;
  hideInMenu?: boolean;
  parentPath?: string;
  path: string;
  HideInMenuCode?: string;
}

export function handleConfigUrl(url: string) {
  let result = url;
  if (url.includes("?")) {
    result = result.split("?")[0];
  }
  return result;
}
