
import { CONFIG_CONTENT_SEPARATOR, CONTENT_SEPARATOR, DOU_SEPARATOR, ENDSUFFIX, IURLITEM, PREFIX_SUFFIX, REGEX, SEPARATOR, getComponentPath, getFileAbsolutePath, getHideInMenu, getTargetCode, getTargetURIPath, getUrlString, handleConfigUrl, readExcel, updateExcel } from "@/utils/index";
const fs = require("fs");
import sourceTree from './model'
const { program } = require("commander");
const { exec } = require("child_process");
const packageJson = require("/package.json");
let componentData:any[]=[]
export interface IFilesExcelDataListItem {
  code: string;
  path: string; //url
  filePath: string; //文件位置
  hideInMenu?: boolean;
}


function loopSourceTree(
  sourceTree: any,
  dataSource: Record<string,IFilesExcelDataListItem[]>,
) {
  sourceTree.forEach((item: any) => {
    const targetDataItem= dataSource[item?.path]
    const code = componentData.find(fItem=>(fItem.path===item.path))?.code
    if (item.code !== code) {
      item.code = code || "code不存在";
    }
    if (item.children) {
      loopSourceTree(item.children, dataSource);
    } else if (item.buttons||targetDataItem) {
      targetDataItem?.forEach((tItem: any) => {
        tItem.url = handleConfigUrl(tItem.url);
        if (tItem.code) {
          const button = item?.buttons?.find(
            (button: any) => tItem.code === button.code
          );
          if (button) {
            if (button.api) {
              if (
                !button.api.find(
                  (item) => item.path === tItem.url&&
                  item.method === tItem.method
                )
              ) {
                button.api.push({ method: tItem.method, path: tItem.url });
              }
            } else {
              button.api = [{ method: tItem.method, path: tItem.url }];
            }
          } else {
            if (item.api) {
              if (
                !item.api.find(
                  (item) =>
                    item.path === tItem.url && item.method === tItem.method
                )
              ) {
                item.api.push({ method: tItem.method, path: tItem.url });
              }
            } else {
              item.api = [{ method: tItem.method, path: tItem.url }];
            }
          }
        } else {
          if (item.api) {
            item.api.push({ method: tItem.method, path: tItem.url });
          } else {
            item.api = [{ method: tItem.method, path: tItem.url }];
          }
        }
      });

    }
  });
}

function handleDataSource(
  dataSource: IFilesExcelDataListItem[]
): Record<string, IFilesExcelDataListItem[]> {
  const result: Record<string, IFilesExcelDataListItem[]> = {};
  dataSource.forEach((item) => {
    const { path } = item;
    const pathList = path.split(" & ");
    item.code = item.code.trim().split(" ").pop()||"";
    pathList.forEach((uri) => {
      if(result[uri]){
        result[uri].push(item)
      }else{
        result[uri] = [item]}
    })
  })
  return result;
}

async function handleConfigRouteContent(dataSource:IFilesExcelDataListItem[],filePath: string,sourceTree:any) {
  // let fileContentJSONString: string = fs.readFileSync(
  //   getFileAbsolutePath(filePath),
  //   "utf8"
  // );
  const resultDataSource: Record<string, IFilesExcelDataListItem[]> =
    handleDataSource(dataSource);
  loopSourceTree(sourceTree, resultDataSource);
  console.log(sourceTree)
  fs.writeFileSync(filePath, JSON.stringify(sourceTree));



}

async function processConfig() {
    componentData = await readExcel<IFilesExcelDataListItem>([
    "path",
    "code",
    "filePath",
    "hideInMenu",
  ]);
  const dataSource = await readExcel<IFilesExcelDataListItem>([
    "url",
    "method",
    "methodNameTodo",
    "code",
    "path",
    'filePath',
    "codeTodo",
    'parentPath',
    'isSub',
    'hideInMenu',
  ],2);
  const Map={"distribution":"drp"}
  const npxPrettier="npx prettier -w " +
      process.cwd() +"/src/pages/Test/RouteConfig/"+
      (Map[process.argv[process.argv.length - 1].slice(1)] ||
        process.argv[process.argv.length - 1].slice(1)) +
      ".ts"
  handleConfigRouteContent(
    dataSource,
    process.cwd() +
      "/src/pages/Test/RouteConfig/" +
      (Map[process.argv[process.argv.length - 1].slice(1)] ||
        process.argv[process.argv.length - 1].slice(1)) +
      ".ts",
    sourceTree
  );
  const childProcess = exec(
    npxPrettier
  );
  childProcess.stdout.on("data", (data: string) => {
    console.log("解析的文件",data);

  });
}

function config() {
  program
    .version(packageJson.version, "-v", "--version")
    .requiredOption("-p, --public <public>", "子应用公共路径 如 /retail")
    .description("路由配置code以及扫描对应路径工具 power by zhuisui")
    .action((params) => {
      processConfig();
    })
    .parse(process.argv);
}
export { config };
