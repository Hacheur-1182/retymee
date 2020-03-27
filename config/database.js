const localDB = "mongodb://localhost:27017/onlineprepa";
const liveDB = "mongodb://onlineprepa:onlineprepa123@ds219051.mlab.com:19051/onlineprepa"

module.exports = {
    database: process.env.NODE_ENV !== 'production' ? localDB : liveDB
}