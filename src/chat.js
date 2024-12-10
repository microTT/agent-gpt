const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const winston = require('winston');
const cluster = require('cluster');
const os = require('os');

// 读取环境变量
const apiKey = process.env.OPENAI_API_KEY;

// 配置日志工具
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'chat-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// 如果是主进程，使用 cluster 模块创建多个子进程
if (cluster.isMaster) {
  const numCPUs = os.cpus().length;

  logger.info(`Master process started. Forking ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.error(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // 子进程运行应用逻辑
  const app = express();
  app.use(express.json());

  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);

  // 健康检查接口
  app.get('/status', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date().toISOString() });
  });

  // Chat Completion 接口
  app.post('/v1/chat/completions', async (req, res) => {
    try {
      const completion = await openai.createChatCompletion(req.body);
      res.json(completion.data);
    } catch (error) {
      logger.error(`Error occurred: ${error.message}`);
      res.status(500).json({
        message: 'Internal server error occurred while processing your request.',
        error: error.message,
      });
    }
  });

  // 监听端口
  const port = 6101;
  app.listen(port, () => {
    logger.info(`Worker ${process.pid} is running on port ${port}`);
  });
}

// 捕获未处理的异常
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  // 记录日志后决定是否退出
  process.exit(1);
});

// 捕获未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
