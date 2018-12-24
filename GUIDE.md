# CORS 试验

## start

环境：nodejs 7.6+, vue-cli 3+

client: http://localhost:8080

server: http://localhost:3000

```
# clone
git clone https://github.com/chesscai/cors.git

# hot reload client (vue)
cd client && npm i && npm run serve

# hot reload server (koa2)
cd server && npm i && npm run dev
```

## client

> 前端由vue开发，使用 vue-cli3 启动热更

```./client/src/ajax.js``` 简单封装了 XMLHttpRequest 请求。

```./client/src/App.vue``` 调用了多个ajax实例，可以在这里自定义你的实例。

## server

> 服务端由koa2开发，使用 nodemon 启动热更

```./server/routers/index.js``` 定义了多个请求方法，可以在这里自定义你的请求。

```./server/app.js``` 在cors模块初始化你的cors响应头