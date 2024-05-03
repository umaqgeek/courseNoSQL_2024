# Intro to NoSQL (Redis & MongoDB)

This repo used as an exercise for the course of Introduction to NoSQL (Redis & MongoDB).
Can refer to this [Slide](https://drive.google.com/file/d/1uJAIM_4jy67sQsiGf2jA7fE_rApLgFfj/view?usp=drive_link).

## 1. Prequisite installation
- [NodeJS (with NPM)](https://nodejs.org/en/download).
- [VSCode (IDE)](https://code.visualstudio.com/download).
- [MongoDB Enterprise Edition](https://www.mongodb.com/docs/manual/installation/) (mongod, mongosh, MongoDB Compass).
- [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/) (redis-server, redis-cli).

## 2. Installation
```
npm install
```

## 3. Dependencies
Please up the Redis service and MongoDB service before running the NodeJS application.

### 3.1. Running the Redis service (foreground)
```
redis-server
```

### 3.2. Running the MongoDB service
Make sure to create the directories below before running below command line:
- `db`
- `log/mongodb/mongo.log`
```
mongod \
    --dbpath ~/mongoData/db \
    --logpath ~/mongoData/log/mongodb/mongo.log \
    --fork
```

### 3.3. Running the NodeJS application
```
npm run start
```