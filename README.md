# Chatopera Web Chat

[Gitee](https://gitee.com/chatopera/webchat) | [CodeChina](https://codechina.csdn.net/chatopera/webchat) | [GitHub](https://github.com/chatopera/webchat)

使用 Web 浏览器和 [Chatopera 机器人平台](https://bot.chatopera.com/)的聊天机器人对话。

[Chatopera 机器人平台](https://bot.chatopera.com/)定制聊天机器人，让聊天机器人上线！

## Featured

- 提供对话页面，方便系统集成测试
- 使用 Bot Provider 地址，clientId 和 secret 连接机器人
- 实现 Dialogue Management: 融合意图识别检索、多轮对话检索和知识库检索
- [app.js](https://github.com/chatopera/webchat/blob/master/app/app.js) 使用 [Chatopera Node.js SDK](https://www.npmjs.com/package/@chatopera/sdk)，可作为系统集成参考

## TL;DR

使用 Docker 启动实例

```
docker run -it --rm -p 8668:8668 chatopera/webchat:develop
```

![](https://static-public.chatopera.com/assets/images/github/webchat/2.jpg)

![](https://static-public.chatopera.com/assets/images/github/webchat/1.jpg)

## 启动程序

为了方便用户体验和测试，同时提供一个 Web 应用，该 Web 应用源码也在`./app`内，该示例程序仅用于调试和体验。

启动对话示例程序：

```
cd app
npm install
npm start
open http://localhost:8668
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

## Chatopera 云服务

[Chatopera 云服务](https://bot.chatopera.com)是一站式实现聊天机器人的云服务，按接口调用次数计费。Chatopera 云服务是 [Chatopera 机器人平台](https://docs.chatopera.com/products/chatbot-platform/index.html)的软件即服务实例。在云计算基础上，Chatopera 云服务属于**聊天机器人即服务**的云服务。

Chatopera 机器人平台包括知识库、多轮对话、意图识别和语音识别等组件，标准化聊天机器人开发，支持企业 OA 智能问答、HR 智能问答、智能客服和网络营销等场景。企业 IT 部门、业务部门借助 Chatopera 云服务快速让聊天机器人上线！

<details>
<summary>展开查看 Chatopera 云服务的产品截图</summary>
<p>

<p align="center">
  <b>自定义词典</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530072-da92d600-d33e-11e9-8656-01c26caff4f9.png" width="800">
</p>

<p align="center">
  <b>自定义词条</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530091-e41c3e00-d33e-11e9-9704-c07a2a02b84e.png" width="800">
</p>

<p align="center">
  <b>创建意图</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530169-12018280-d33f-11e9-93b4-9db881cf4dd5.png" width="800">
</p>

<p align="center">
  <b>添加说法和槽位</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530187-20e83500-d33f-11e9-87ec-a0241e3dac4d.png" width="800">
</p>

<p align="center">
  <b>训练模型</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530235-33626e80-d33f-11e9-8d07-fa3ae417fd5d.png" width="800">
</p>

<p align="center">
  <b>测试对话</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530253-3d846d00-d33f-11e9-81ea-86e6d47020d8.png" width="800">
</p>

<p align="center">
  <b>机器人画像</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530312-6442a380-d33f-11e9-869c-85fb6a835a97.png" width="800">
</p>

<p align="center">
  <b>系统集成</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530281-4ecd7980-d33f-11e9-8def-c53251f30138.png" width="800">
</p>

<p align="center">
  <b>聊天历史</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530295-5856e180-d33f-11e9-94d4-db50481b2d8e.png" width="800">
</p>

</p>
</details>

<p align="center">
  <b>立即使用</b><br>
  <a href="https://bot.chatopera.com" target="_blank">
      <img src="https://static-public.chatopera.com/assets/images/64531083-3199aa80-d341-11e9-86cd-3a3ed860b14b.png" width="800">
  </a>
</p>

## 开源许可协议

Copyright (2018-2021) <a href="https://www.chatopera.com/" target="_blank">北京华夏春松科技有限公司</a>

[MIT](https://github.com/chatopera/chatopera-chat-web/blob/master/LICENSE)

[![chatoper banner][co-banner-image]][co-url]

[co-banner-image]: https://user-images.githubusercontent.com/3538629/42383104-da925942-8168-11e8-8195-868d5fcec170.png
[co-url]: https://www.chatopera.com
