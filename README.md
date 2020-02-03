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
