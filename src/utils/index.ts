import moment from 'moment';
import * as xlsx from 'xlsx';
import * as path from "path";
// 获取文件路径;
export function getFileAbsolutePath(dir: string) {
  return path.join(process.cwd(), dir);
}

const EXCEL_FILE_NAME = "access.xlsx";

export function createExcel(name = "access.xlsx", resultList) {
  const workBook = xlsx.utils.book_new();
  const workSheet = xlsx.utils.json_to_sheet(resultList);
  // 3. 将工作表放入工作簿中
  xlsx.utils.book_append_sheet(workBook, workSheet);
  // const a = process
  // console.log(a)
  // const envMap={local:'本地',dev:'开发',test:'测试',pre:'预发',prod:'生产',pet:'压测'}
  // 4. 生成数据保存
  const outputPath = path.join(__dirname,EXCEL_FILE_NAME);
  xlsx.writeFile(workBook, outputPath, {
    bookType: "xlsx",
  });
}

export function readExcel(pathString = EXCEL_FILE_NAME,index=0) {
  const workBook = xlsx.readFile(path.join(__dirname, EXCEL_FILE_NAME));
  // 获取第一个工作表
  const sheetName = workBook.SheetNames[index];
  const worksheet = workBook.Sheets[sheetName];

  const data = xlsx.utils.sheet_to_json(worksheet);
  return data;
}

export const REGEX = {
  COMPONENT: /component:\s'\.\/([\w/]+)'/i,
  PATH: /path:\s'([\w\-/:\.]+)'/i,
  CODE: /code:\s'([a-zA-Z0-9-_]+)'/i,
  ANNOTATION_CODE: /\/\/code:\s'([a-zA-Z0-9-_]+)'/i,
  NAME: /name:\s'([a-zA-Z0-9-_]+)'/i,
  ANNOTATION:/\/\//g
};

export const SEPARATOR = "{\n";
