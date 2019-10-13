const mongodb = require('mongodb');

let isProduction = false
if(process.env.PWD.split('/')[2] === 'jcrowle8') {
    isProduction = true;
}

const db = async function() {
    let mongoClient = await mongodb.MongoClient.connect
        ('mongodb://localhost:27017', {
                useNewUrlParser: true
        });
        if(isProduction) {
            return mongoClient.db('cosc560_jcrowle8')
        }

        return mongoClient.db('sequencedb')
}

module.exports.loadChatMessagesCollection = async function() {
    return db.collection('chatMessages');
}


// module.exports = function() {
//     this.isProduction = false
//     if(process.env.PWD.split('/')[2]=='jcrowle8') {
//         this.isProduction = true;
//     }

//     this.theDb = async function() {
//         let mongoClient = await mongodb.MongoClient.connect
//         ('mongodb://localhost:27017', {
//                 useNewUrlParser: true
//         });
//         if(this.isProduction) {
//             return mongoClient.db('cosc560_jcrowle8').collection('chatMessages')
//         }

//         return mongoClient.db('sequencedb').collection('chatMessages')
//     }
        

//     this.loadChatMessagesCollection = async function() {
//         if(this.isProduction) {
//             return this.theDb().collection('chatMessages')
//         }

//         return this.theDb().collection('chatMessages')
//     }
// }
