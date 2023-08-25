### 插件使用指南
方式1
pnpm add bs-i18n-access-utils
在项目最外层编写一个 i18n.ts 文件 里面写入如下代码
```
const { i18nUtil } = require('bs-i18n-access-utils');

function  createI18n() {
i18nUtil('src/pages/OrderManagement/SalesOrderList/components', [
{
fileName:  'json-view.tsx',
},
{
fileName:  'logistics-track.tsx',
},
{
fileName:  'waybill-description-info.tsx',
},
]);

}
createI18n();
```


接下来 在当前命令直接 node ./i18n.ts

方式2 推荐

npm i bs-i18n-access-utils -g

在命令行

i18n src/pages/OrderManagement/SalesOrderList/components

即可生成多语言 但是如果中文写得不标准 如加入英文的符号等等  会错乱
