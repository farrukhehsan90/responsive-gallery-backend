const mongoDb = require('mongodb')
const MongoClient = mongoDb.MongoClient

let _db;

const mongoConnect = (callBack) => {
    MongoClient.connect('mongodb+srv://mudassirraza912:Mams9990!@cluster0.ywq4h.mongodb.net/Cluster0?retryWrites=true&w=majority')
    .then(client => {
        _db = client.db()
        console.log('Connected')
        callBack(client)
    })
    .catch(err => {
        throw err
    })
}

const getDb = () => {
    if(_db) {
        return _db
    }
    throw "Database not found"
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb
