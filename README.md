# CORS 标准解析
> 跨域资源共享(CORS) 是一种机制，它使用额外的 HTTP 头来告诉浏览器允许访问跨域资源

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

众所周知，以上是处理CORS的响应头，本节结合**标准和实验**来做更细节的解析：

1. CORS 与 预检请求preflight 有什么关系？
2. 以上4个headers在都是必须的吗？
3. 携带身份凭证的跨域请求与非携带的有什么不同？

标准只是标准，通过代码来一一验证，[所有试验可以在这里找到](./GUIDE.md)。

## cross origin（跨域）
> 跨域请求限制是web浏览器的安全限制，其他应用如客户端/服务端没有这种限制。（另一种跨域方案：node作为中间件转发请求）

发起请求的源站与服务端的 ```协议/主域/端口``` 有差异时形成跨域：

- protocol（如 http 与 https）
- host（如 a.com 与 b.com 为不同主域，a.x.com 与 b.x.com 为同主域）
- port（如 :3000 与 :8000）

下列场景会检测跨域：

- XMLHttpRequest/Fetch
- canvas/webGL 贴图
- @font-face
- CSSOM

下列场景不涉及跨域（有src/href引用资源功能的标签）：
- ```<script src="">``` （另一种跨域方案：JSONP）
- ```<link href="">```
- ```<img src="">```

## simple method（简单http方法）
- get
- post
- head

## simple request（简单http请求）
1. simple method
2. request headers（对 CORS 安全的请求头字段集合）
  - Accept
  - Accept-Language
  - Content-Language
  - Content-Type: 
    - text/plain
    - mutilpart/form-data
    - application/x-www-form-urlencode
  - DPR/Downlink/Save-Data/Viewport-Width/Width（使用较少）
  - Connection/Host/Origin/Referer/User-Agent（常见）
3. 请求中的XMLHttpRequestUpload 对象注册了任意多个事件监听器。
4. 请求中使用了ReadableStream对象

常见非简单请求场景：
1. 非简单方法
2. Content-Type: application/json,application/xml,...
3. 自定义headers：X-Token,...

## preflight request（预检请求）
> 违反 ```simple request``` 的请求会产生预检请求 ```OPTIONS```，以获知服务器是否允许该实际请求，也避免跨域请求对服务器产生未预期的影响。

**浏览器根据服务端对预检请求的响应，来判断是否允许继续发出实际请求，重点看预检请求 ```OPTIONS``` 的响应头：**

client: http://localhost:8080 => server: http://localhost:3000

```
# 服务端允许的客户端origin
Access-Control-Allow-Origin: http://localhost:8080 或 *
# 服务端允许的客户端request methods
Access-Control-Allow-Methods: PUT
# 服务端允许的客户端request headers
Access-Control-Allow-Headers: X-Token, Content-Type
# 预检请求有效时间，由浏览器维护，比如10s内该请求不再需要发起预检请求
Access-Control-Max-Age: 10
```

## cookie
> 浏览器cookie是同域作用域，同域请求会自动携带在request headers，跨域会自动屏蔽

那么如何在跨域请求中携带cookie？

Step1：请求设置 ```withCredentials``` 标识

```
var xhr = new XMLHttpRequest()
xhr.open('GET', url, true)
// 设置withCredentials标识，注意顺序：在open之后，send之前
xhr.withCredentials = true
xhr.send()
```

Step2：响应头设置 ```Access-Control-Allow-Origin: origin```, ```Access-Control-Allow-Credentials: true```

```
Access-Control-Allow-Origin: http://localhost:8080
Access-Control-Allow-Credentials: true
```
> 附带身份凭证(cookie)的请求，Access-Control-Allow-Origin 不可以使用通配符*

> 如果step2未设置，实际上服务端可以正常处理并响应，但浏览器不会把响应返回给发送方。

## 小结

结合以上理论和实践，可以对开头的问题给出理解。

1. CORS 与跨域相关，预检请求与简单请求相关，两者没有必然联系。
2. CORS response headers 按需返回即可，```Access-Control-Allow-Origin``` 和 ```Access-Control-Allow-Methods``` 是必须的。 不需要的没必要增加冗余字节，必要时启用 max-age 缓存。
3. 携带身份凭证时要注意 allow-origin 不能使用通配符
4. allow-methods 待预检之后实际要发起的请求方法列表，实际上并不需要包含 options 本身，我们会习惯性写上所有方法，对于单个请求来讲，其他的都是冗余的；对于启用了 max-age 的就很有必要。另外，简单方法：GET, POST, HEAD 默认允许，不需要显式设置。
5. 在请求发起时已经确定了是否命中 CORS/preflight，与响应无关。

## ref
[https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)