import * as path from "path";
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

export async function readExcel(
  pathString = EXCEL_FILE_NAME,
  index = 1
) {
  const workbook = new Excel.Workbook();

  // 读取Excel文件
  await workbook.xlsx.readFile(pathString);

  return workbook
  // 获取第一个工作表
  const worksheet = workbook.getWorksheet(index);

  // 遍历工作表中的所有行
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    console.log(`Row ${rowNumber}:${row._cells}`);
  });
}

export const REGEX = {
  COMPONENT: /component:\s'\.\/([\w/]+)'/i,
  PATH: /path:\s'([\w\-/:\.]+)'/i,
  CODE: /code:\s'([a-zA-Z0-9-_]+)'/i,
  ANNOTATION_CODE: /\/\/code:\s'([a-zA-Z0-9-_]+)'/i,
  NAME: /name:\s'([a-zA-Z0-9-_]+)'/i,
  ANNOTATION: /\/\//g,
  HIDEINMENU: /hideInMenu:\s*true/i,
};

export const SEPARATOR = "{\n";
