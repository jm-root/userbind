# userbind

用户绑定服务

## features

- 同一个用户只能绑定或者被绑定一次

- 用户不能绑定自己

## <a name="环境变量">环境变量</a>

- jm-server

- jm-server-jaeger

- main

--

### jm-server

请参考 [jm-server](https://github.com/jm-root/ms/tree/master/packages/jm-server)

--

### jm-server-jaeger

| 配置项 | 默认值 | 描述 |
| :-: | :-: | :-: |
|service_name|"server-template"| 链路追踪登记的服务名称 |
|jaeger| |jaeger服务器Uri| 链路追踪服务器

--

### main

| 配置项 | 默认值 | 描述 |
| :-: | :-: | :-: |
|redis| [] | redis服务器Uri |

### 数据库存储说明
示例： A用户绑定B用户

- 绑定记录：redis的键为：`userbind:A`，对应的值为 `B`
- 被绑定记录：redis的键为：`userbind:bound:B`，对应的值为 `A`

绑定记录与被绑定记录，同时存在，同时消失
