// 导入所需的库
const http = require('http');
const url = require('url');

const env = require('../env.json');

// 创建服务器
const server = http.createServer((req, res) => {
  const requestUrl = url.parse(req.url, true);

  // 设置响应头
  res.setHeader('Content-Type', 'text/plain;charset=utf-8');

  // 根据请求的路径做出响应
  if (requestUrl.pathname === '/') {
    res.writeHead(200);
    res.end('你好，欢迎来到主页！');
  } else if (requestUrl.pathname === '/chat') {
    res.writeHead(200);
    res.end('关于我们的页面');
  } else {
    res.writeHead(404);
    res.end('对不起，找不到你请求的页面。');
  }
});

// 监听指定的端口
server.listen(env.PORT, () => {
  console.log(`服务器已启动，正在监听端口：${env.PORT}`);
});
