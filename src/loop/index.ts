
import { CONTENT_SEPARATOR, DOU_SEPARATOR, ENDSUFFIX, IURLITEM, PREFIX_SUFFIX, REGEX, SEPARATOR, getComponentPath, getFileAbsolutePath, getHideInMenu, getTargetCode, getTargetURIPath, getUrlString, readExcel, updateExcel } from "@/utils/index";

import * as path from "path";
const fs = require("fs");

const { program } = require("commander");
const { exec } = require("child_process");
const packageJson = require("/package.json");

export interface IFilesExcelDataListItem {
  code: string;
  path: string; //url
  filePath: string; //文件位置
  hideInMenu?: boolean;
}

const urlExcelDataList: IURLITEM[] = [];
const filerGatherSubComponentsPathList:string[]=[]


function handleFileContentJSONString(
  fileContent: string,
  filePath: string,
  isHideInMenu: boolean,
  code:string,
  uri:string,
  isSub?:boolean,
  parentPath?:string
) {
  let fileContentStringArray: any = fileContent.split(CONTENT_SEPARATOR);
  fileContentStringArray = fileContentStringArray.map((item, index) => {
    return item.split(DOU_SEPARATOR);
  }).flat(Infinity)
  const gatherSubComponentsPath:string[]=[]
  fileContentStringArray.forEach((item, index) => {
    // debugger
    // 被注释的
    // todo
    if (!item||(item?.match(REGEX.ANNOTATION) as any[])?.length) {
      return item;
    }
    // const componentsStringObj = item.match(REGEX.IMPORT);
    // 子组件的路径
    // const componentsPath = componentsStringObj?.[1];
    const componentsPath = getComponentPath(item).replaceAll("'", "");
    // debugger
    if (componentsPath) {
      gatherSubComponentsPath.push(componentsPath);
    }
    // const URLStringObj = item.match(REGEX.URL);
    const URLString = getUrlString(item);
    // if (URLStringObj?.length) {
    //   debugger
    // }
    const codeNameList: string[] = [];
    if(code){
    codeNameList.push(code);
  }
    let methodName: string = "";
    if (URLString) {
      for (let idx = Math.max(0, index - 5); idx < index + 5; idx++) {
        const codeName = fileContentStringArray[idx]?.match(REGEX.CODE)?.[1];
        if (codeName?.trim?.() && !isHideInMenu) {
          codeNameList.push(codeName as string);
        }
        if (idx > index) {
          try {
            const str = fileContentStringArray[idx];
            const resultMethod = (
              str?.match(REGEX.METHOD)?.[1] as string
            )?.toLocaleLowerCase?.();
            if (resultMethod) {
              methodName = resultMethod;
            }
          } catch (error) {
            debugger;
          }
        }
      }
      urlExcelDataList.push({
        code: codeNameList.join(" | "),
        url: URLString.replace("'",""),
        method: methodName||"get",
        codeTodo: codeNameList.length > 2,
        methodNameTodo:methodName?false:true,
        filePath:filePath.split("/src")[1],
        isSub,
        path:uri,
        hideInMenu:isHideInMenu,
        parentPath:parentPath?.split("/src")?.[1]
      });
    }
  });
  const filerGatherSubComponentsPath=gatherSubComponentsPath.filter(item=>!item.includes('.less')||!item.includes('.svg')).map(item=>item.replaceAll("'",''))
  if (filerGatherSubComponentsPath.length) {
    filerGatherSubComponentsPathList.push(JSON.stringify(gatherSubComponentsPath))
    const childProcess = exec(
      "npx prettier -w " +
        filerGatherSubComponentsPath
          .map((item) =>{
            const targetPathArray = (filePath as string).split("/");
            targetPathArray.pop()
            const targetPath=targetPathArray.join("/")
            return [".ts", ...ENDSUFFIX]
              .map((subffix) => path.join(targetPath, item, subffix).replace('/.tsx', '.tsx'))
              .join(" ")}
          )
          .join(" ")
    );
    childProcess.stdout.on("data", (data: string) => {
      data.split("ms\n").forEach((cFilePath) => {
        if (cFilePath) {
          const targetFilePath = getFileAbsolutePath(cFilePath.split(" ")[0])
          let fileContentJSONString: string = fs.readFileSync(
            targetFilePath,
            "utf8"
          );
          // console.log(101)
          // console.log(getFileAbsolutePath(filePath.split(" ")[0]))
          // console.log(fileContentJSONString)
          // console.log(filePath)
          // console.log(isHideInMenu)
          // console.log(code)
          if (!fileContentJSONString) return;
          handleFileContentJSONString(fileContentJSONString,targetFilePath,isHideInMenu,code,uri,true,filePath)
        }
      });
    });
    childProcess.on("close", () => {
      // console.log(urlExcelDataList)
      function checkMethod(url: string) {
        const checkList = ["list", "get", "detail", "List","qp-"];
        return checkList.some((item) => url.includes(item));
      }
      const dataSource = urlExcelDataList.map((item) => ({
        ...item,
        methodNameTodo:
          item.method === "get" && checkMethod(item.url)
            ? false
            : item.methodNameTodo,
      }));
      const headers = [
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
      setTimeout(() => {
        updateExcel(headers, [...dataSource,{url:filerGatherSubComponentsPathList}]);
      }, 5000);
    })
  }
}

function handleGatherUrlData(dataSource:IFilesExcelDataListItem[],filePath: string) {
  let fileContentJSONString: string = fs.readFileSync(
    getFileAbsolutePath(filePath),
    "utf8"
  );

  const isHideInMenu = getHideInMenu(dataSource, filePath.replace("./src", ""));
  const code = getTargetCode(dataSource, filePath.replace("./src", ""));
  const uriPath = getTargetURIPath(dataSource, filePath.replace("./src", ""))
  if (!fileContentJSONString?.trim?.()) return;
  // debugger
  handleFileContentJSONString(
    fileContentJSONString,
    getFileAbsolutePath(filePath),
    isHideInMenu,
    code,
    uriPath
  );
}

async function processLoop() {
  // const { confirm } = await inquirer.prompt([
  //   {
  //     type: "confirm",
  //     name: "confirm",
  //     message: "将进行代码格式化以及权限处理 请进行代码备份！",
  //     default: false,
  //   },
  // ]);
  // if (!confirm) {
  //   // 终止线程
  //   process.exit(1);
  // }

  const dataSource = await readExcel<IFilesExcelDataListItem>([
    "path",
    "code",
    "filePath",
    "hideInMenu",
  ]);
  console.log('dataSource',dataSource.length)
  console.log('期望解析的文件',dataSource
        .map((item) =>
          ENDSUFFIX
            .map((subffix) =>
              getFileAbsolutePath(`./src/${item.filePath}${subffix}`)
            )
            .join(" ")
        )
        .join(" "))
  console.log(
    '组合后的版本',
    dataSource.map((item) =>
      ENDSUFFIX.map((subffix) =>
        getFileAbsolutePath(`./src/${item.filePath}${subffix}`)
      ).join(" ")
    ).length
  );
  const childProcess = exec(
    "npx prettier -w " +
      dataSource
        .map((item) =>
          ENDSUFFIX
            .map((subffix) =>
              getFileAbsolutePath(`./src/${item.filePath}${subffix}`)
            )
            .join(" ")
        )
        .join(" ")
  );
  childProcess.stdout.on("data", (data: string) => {
    console.log("解析的文件",data);
    console.log('本次数量',data.split("ms\n").length)
    console.log('本次数量',data.split("ms\n"))
    data.split("ms\n").filter(i=>i).forEach((filePath) => {
      if (filePath) {
        console.log(
          `正在格式化文件并准备处理文件: ${filePath.split(" ")[0]}\n`
        );
        // console.log(`${filePath.split(" ")[0]}`);
        handleGatherUrlData(dataSource,`./${filePath.split(" ")[0]}`);
      }
    });
  });
}

function loop() {
  program
    .version(packageJson.version, "-v", "--version")
    .requiredOption("-p, --public <public>", "子应用公共路径 如 /retail")
    .description("路由配置code以及扫描对应路径工具 power by zhuisui")
    .action((params) => {
      processLoop();
    })
    .parse(process.argv);
}
export { loop };
