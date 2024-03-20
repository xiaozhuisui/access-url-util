/*
 * @Author: Sirius-kk
 * @Date: 2022-07-20 14:02:20
 * @LastEditors: Sirius-kk
 * @LastEditTime: 2022-08-26 10:28:42
 * @FilePath: \configure-platform-front\src\pages\Test\RouteConfig\channel.ts
 */
export default [
  {
    name: '渠道',
    path: '/channel',
    code: 'Channel',
    access: 'canAdmin',
    children: [
      {
        path: '/channel/channel-manage',
        microApp: 'channel',
        name: '渠道管理',
        code: 'Channel_Channel',
        locale: 'menu.channel-manage',
        authority: '',
        children: [
          {
            path: '/channel/channel-manage/sales-channel-view',
            microApp: 'channel',
            name: '销售渠道',
            code: 'Channel_Channel_SaleView',
            access: 'canAdmin',
            exact: true,
            locale: 'menu.channel-manage.sales-channel-view',
            buttons: [
              {
                code: 'virtual_list_27',
                name: '列表查看',
              },
              {
                name: '添加渠道',
                code: 'Channel_Sales_View_add',
              },
              {
                name: '添加客户',
                code: 'Channel_Sales_Customer_add',
              },
              {
                name: '添加店铺',
                code: 'Channel_Sales_Shop_add',
              },
              {
                name: '批量启用渠道',
                code: 'Channel_Sales_View_enableall',
              },
              {
                name: '批量禁用渠道',
                code: 'Channel_Sales_View_disableall',
              },
              {
                name: '批量删除渠道',
                code: 'Channel_Sales_View_delete',
              },
              {
                name: '查看渠道',
                code: 'Channel_Channel_salesChannel_channel',
              },
              {
                name: '查看客户',
                code: 'Channel_Channel_salesChannel_customer',
              },
              {
                name: '查看店铺',
                code: 'Channel_Channel_salesChannel_store',
              },
              {
                name: '编辑渠道',
                code: 'Channel_Sales_View_edit',
              },
              {
                name: '编辑客户',
                code: 'Channel_Sales_Customer_edit',
              },
              {
                name: '编辑店铺',
                code: 'Channel_Sales_Shop_edit',
              },
              {
                name: '解除客户关联',
                code: 'Channel_Sales_Customer_relieve',
              },
              {
                name: '解除店铺关联',
                code: 'Channel_Sales_Shop_relieve',
              },
              {
                name: '销售协议',
                code: 'Channel_Channel_salesChannel_salesagreement',
              },
            ],
          },
          {
            path: '/channel/channel-manage/market-area-view',
            microApp: 'channel',
            name: '营销区域',
            code: 'Channel_Channel_MarketingArea',
            access: 'canAdmin',
            exact: true,
            locale: 'menu.channel-manage.market-area-view',
            buttons: [
              {
                code: 'virtual_list_28',
                name: '列表查看',
              },
              {
                name: '添加区域',
                code: 'Channel_Market_View_add',
              },
              {
                name: '添加客户',
                code: 'Channel_Market_Customer_add',
              },
              {
                name: '添加店铺',
                code: 'Channel_Market_Shop_add',
              },
              {
                name: '批量启用区域',
                code: 'Channel_Market_View_enableall',
              },
              {
                name: '批量禁用区域',
                code: 'Channel_Market_View_disableall',
              },
              {
                name: '批量删除区域',
                code: 'Channel_Market_View_delete',
              },
              {
                name: '查看区域',
                code: 'Channel_Market_View_view',
              },
              {
                name: '查看客户',
                code: 'Channel_Market_Customer_view',
              },
              {
                name: '查看店铺',
                code: 'Channel_Market_Shop_view',
              },
              {
                name: '编辑区域',
                code: 'Channel_Market_View_edit',
              },
              {
                name: '编辑客户',
                code: 'Channel_Market_Customer_edit',
              },
              {
                name: '编辑店铺',
                code: 'Channel_Market_Shop_edit',
              },
              {
                name: '解除客户关联',
                code: 'Channel_Market_Customer_relieve',
              },
              {
                name: '解除店铺关联',
                code: 'Channel_Market_Shop_relieve',
              },
            ],
          },
          {
            path: '/channel/channel-manage/platform-company-file',
            microApp: 'channel',
            name: '平台公司档案',
            code: 'Channel_Channel_PlatformCompany',
            access: 'canAdmin',
            exact: true,
            locale: 'menu.channel-manage.platform-company-file',
            buttons: [
              {
                code: 'virtual_list_29',
                name: '列表查看',
              },
              {
                name: '新建',
                code: 'Channel_Data_Legalperson_add',
              },
              {
                name: '查看',
                code: 'Channel_Data_Legalperson_view',
              },
              {
                name: '编辑',
                code: 'Channel_Data_Legalperson_edit',
              },
            ],
          },
          {
            path: '/channel/channel-manage/platform-company-file/create/:type/:id',
            microApp: 'channel',
            name: '平台公司档案新增',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.platform-company-file-create',
          },
          {
            path: '/channel/channel-manage/platform-company-file/view/:type/:id',
            microApp: 'channel',
            name: '平台公司档案查看',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.platform-company-file-view',
          },
          {
            path: '/channel/channel-manage/platform-company-file/edit/:type/:id',
            microApp: 'channel',
            name: '平台公司档案编辑',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.platform-company-file-edit',
          },
          {
            path: '/channel/channel-manage/supplier-file',
            microApp: 'channel',
            name: '供应商档案',
            code: 'Channel_Channel_Supplier',
            access: 'canAdmin',
            exact: true,
            locale: 'menu.channel-manage.supplier-file',
            buttons: [
              {
                code: 'virtual_list_30',
                name: '列表查看',
              },
              {
                name: '新建',
                code: 'Channel_Partner_Supplier_add',
              },
              {
                name: '批量启用',
                code: 'Channel_Partner_Supplier_enableall',
              },
              {
                name: '批量禁用',
                code: 'Channel_Partner_Supplier_disableall',
              },
              {
                name: '批量删除',
                code: 'Channel_Partner_Supplier_deleteall',
              },
              {
                name: '查看',
                code: 'Channel_Channel_Supplier_details',
              },
              {
                name: '编辑',
                code: 'Channel_Partner_Supplier_edit',
              },
              {
                name: '删除',
                code: 'Channel_Partner_Supplier_delete',
              },
              {
                name: '分配供应商',
                code: 'Channel_Partner_Supplier_assign',
              },
            ],
          },
          {
            path: '/channel/channel-manage/supplier-file/create-supplier-file/:supplierOrgCode/:id/:code',
            microApp: 'channel',
            name: '分配供应商档案',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.distribute-supplier-file',
          },
          {
            path: '/channel/channel-manage/supplier-file/create-supplier-file',
            microApp: 'channel',
            name: '供应商档案新增',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.create-supplier-file',
          },
          {
            path: '/channel/channel-manage/supplier-file/edit-supplier-file/:id/:code',
            microApp: 'channel',
            name: '供应商档案编辑',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.edit-supplier-file',
          },
          {
            path: '/channel/channel-manage/supplier-file/view-supplier-file/:id/:code',
            microApp: 'channel',
            name: '供应商档案查看',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.view-supplier-file',
          },
          {
            path: '/channel/channel-manage/customer-file',
            microApp: 'channel',
            name: '客户档案',
            code: 'Channel_Channel_Customer',
            access: 'canAdmin',
            exact: true,
            locale: 'menu.channel-manage.customer-file',
            buttons: [
              {
                code: 'virtual_list_31',
                name: '列表查看',
              },
              {
                name: '新建',
                code: 'Channel_Partner_Customer_add',
              },
              {
                name: '批量启用',
                code: 'Channel_Partner_Customer_enableall',
              },
              {
                name: '批量禁用',
                code: 'Channel_Partner_Customer_disableall',
              },
              {
                name: '批量删除',
                code: 'Channel_Partner_Customer_deleteall',
              },
              {
                name: '查看',
                code: 'Channel_Channel_Customer_details',
              },
              {
                name: '编辑',
                code: 'Channel_Partner_Customer_edit',
              },
              {
                name: '删除',
                code: 'Channel_Partner_Customer_delete',
              },
              {
                name: '分配客户',
                code: 'Channel_Partner_Customer_assign',
              },
            ],
          },
          {
            path: '/channel/channel-manage/customer-file/create-customer-file/:salesOrgCode/:initialSalesOrgCode/:id/:code',
            microApp: 'channel',
            name: '分配客户档案',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.distribute-customer-file',
          },
          {
            path: '/channel/channel-manage/customer-file/create-customer-file',
            microApp: 'channel',
            name: '客户档案新增',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.create-customer-file',
          },
          {
            path: '/channel/channel-manage/customer-file/edit-customer-file/:id/:code/:initialSalesOrgCode',
            microApp: 'channel',
            name: '客户档案编辑',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.edit-customer-file',
          },
          {
            path: '/channel/channel-manage/customer-file/view-customer-file/:id/:code/:initialSalesOrgCode',
            microApp: 'channel',
            name: '客户档案查看',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.view-customer-file',
          },
          {
            path: '/channel/channel-manage/platform-file',
            microApp: 'channel',
            name: '平台档案',
            code: 'Channel_Channel_Platform',
            access: 'canAdmin',
            exact: true,
            locale: 'menu.channel-manage.platform-file',
            buttons: [
              {
                code: 'virtual_list_32',
                name: '列表查看',
              },
              {
                name: '启用',
                code: 'Channel_Data_Platform_enable',
              },
              {
                name: '禁用',
                code: 'Channel_Data_Platform_disalbe',
              },
            ],
          },
          {
            path: '/channel/channel-manage/shop-file',
            microApp: 'channel',
            name: '店铺档案',
            code: 'Channel_Channel_Store',
            access: 'canAdmin',
            exact: true,
            locale: 'menu.channel-manage.shop-file',
            buttons: [
              {
                code: 'virtual_list_33',
                name: '列表查看',
              },
              {
                name: '新建',
                code: 'Channel_Data_Shop_add',
              },
              {
                name: '批量启用',
                code: 'Channel_Data_Shop_enableall',
              },
              {
                name: '批量禁用',
                code: 'Channel_Data_Shop_disableall',
              },
              {
                name: '批量删除',
                code: 'Channel_Data_Shop_deleteall',
              },
              {
                name: '导入(线下店铺)',
                code: 'Channel_Channel_Platform_input',
              },
              {
                name: '导入结果(线下店铺)',
                code: 'Channel_Channel_Platform_inputresult',
              },
              {
                name: '下载导入文件(线下店铺)',
                code: 'Channel_Channel_Platform_inputresult_downloadinputfile',
              },
              {
                name: '查看',
                code: 'Channel_Channel_Platform_details',
              },
              {
                name: '编辑',
                code: 'Channel_Channel_Platform_edit',
              },
              {
                name: '启用',
                code: 'Channel_Channel_Platform_Enable',
              },
              {
                name: '禁用',
                code: 'Channel_Channel_Platform_disable',
              },
            ],
          },
          {
            path: '/channel/channel-manage/shop-file-import',
            microApp: 'channel',
            name: '店铺导入',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.shop-file-import',
          },
          {
            path: '/channel/channel-manage/shop-file-import-result',
            microApp: 'channel',
            name: '店铺导入结果',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.shop-file-import-result',
          },
          {
            path: '/channel/channel-manage/shop-file-create/:type',
            microApp: 'channel',
            name: '店铺档案新增',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.shop-file-create',
          },
          {
            path: '/channel/channel-manage/shop-file-view/:type/:id/:code',
            microApp: 'channel',
            name: '店铺档案查看',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.shop-file-view',
          },
          {
            path: '/channel/channel-manage/shop-file-edit/:type/:id/:code',
            microApp: 'channel',
            name: '店铺档案编辑',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.shop-file-edit',
          },
          {
            path: '/channel/channel-manage/shop-file/account-detail/:id',
            microApp: 'channel',
            name: '账户详情',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.account-detail',
          },
          {
            path: '/channel/channel-manage/customer-group-file',
            microApp: 'channel',
            name: '客户组列表',
            code: 'Channel_Channel_CustomerGroup',
            access: 'canAdmin',
            exact: true,
            locale: 'menu.channel-manage.customer-group-file',
            buttons: [
              {
                code: 'virtual_list_34',
                name: '列表查看',
              },
              {
                name: '新建',
                code: 'Channel_Partner_CustomerGroup_add',
              },
              {
                name: '批量启用',
                code: 'Channel_Partner_CustomerGroup_enableall',
              },
              {
                name: '批量禁用',
                code: 'Channel_Partner_CustomerGroup_disableall',
              },
              {
                name: '批量删除',
                code: 'Channel_Partner_CustomerGroup_deleteall',
              },
              {
                name: '查看',
                code: 'Channel_Channel_CustomerGroup_details',
              },
              {
                name: '编辑',
                code: 'Channel_Partner_CustomerGroup_edit',
              },
              {
                name: '删除',
                code: 'Channel_Partner_CustomerGroup_delete',
              },
              {
                name: '添加客户',
                code: 'Channel_Channel_CustomerGroup_addcustomer',
              },
              {
                name: '解除关联',
                code: 'Channel_Channel_CustomerGroup_relieverelation',
              },
            ],
          },
          {
            path: '/channel/channel-manage/customer-group-file/create-customer-group-file',
            microApp: 'channel',
            name: '客户组新增',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.create-customer-group-file',
          },
          {
            path: '/channel/channel-manage/customer-group-file/edit-customer-group-file/:id/:code',
            microApp: 'channel',
            name: '客户组编辑',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.edit-customer-group-file',
          },
          {
            path: '/channel/channel-manage/customer-group-file/view-customer-group-file/:id/:code',
            microApp: 'channel',
            name: '客户组查看',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.view-customer-group-file',
          },
          {
            path: '/channel/channel-manage/online-store-authorization',
            code: 'Channel_Channel_StoreAuthorization',
            access: 'canAdmin',
            microApp: 'channel',
            name: '网店授权',
            exact: true,
            locale: 'menu.channel-manage.online-store-authorization',
            buttons: [
              {
                code: 'virtual_list_35',
                name: '列表查看',
              },
              {
                name: '授权',
                code: 'Channel_Data_Jurisdiction_grant',
              },
              {
                name: '取消授权',
                code: 'Channel_Data_Jurisdiction_cancelGrant',
              },
            ],
          },
          {
            path: '/channel/channel-manage/online-store-authorization/detail/:code/:id/:name',
            microApp: 'channel',
            name: '网店授权详情',
            hideInMenu: true,
            exact: true,
            locale: 'menu.channel-manage.online-store-authorization-detail',
          },
        ],
      },
      // {
      //   "path": "/channel/store-manage",
      //   "microApp": "channel",
      //   "name": "店铺管理",
      //   "code": "Channel_Store",
      //   "locale": "menu.store-manage",
      //   "authority": "",
      //   "children": [
      //     {
      //       "path": "/channel/store-manage/shop-file",
      //       "microApp": "channel",
      //       "name": "店铺档案",
      //       "code": "Channel_Store_Shopfile",
      //       "access": "canAdmin",
      //       "exact": true,
      //       "locale": "menu.store-manage.shop-file"
      // "buttons": [{
      //   code: 'virtual_list_36',
      //   name: '列表查看'
      // },{
      //   name: '新建',
      //   code: 'Channel_StoreManage_Shop_add'
      // }, {
      //   name: '批量启用',
      //   code: 'Channel_StoreManage_Shop_enableall'
      // }, {
      //   name: '批量禁用',
      //   code: 'Channel_StoreManage_Shop_disableall'
      // }, {
      //   name: '启用',
      //   code: 'Channel_StoreManage_Shop_enable'
      // }, {
      //   name: '编辑',
      //   code: 'Channel_StoreManage_Shop_edit'
      // }, {
      //   name: '禁用',
      //   code: 'Channel_StoreManage_Shop_disable'
      // },]
      //     },
      //     {
      //       "path": "/channel/store-manage/shop-file/create/:id",
      //       "microApp": "channel",
      //       "name": "店铺档案新增",
      //       "hideInMenu": true,
      //       "exact": true,
      //       "locale": "menu.store-manage.shop-file-create"
      //     },
      //     {
      //       "path": "/channel/store-manage/shop-file/:type/:id/:code",
      //       "microApp": "channel",
      //       "name": "店铺档案查看",
      //       "hideInMenu": true,
      //       "exact": true,
      //       "locale": "menu.store-manage.shop-file-view"
      //     },
      //     {
      //       "path": "/channel/store-manage/shop-file/:type/:id/:code",
      //       "microApp": "channel",
      //       "name": "店铺档案编辑",
      //       "hideInMenu": true,
      //       "exact": true,
      //       "locale": "menu.store-manage.shop-file-edit"
      //     }
      //   ]
      // },
      {
        path: '/channel/price-management',
        microApp: 'channel',
        name: '渠道授权',
        code: 'Channel_Authorization',
        locale: 'menu.price-management',
        authority: '',
        children: [
          {
            path: '/channel/price-management/sales-agreement',
            microApp: 'channel',
            name: '销售协议',
            code: 'Channel_Authorization_Contract',
            exact: true,
            locale: 'menu.price-management.sales-agreement',
            buttons: [
              {
                code: 'virtual_list_37',
                name: '列表查看',
              },
              {
                name: '新建协议',
                code: 'Channel_Authorization_Contract_add',
              },
              {
                name: '查看',
                code: 'Channel_Authorization_Contract_details',
              },
              {
                name: '编辑',
                code: 'Channel_Authorization_Contract_edit',
              },
              {
                name: '提交',
                code: 'Channel_Authorization_Contract_submit',
              },
              {
                name: '审核',
                code: 'Channel_Authorization_Contract_examine',
              },
              {
                name: '删除',
                code: 'Channel_Authorization_Contract_delete',
              },
              {
                name: '复制',
                code: 'Channel_Authorization_Contract_copy',
              },
              {
                name: '作废',
                code: 'Channel_Authorization_Contract_void',
              },
              {
                name: '撤回',
                code: 'Channel_Authorization_Contract_withdraw',
              },
            ],
          },
          {
            path: '/channel/price-management/sales-agreement/create-sales-agreement/:type',
            microApp: 'channel',
            name: '新建销售协议',
            hideInMenu: true,
            exact: true,
            locale: 'menu.price-management.create-sales-agreement',
          },
          {
            path: '/channel/price-management/sales-agreement/create-sales-agreement/:type/:id',
            microApp: 'channel',
            name: '新建销售协议',
            hideInMenu: true,
            exact: true,
            locale: 'menu.price-management.create-sales-agreement',
          },
          {
            path: '/channel/price-management/sales-agreement/edit-sales-agreement-1/:type/:id',
            microApp: 'channel',
            name: '编辑销售协议',
            hideInMenu: true,
            exact: true,
            locale: 'menu.price-management.edit-sales-agreement',
          },
          {
            path: '/channel/price-management/sales-agreement/edit-sales-agreement-2/:type/:id',
            microApp: 'channel',
            name: '编辑销售协议',
            hideInMenu: true,
            exact: true,
            locale: 'menu.price-management.edit-sales-agreement',
          },
          {
            path: '/channel/price-management/sales-agreement/view-sales-agreement-1/:type/:id',
            microApp: 'channel',
            name: '查看销售协议',
            hideInMenu: true,
            exact: true,
            locale: 'menu.price-management.view-sales-agreement',
          },
          {
            path: '/channel/price-management/sales-agreement/view-sales-agreement-2/:type/:id',
            microApp: 'channel',
            name: '查看销售协议',
            hideInMenu: true,
            exact: true,
            locale: 'menu.price-management.view-sales-agreement',
          },
          {
            path: '/channel/price-management/sort-price-adjustment/:downCode/:upCode',
            microApp: 'channel',
            name: '调价单排序',
            hideInMenu: true,
            exact: true,
            locale: 'menu.price-management.price_soter',
          },
          {
            path: '/channel/price-management/purchase-price-adjustment',
            microApp: 'channel',
            name: '采购调价单',
            access: 'canAdmin',
            code: 'Channel_Authorization_PurchaseModify',
            exact: true,
            locale: 'menu.price-management.purchase-price-adjustment',
            buttons: [
              {
                code: 'virtual_list_38',
                name: '列表查看',
              },
              {
                name: '添加采购调价单',
                code: 'Channel_Price_Purchase_add',
              },
              {
                name: '优先级设置',
                code: 'Channel_Price_Purchase_Priority',
              },
              {
                name: '编辑',
                code: 'Channel_Price_Purchase_edit',
              },
              {
                name: '提交',
                code: 'Channel_Price_Purchase_submit',
              },
              {
                name: '删除',
                code: 'Channel_Price_Purchase_delete',
              },
              {
                name: '审核',
                code: 'Channel_Price_Purchase_auto',
              },
              {
                name: '作废',
                code: 'Channel_Price_Purchase_cancel',
              },
              {
                name: '撤销',
                code: 'Channel_Price_Purchase_back',
              },
            ],
          },
          {
            path: '/channel/price-management/purchase-price-adjustment/view/:id/:code',
            microApp: 'channel',
            name: '查询采购调价单',
            hideInMenu: true,
            exact: true,
            locale: 'menu.price-management.view-purchase-price-adjustment',
          },
          {
            path: '/channel/price-management/purchase-price-adjustment/create',
            microApp: 'channel',
            name: '新增采购调价单',
            hideInMenu: true,
            exact: true,
            locale: 'menu.price-management.create-purchase-price-adjustment',
          },
          {
            path: '/channel/price-management/purchase-price-adjustment/edit/:id/:code',
            microApp: 'channel',
            name: '编辑采购调价单',
            hideInMenu: true,
            exact: true,
            locale: 'menu.price-management.edit-purchase-price-adjustment',
          },
          {
            path: '/channel/price-management/sales-price-adjustment',
            microApp: 'channel',
            name: '销售调价单',
            access: 'canAdmin',
            code: 'Channel_Authorization_SaleModify',
            exact: true,
            locale: 'menu.price-management.sales-price-adjustment',
            buttons: [
              {
                code: 'virtual_list_39',
                name: '列表查看',
              },
              {
                name: '添加销售调价单',
                code: 'Channel_Price_Sale_add',
              },
              {
                name: '优先级设置',
                code: 'Channel_Price_Sale_Priority',
              },
              {
                name: '编辑',
                code: 'Channel_Price_Sale_edit',
              },
              {
                name: '提交',
                code: 'Channel_Price_Sale_submit',
              },
              {
                name: '删除',
                code: 'Channel_Price_Sale_delete',
              },
              {
                name: '审核',
                code: 'Channel_Price_Sale_auto',
              },
              {
                name: '作废',
                code: 'Channel_Price_Sale_cancel',
              },
              {
                name: '撤销',
                code: 'Channel_Price_Sale_back',
              },
            ],
          },
          {
            path: '/channel/price-management/sales-price-adjustment/view/:id/:code',
            microApp: 'channel',
            name: '查看销售调价单',
            hideInMenu: true,
            exact: true,
            locale: 'menu.price-management.view-sales-price-adjustment',
          },
          {
            path: '/channel/price-management/sales-price-adjustment/create',
            microApp: 'channel',
            name: '新增销售调价单',
            hideInMenu: true,
            exact: true,
            locale: 'menu.price-management.create-sales-price-adjustment',
          },
          {
            path: '/channel/price-management/sales-price-adjustment/edit/:id/:code',
            microApp: 'channel',
            name: '编辑销售调价单',
            hideInMenu: true,
            exact: true,
            locale: 'menu.price-management.edit-sales-price-adjustment',
          },
          // 功能未完善 暂时隐藏
          // {
          //   "path": "/channel/price-management/settle-price-adjustment",
          //   "microApp": "channel",
          //   "name": "结算调价单",
          //   "access": "canAdmin",
          //   "code": "Channel_Authorization_SettleModify",
          //   "exact": true,
          //   "locale": "menu.price-management.settle-price-adjustment"
          // },
          // {
          //   "path": "/channel/price-management/settle-price-adjustment/view/:id/:code",
          //   "microApp": "channel",
          //   "name": "查看结算调价单",
          //   "hideInMenu": true,
          //   "exact": true,
          //   "locale": "menu.price-management.view-settle-price-adjustment"
          // },
          // {
          //   "path": "/channel/price-management/settle-price-adjustment/create",
          //   "microApp": "channel",
          //   "name": "新增结算调价单",
          //   "hideInMenu": true,
          //   "exact": true,
          //   "locale": "menu.price-management.create-settle-price-adjustment"
          // },
          // {
          //   "path": "/channel/price-management/settle-price-adjustment/edit/:id/:code",
          //   "microApp": "channel",
          //   "name": "编辑结算调价单",
          //   "hideInMenu": true,
          //   "exact": true,
          //   "locale": "menu.price-management.edit-settle-price-adjustment"
          // },
          {
            path: '/channel/price-management/retail-price-adjustment',
            microApp: 'channel',
            name: '零售调价单',
            access: 'canAdmin',
            code: 'Channel_Authorization_RetailModify',
            exact: true,
            locale: 'menu.price-management.retail-price-adjustment',
            buttons: [
              {
                code: 'virtual_list_40',
                name: '列表查看',
              },
              {
                name: '添加零售调价单',
                code: 'Channel_Price_Retail_add',
              },
              {
                name: '优先级设置',
                code: 'Channel_Price_Retail_Priority',
              },
              {
                name: '编辑',
                code: 'Channel_Price_Retail_edit',
              },
              {
                name: '提交',
                code: 'Channel_Price_Retail_submit',
              },
              {
                name: '删除',
                code: 'Channel_Price_Retail_delete',
              },
              {
                name: '审核',
                code: 'Channel_Price_Retail_auto',
              },
              {
                name: '作废',
                code: 'Channel_Price_Retail_cancel',
              },
              {
                name: '撤销',
                code: 'Channel_Price_Retail_back',
              },
            ],
          },
          {
            path: '/channel/price-management/retail-price-adjustment/view/:id/:code',
            microApp: 'channel',
            name: '查看零售调价单',
            hideInMenu: true,
            exact: true,
            locale: 'menu.price-management.view-retail-price-adjustment',
          },
          {
            path: '/channel/price-management/retail-price-adjustment/create',
            microApp: 'channel',
            name: '新增零售调价单',
            hideInMenu: true,
            exact: true,
            locale: 'menu.price-management.create-retail-price-adjustment',
          },
          {
            path: '/channel/price-management/retail-price-adjustment/edit/:id/:code',
            microApp: 'channel',
            name: '编辑零售调价单',
            hideInMenu: true,
            exact: true,
            locale: 'menu.price-management.edit-retail-price-adjustment',
          },
          {
            path: '/channel/price-management/current-price-query',
            microApp: 'channel',
            name: '现行价查询',
            access: 'canAdmin',
            code: 'Channel_Authorization_CurrentPriceQuery',
            exact: true,
            locale: 'menu.price-management.current-price-query',
          },
          {
            path: '/channel/price-management/control-sale-query',
            microApp: 'channel',
            name: '综合控销查询',
            access: 'canAdmin',
            code: 'Channel_Authorization_ControlSaleQuery',
            exact: true,
            locale: 'menu.price-management.control-sale-query',
          },
        ],
      },
      // 功能未完善 暂时隐藏
      // 暂时测试 先放出来
      {
        microApp: 'channel',
        name: '小程序',
        code: 'Channel_App',
        access: 'canAdmin',
        path: '/channel/app-let',
        locale: 'menu.app-let',
        authority: '',
        children: [
          {
            path: '/channel/app-let/store-decoration',
            microApp: 'channel',
            name: '店铺装修',
            code: 'Channel_App_Home',
            access: 'canAdmin',
            exact: true,
            locale: 'menu.app-let.store-decoration',
          },
          {
            path: '/channel/app-let/store-decoration/detail/:id/:type',
            hideInMenu: true,
            microApp: 'channel',
            name: '店铺装修-详情',
            exact: true,
            locale: 'menu.app-let.store-decoration-detail',
          },
          {
            path: '/channel/app-let/store-category-list',
            microApp: 'channel',
            name: '商城类目模板',
            code: 'Channel_App_MallCategory',
            access: 'canAdmin',
            exact: true,
            locale: 'menu.app-let.store-category-list',
            buttons: [
              {
                code: 'virtual_list_41',
                name: '列表查看',
              },
              {
                name: '编辑',
                code: 'Channel_ShopCategory_edit',
              },
              {
                name: '设置商城模板',
                code: 'Channel_ShopCategory_enable',
              },
              {
                name: '复制模板',
                code: 'Channel_ShopCategory_copy',
              },
              {
                name: '类目树',
                code: 'Channel_ShopCategory_category',
              },
            ],
          },
          // 类目树
          {
            path: '/channel/app-let/store-category-list/category-tree/:id/:frontCategoryLevel',
            microApp: 'channel',
            hideInMenu: true,
            name: '商城类目模板-类目树',
            exact: true,
            locale: 'menu.app-let.category-tree',
          },
        ],
      },
    ],
  },
];
