# 选择官方 Node.js 基础镜像
FROM node:20

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 暴露端口（与应用程序监听的端口一致）
EXPOSE 6101

# 启动应用
CMD ["node", "./src/chat.js"]
