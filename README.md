## 目录

```bash
├── config                   # umi 配置，包含路由，构建等配置
├── mock                     # 本地模拟数据
├── public
│   └── favicon.png          # Favicon
├── src
│   ├── .umi                 # 启动服务时，自动生成的（开发中不用管它）
│   ├── assets               # 本地静态资源
│   ├── components           # 业务通用组件
│   ├── e2e                  # 集成测试用例
│   ├── locales              # 国际化资源
│   ├── layouts              # 通用布局（如果需要自定义布局的话，添加此文件夹）
│   ├── models               # 全局 dva model（如果需要使用全局dva数据源，就添加此文件夹）
│   ├── pages                # 业务页面入口和常用模板
│   ├── services             # 后台接口服务
│   ├── utils                # 工具库
│   ├── access.ts            # 配置用户模块权限（https://beta-pro.ant.design/docs/authority-management-cn）
│   ├── app.ts               # 运行时全局配置
│   ├── global.tsx           # 开发时全局配置
│   ├── global.less          # 全局样式
│   └── global.ts            # 全局 js
├── tests                    # 测试工具
├── README.md
└── package.json
```

## 删除国际化配置

- 大部分项目我们一般用不到国际化，不想用就按如下一步步删除，按如下处理完后，重新启动服务

```bash
# 1. 运行脚本
yarn i18n-remove
# 2. config/config.ts 添加 `locale: {}`
{
  ...略
  locale: {}
  ...略
}
# 3. 删除 global.tsx 里的所有内容（ 或者使用useIntl这个函数的地方 ）

# 4. 打开 pages/user/login（想懒省事直接把这个文件重写）
  # 4.1 删除 这3个导入 import { useIntl, FormattedMessage, SelectLang } from 'umi';
  # 4.2 删除 <div className={styles.lang}>{SelectLang && <SelectLang />}</div>
  # 4.3 删除 const intl = useIntl();
  # 4.4 删除 intl.formatMessage() 函数以及传入的参数的调用，直接先改成字符串
  # 4.5 components 文件夹下，删除使用 SelectLang 的组件，以及与其相关的引用

# 此时 .umi 文件报错

# 5. 在src/locales文件夹中 只留下 zh-CN.ts文件, 里边内容默认导出一个空对象
export default {};

# 6. 在config/defaultSettins.ts 中 添加 menu 属性，以解决控制台上菜单的警告，如下
{
  ...其它省略
  menu: {
    locale: false,
  },
  ...其它省略
}
```

### e2e 文件夹， 单元测试用的，不需要你可以直接删除掉

### tests 文件夹， 测试专用，不需要你可以直接删除掉

### 只要是 xx.test.xx 的文件你都可以删除掉，都是与单元测试相关的

## 删除后的目录

```bash
├── config                   # umi 配置，包含路由，构建等配置
├── mock                     # 本地模拟数据
├── public
│   └── favicon.png          # Favicon
├── src
│   ├── .umi                 # 启动服务时，自动生成的（开发中不用管它）
│   ├── assets               # 本地静态资源
│   ├── components           # 业务通用组件
│   ├── locales              # 国际化资源
│   ├── pages                # 业务页面入口和常用模板
│   ├── services             # 后台接口服务
│   ├── utils                # 工具库
│   ├── access.ts            # 配置用户模块权限（https://beta-pro.ant.design/docs/authority-management-cn）
│   ├── app.ts               # 运行时全局配置
│   ├── global.tsx           # 开发时全局配置
│   ├── global.less          # 全局样式
│   └── global.ts            # 全局
├── README.md
└── package.json
```

## 如果你不想使用本地的 mock 服务，使用如下启动命令

```bash
yarn dev
```

## 解决不用本地 mock 时，接口调用报错问题（此时已经没有接口了，直接把调接口的地方干掉）

#### 1. 在 src/pages/user/login 下，直接调 goto() 方法

```js
const handleSubmit = async (values: LoginParamsType) => {
  setSubmitting(true);
  try {
    goto();
    // 登录
    // const msg = await fakeAccountLogin({ ...values, type });
    // if (msg.status === 'ok') {
    //   message.success('登录成功！');
    //   goto();
    //   return;
    // } // 如果失败去设置用户错误信息

    // setUserLoginState(msg);
  } catch (error) {
    message.error('登录失败，请重试！');
  }

  setSubmitting(false);
};
```

#### 2. 在 app.tsx 文件

- 删除 fetchUserInfo， currentUser 关键字相关的所有代码
- 删除 onPageChange 方法里的所有代码
- 此时登录账号密码你随意写

```js
export async function getInitialState(): Promise<{
  settings?: LayoutSettings,
}> {
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login') {
    return {
      settings: defaultSettings,
    };
  }
  return {
    settings: defaultSettings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings, currentUser?: API.CurrentUser },
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      // const { currentUser } = initialState;
      // const { location } = history;
      // // 如果没有登录，重定向到 login
      // if (!currentUser && location.pathname !== '/user/login') {
      //   history.push('/user/login');
      // }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};
```

#### 3. 直接删除 src/pages 下的 ListTableList 文件夹 Admin.tsx 文件

#### 4. 接着删除 config/routes 下 ListTableList 路由和 admin 文件引入的路径

- 删除后如下

```js
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
```

### 退出登录 components/RightContent/AvatarDropdown 下 ，删除 outLogin 调用， 以及 currentUser 相关的代码

### 5. 在 src/services 下的原有的文件，都可以全部删除掉了，但建议留着，等写你的接口的时候参考一下人家的 demo

### 6. 如果你的权限是后台控制的，或者没有权限相关， 可以直接删除 src/access.ts 文件

---

做完以上的操作，此时，你可以自由登录和退出

### 7. 关于 app.tsx 文件(在 umi 的运行时配置)

在这个文件里，你可以在进一步配置里边的内容

- 1. 比如登录拦截
- 2. 路由监听
- 3. 菜单动态化（从接口拿的菜单，具体的看文档）
- 4. umi-request 请求前，请求后拦截器，统一错误处理等（关于文档上的后台返回数据结构， 假如你们后台和接口返回的和文档上的不一样，你需要自己处理，不熟悉的直接换成 axios）

### 8. 关于 global.tsx 文件（比 app.tsx 先执行，相当于入口吧）

- 1. 这是一个约定，umi 会自动加载里面的内容，并且在最前面，可以做埋点之类的逻辑
- 2. 也可以做一些全局配置

### 9. 关于使用数据仓库（dva， redux）

- v5 不推荐使用 dva 了，而是改用 基于 hooks & umi 插件轻量级的全局数据共享的方案

- 如果你是全局页面共享的状态 推荐使用 getInitialState()方法 [!https://beta-pro.ant.design/docs/initial-state-cn]

### 10. 某个页面单独抽离的数据源( 使用 useModal() )

1. 需要 在 src 下新建 models 文件夹参考文档[!https://beta-pro.ant.design/docs/simple-model-cn]
2. 在该目录下创建 xxx.ts 文件

```js
import { useState, useCallback } from 'react';
export default () => {
  const [counter, setCounter] = useState(0);
  const increment = useCallback(() => setCounter((c) => c + 1), []);
  const decrement = useCallback(() => setCounter((c) => c - 1), []);
  return { counter, increment, decrement };
};
```

3. 使用这个数据源

```js
import { useModel } from 'umi';
export default () => {
  // useModel 参数 传入文件名
  const { counter, increment } = useModel('xxx');

  // 如果异步的话
  useEffect(() => {
    setTimeout(() => {
      increment();
    }, 1000);
  }, []);

  return <div>{counter}</div>;
};
```

### 11. 配置不同的打包环境(dev, test, prod)

- 本地开发环境，几乎一般都会用代理模式

- 1. 测试，和 生产环境 都使用代理的方式

直接在 config/proxy.ts 文件中修改

```js
export default {
  dev: {
    '/api/': {
      target: '本地后台接口地址',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  test: {
    '/api/': {
      target: '测试环境接口地址',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  pre: {
    '/api/': {
      target: '开发环境接口地址',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
```

在 package.json 中的 scripts 属性中 添加脚本指令，启动脚本后会注入 `REACT_APP_ENV` 入参，用于判断当前是什么环境

```json
{
  "scripts": {
    "test:build": "cross-env REACT_APP_ENV=test umi dev",
    "pre:build": "cross-env REACT_APP_ENV=pre umi dev"
  }
}
```

- 2. 测试，和 生产环境 打包后不使用代理的方式

> 在 global.tsx 中, 配置不同的环境

```js
export const url = {
  test: '开发环境接口地址',
  pre: '生产环境接口地址',
};
```

### http 请求配置

- 本地开发就不说了，直接使用代理跑吧
- 打包后需要判断了，以下以 `axios` 为例,`umi-request` 一样的思路：

```js
import axios from 'axios';
import { url } from '@/global';
// 直接判断 REACT_APP_ENV 这个注入的参数就可以了
// REACT_APP_ENV 该入参可以直接使用, 一定保证你的脚本注入了次变量，否则它是false
var instance = axios.create({
  baseURL: REACT_APP_ENV === 'dev' ? '/api' : url[REACT_APP_ENV],
  timeout: 1000,
});
```
