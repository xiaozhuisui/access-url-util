import moment from "moment";
const XLSX = require("xlsx");
import * as path from "path";
import * as fs from "fs";
const Excel = require("exceljs");

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
  let worksheet = workbook.addWorksheet('子应用书局');

  // 添加表头
  worksheet.columns = columns
  // 添加数据行
  dataSource.forEach(item => {
    worksheet.addRow(item)
  })

  // 设置每列的宽度
  worksheet.columns.forEach((column) => {
    column.width = Math.max(column.header.length, 100); // 设置列宽至少12个字符
  });

  // 保存工作簿到硬盘
  workbook.xlsx.writeFile(EXCEL_FILE_NAME);
}

export function readExcel(pathString = EXCEL_FILE_NAME, index = 0) {
  // const workBook = xlsx.readFile(path.join(__dirname, EXCEL_FILE_NAME));
  // // 获取第一个工作表
  // const sheetName = workBook.SheetNames[index];
  // const worksheet = workBook.Sheets[sheetName];
  // const data = xlsx.utils.sheet_to_json(worksheet);
  // return data;
}

export const REGEX = {
  COMPONENT: /component:\s'\.\/([\w/]+)'/i,
  PATH: /path:\s'([\w\-/:\.]+)'/i,
  CODE: /code:\s'([a-zA-Z0-9-_]+)'/i,
  ANNOTATION_CODE: /\/\/code:\s'([a-zA-Z0-9-_]+)'/i,
  NAME: /name:\s'([a-zA-Z0-9-_]+)'/i,
  ANNOTATION: /\/\//g,
};

export const SEPARATOR = "{\n";
