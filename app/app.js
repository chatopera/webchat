"use strict";
require("dotenv").config();
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

    // -------- 请求对话 --------
    /**
     * 多轮对话
     */
    let response = await bot.command("POST", "/conversation/query", {
      fromUserId: username,
      textMessage: data.content,
      faqBestReplyThreshold: process.env["FAQ_BESTREPLY_THRESHOLD"] ? parseFloat(process.env["FAQ_BESTREPLY_THRESHOLD"]) : 0.7,
      faqSuggReplyThreshold: process.env["FAQ_SUGGREPLY_THRESHOLD"] ? parseFloat(process.env["FAQ_SUGGREPLY_THRESHOLD"]) : 0.35,
    });

    debug(
      "[socket.io], response POST /conversation/query",
      JSON.stringify(response, null, " ")
    );

    let textMessage = response.rc == 0 ? response.data.string : null;
    response["textMessage"] = textMessage;

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
