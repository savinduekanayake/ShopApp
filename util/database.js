// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

// let _db;

// const mongoConnect = (callbak) => {

//     MongoClient.connect('mongodb://savindu:yzQHPrSRuimRVRW6@cluster0-shard-00-00-r106v.mongodb.net:27017,cluster0-shard-00-01-r106v.mongodb.net:27017,cluster0-shard-00-02-r106v.mongodb.net:27017/shop?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', {
//         useUnifiedTopology: true,
//         useNewUrlParser: true,
//         })
//         .then(client => {
//             console.log('CONNECTED!');
//             _db = client.db();
//             callbak();
//         })
//         .catch(err => {
//             console.log(err)
//             throw err;
//         });
// }

// const getDb =()=>{
//     if(_db){
//         return _db;
//     }
//     throw 'No database found!'
// }
// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;
