"use strict";

const debug = require("debug")("webchat:app");
const Koa = require("koa");
const config = require("./config/environment");
const serve = require("koa-static");
const Topics = require("./public/src/Topics.js");
const app = new Koa();
const path = require("path");
const figlet = require("figlet");
const port = config.node.port || 8668;
const bodyParser = require("koa-bodyparser");
const router = require("./routes");
const { Chatbot } = require("@chatopera/sdk");
const CHANNEL_ID = "webchat";

app.use(serve(path.join(__dirname, "/public")));
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

const httpServer = app.listen(port, function () {
  figlet("Chatopera Test Client", function (err, data) {
    console.log(`            
${data}
================= Powered by Chatopera =====================
-------- https://github.com/chatopera/webchat

---------------- Deliver Chatbots for Enterprise. ---------------------

`);
    console.log(`Chatopera Test Client Listening on port ${port}`);
  });
});
const io = require("socket.io").listen(httpServer);

const sessions = {};

/**
 * Process Socket Event
 * https://nodesource.com/blog/understanding-socketio/
 */
io.on("connection", function (socket) {
  debug("socket.io connection query %j", socket.handshake.query);
  let query = socket.handshake.query;

  socket.emit(Topics.USER_CONNECTED, query.username);

  socket.on("client:server", async function (data) {
    debug("[socket.io]", "client:server", data);
    let { host, clientId, clientSecret, username } = data.provider || {};

    let bot = new Chatbot(clientId, clientSecret, host);

    // -------- 验证机器人 -------
    let detail = await bot.command("GET", "/");
    debug("[socket.io] chatbot profile details", detail);
    if (detail.rc != 0) {
      // 机器人不存在
      detail["textMessage"] =
        "Not exist, can not establish connection to bot provider or invalid credentials.";
      if (detail.data) {
        detail.data["createdAt"] = new Date().getTime();
      } else {
        detail["data"] = {
          createdAt: new Date().getTime(),
        };
      }

      socket.emit("server:client", {
        recipient: data.author,
        response: detail,
      });
      return;
    }

    // -------- 准备对话 --------

    /**
     * 意图识别会话
     */
    // 存储位置初始化
    if (!sessions[clientId]) sessions[clientId] = {};

    if (!sessions[clientId][username])
      sessions[clientId][username] = { session: null };

    // 检查会话是否存在
    if (!sessions[clientId][username]["session"]) {
      // 不存在：创建 session
      let resp = await bot.command("POST", "/clause/prover/session", {
        uid: username,
        channel: CHANNEL_ID,
      });
      sessions[clientId][username]["session"] = resp.data;
      debug("[socket.io] created a new session.");
    } else {
      // 存在
      debug(
        "[socket.io] retrieved memory session data",
        sessions[clientId][username]["session"]
      );

      // 检查会话是否有效
      let resp = await bot.command(
        "GET",
        `/clause/prover/session/${sessions[clientId][username]["session"].id}`
      );

      debug("[socket.io] retrieved pre session info", resp);

      if (!resp.data || !resp.data.ttl || resp.data.ttl < 10) {
        // 如果会话有效期很短，创建新 session
        resp = await bot.command("POST", "/clause/prover/session", {
          uid: username,
          channel: CHANNEL_ID,
        });
        debug("[socket.io] expired session, re-create session");
        sessions[clientId][username]["session"] = resp.data;
      } else {
        // 更新 session 信息
        sessions[clientId][username]["session"] = resp.data;
      }
    }

    const sessionId = sessions[clientId][username]["session"]["id"];

    debug(
      "[socket.io] resolve final session for intent chat",
      JSON.stringify(sessions[clientId][username]["session"], null, " ")
    );

    // -------- 发送对话请求 --------

    /**
     * 回复
     * response 必须包含：textMessage，data.createdAt
     */
    let response;

    // 先识别意图识别对话
    try {
      let intentChatResponse = await bot.command(
        "POST",
        "/clause/prover/chat",
        {
          fromUserId: username,
          session: sessions[clientId][username]["session"],
          message: {
            textMessage: data.content,
          },
        }
      );

      debug(
        "[socket.io] intent response ",
        JSON.stringify(intentChatResponse, null, " ")
      );

      if (
        intentChatResponse.rc == 0 &&
        intentChatResponse.data &&
        intentChatResponse.data.session &&
        intentChatResponse.data.session.intent_name
      ) {
        // 识别到意图
        let preSession = sessions[clientId][username]["session"];
        let curSession = intentChatResponse.data.session;
        let textMessage = null;

        // 检查 intent 是否 resolved
        if (curSession.resolved) {
          // 已经 resolved
          // Note: 实现不同业务逻辑!
          // 清楚 session 信息
          sessions[clientId][username] = null;
          textMessage = "已经发现意图并收集了参数，参考右侧完整返回信息。";
        } else {
          // 没有 resolved
          // 更新 session 信息
          sessions[clientId][username] = intentChatResponse.data;
          // FIXME 返回值没有保留 sessionId，待优化 https://gitlab.chatopera.com/chatopera/chatopera.bot/issues/871
          sessions[clientId][username]["session"].id = sessionId; // work around
          textMessage = intentChatResponse.data.message.textMessage;
        }

        response = {
          textMessage: textMessage,
          data: intentChatResponse.data,
        };
      }
    } catch (e) {
      // 发生异常
      console.log("Error: Intent Chat", e);
    }

    // 未识别到意图，或意图识别发生错误
    // 继续执行多轮对话检索
    // Note: 如果对话在意图识别中得到回复，包括：识别到意图；进行追问；完成意图识别数据收集。都不会再检索多轮对话。
    if (!response) {
      /**
       * 检查多轮对话
       */
      response = await bot.command("POST", "/conversation/query", {
        fromUserId: username,
        textMessage: data.content,
        faqBestReplyThreshold: 0.7,
        faqSuggReplyThreshold: 0.35,
      });

      debug(
        "[socket.io], response POST /conversation/query",
        JSON.stringify(response, null, " ")
      );

      let textMessage = response.rc == 0 ? response.data.string : null;
      response["textMessage"] = textMessage;
    }

    if (!response.data["createdAt"]) {
      response.data["createdAt"] = new Date().getTime();
    }

    // -------- 返回对话检索结果 --------

    debug(
      "[socket.io] final response: \n%s",
      JSON.stringify(response, null, " ")
    );

    socket.emit("server:client", {
      recipient: data.author,
      response: response,
    });
  });
});
