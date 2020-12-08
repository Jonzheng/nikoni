const redis = require("redis")
const conf = require('../config/conf')

const redisClient = redis.createClient({host: conf.redisAddress, port: conf.redisPort, password: conf.redisPassword});

redisClient.on("connect", function(opts){
    console.log("redis client connect");
});

redisClient.on("error", function(err){
    console.error("redis client on error: %s", err);
});

// monitor事件可以监听到redis接收到的所有客户端命令
redisClient.monitor(function(err, res){
    console.log("redis client monitor: ", res);//ok
});

redisClient.on("monitor", function(time, args){
  if (args.length > 1 ){
    time = time * 1000
    let day = new Date(time)
    console.log("redis monitor:", day, args[0], args[1])
  }
});

let cache = {}

//字符串 根据键名获取键值，字符串解析为JSON对象。
cache.get = (key) => {
    return new Promise((resolve, reject)=>{
        redisClient.get(key, (error, result)=>{
            // console.log(error, result);//null null
            if(error){
                reject(error);
            }else{
                resolve(result);
            }
        });
    });
};

//字符串 设置键值对
cache.set = (key, value, expire=0)=>{
    if(typeof value === "object"){
        value = JSON.stringify(value);
    }
    return new Promise((resolve, reject)=>{
        redisClient.set(key, value, (error, result)=>{
            // console.log(error, result);
            if(error){
                reject(error);
            }else{
                if(result === "OK"){
                    result = true;
                }
                if (expire > 0) {
                    redisClient.expire(key, expire)
                }
                resolve(result);
            }
        });
    });
};


//哈希散列表 获取键值对数量
cache.hlen = (key)=>{
    return new Promise((resolve, reject)=>{
        redisClient.hlen(key, (error, length)=>{
            if(error){
                reject(error);
            }else{
                resolve(length);
            }
        });
    });
};
//哈希散列表 根据键名获取中所有的键值对
cache.hgetall = (key)=>{
    return new Promise((resolve, reject)=>{
       redisClient.hgetall(key, (error, result)=>{
            if(error){
                reject(error);
            }else{
                resolve(result);
            }
       });
    });
};
//哈希散列表 设置中的键值对
cache.hmset = (key, values)=>{
    return new Promise((resolve, reject)=>{
       redisClient.hmset(key, values, (error, result)=>{
            if(error){
                reject(error);
            }else{
                if(result === "OK"){
                    result = true;
                }
                resolve(result);
            }
       });
    });
};
cache.hmget = (key, values)=>{
    return new Promise((resolve, reject)=>{
       redisClient.hmget(key, value, (error, result)=>{
           if(error){
               reject(error);
           }else{
               resolve(result);
           }
       });
    });
};
module.exports = cache;

