# Chatopera Web Chat

使用 Web 网页和 Chatopera 机器人对话。

## Featured

- 提供对话页面，方便系统集成测试
- 使用 Bot Provider 地址，clientId 和 secret 连接机器人
- 实现 Dialogue Management: 融合意图识别检索、多轮对话检索和知识库检索
- 使用 Chatopera Node.js SDK，可作为系统集成参考

## TL;DR

```
cd app
npm install
npm start
open http://localhost:8668
```

![](./assets/2.jpg)

![](./assets/1.jpg)

## 启动程序

为了方便用户体验和测试，同时提供一个 Web 应用，该 Web 应用源码也在`./app`内，该示例程序仅用于调试和体验。

启动对话示例程序：

```
cd app
npm i
npm run serve
```

在控制台内看到如下日志，代表程序启动成功。

```
Chatopera Test Client Listening on port 8668
```

在浏览器内打开地址`http://localhost:8668/`，进入登录页面。

![](./assets/2.jpg)

填入`Client ID`和`Client Secret`开始使用。

### 使用 docker 运行

\*前提准备：安装 docker 服务。

如果不想安装 Node.js 环境，进一步简化的运行方式是使用 docker，我们提供了 docker 镜像[chatopera/webchat](https://hub.docker.com/r/chatopera/webchat/)，使用如下命令立即启动。

```
docker run -it --rm -p 8668:8668 chatopera/webchat:1.0.0
```

其中，前一个`8668`是服务访问端口，可以自定义，访问服务。

```
http://YOUR_IP:8668
```

## 其它链接

[Chatopera 云服务](https://bot.chatopera.com)

[Chatopera Node.js SDK](https://www.npmjs.com/package/@chatopera/sdk)

## 开源许可协议

Copyright (2018-2020) <a href="https://www.chatopera.com/" target="_blank">北京华夏春松科技有限公司</a>

[MIT](https://github.com/chatopera/chatopera-chat-web/blob/master/LICENSE)

[![chatoper banner][co-banner-image]][co-url]

[co-banner-image]: https://user-images.githubusercontent.com/3538629/42383104-da925942-8168-11e8-8195-868d5fcec170.png
[co-url]: https://www.chatopera.com
