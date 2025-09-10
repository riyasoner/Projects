require('dotenv').config()
const { DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false,
    
})

try {
    sequelize.authenticate()
    console.log("Connection has been establised successfully with DataBase...!")
} catch (error) {
    console.error("Unable to connect to the database", error)
}

const db = {}
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize.sync({alter:true});

//============================== Creating Tables ================================//

db.user = require("../src/models/user_model/registration.model")(sequelize, DataTypes)
db.book = require("../src/models/book_model/book.model")(sequelize, DataTypes)
db.category = require("../src/models/category_model/cateory.model")(sequelize, DataTypes)
db.contact = require("../src/models/contact_model/contact.model")(sequelize ,DataTypes)
db.account = require("../src/models/account_model/account.model")(sequelize, DataTypes)
db.transaction= require("../src/models/transaction_model/transaction.model")(sequelize, DataTypes)
db.note = require("../src/models/notes_model/notes.model")(sequelize, DataTypes)
db.feedback = require("../src/models/feedback_model/feedback.model")(sequelize, DataTypes)
db.notification = require("../src/models/notification_model/notification.model")(sequelize, DataTypes)
db.alloted_book = require("../src/models/book_model/assigned_book_model")(sequelize, DataTypes)
db.alloted_account = require("../src/models/account_model/assigned_account_model")(sequelize , DataTypes)
db.emi_transaction = require("../src/models/transaction_model/emiTransaction.model")(sequelize, DataTypes)
db.collection = require("../src/models/transaction_model/collection.model")(sequelize,DataTypes)
//============================== Types of Assosiations ================================//



// //account has One to Many relation with transaction
db.account.hasMany(db.transaction, {
    forienKey : "accountId",
    as : "transaction"
})
db.transaction.belongsTo(db.account, {
    forienKey : "accountId",
    as : "account" 
})

 //book has One to Many relation with account
db.book.hasMany(db.account, {
    forienKey : "bookId",
    as : "account"
})
db.account.belongsTo(db.book, {
    forienKey : "bookId",
    as : "book" 
})

//book has One to Many relation with transaction
db.book.hasMany(db.transaction, {
    forienKey : "bookId",
    as : "transaction"
})
db.transaction.belongsTo(db.book, {
    forienKey : "bookId",
    as : "book" 
})

 //user has One to Many relation with account
 db.user.hasMany(db.account, {
    forienKey : "userId",
    as : "account"
})
db.account.belongsTo(db.user, {
    forienKey : "userId",
    as : "user" 
})

 //user has One to Many relation with notificatin
 db.user.hasMany(db.notification, {
    forienKey : "userId",
    as : "notifications"
})
db.notification.belongsTo(db.user, {
    forienKey : "userId",
    as : "user" 
})

 //user has One to Many relation with book
//  db.user.hasMany(db.book, {
//     forienKey : "userId",
//     as : "book"
// })
// db.book.belongsTo(db.user, {
//     forienKey : "userId",
//     as : "user" 
// })

 //book has One to Many relation with assigned_book
 db.book.hasMany(db.alloted_book, {
    forienKey : "bookId",
    as : "alloted_book"
})
db.alloted_book.belongsTo(db.book, {
    forienKey : "bookId",
    as : "book" 
})

 //book has One to Many relation with assigned_book
 db.user.hasMany(db.alloted_book, {
    forienKey : "userId",
    as : "alloted_book"
})
db.alloted_book.belongsTo(db.user, {
    forienKey : "userId",
    as : "user" 
})

 //book has One to Many relation with notificatin
 db.book.hasMany(db.notification, {
    forienKey : "bookId",
    as : "notifications"
})
db.notification.belongsTo(db.book, {
    forienKey : "bookId",
    as : "book" 
})

 //User has One to Many relation with feedback
 db.user.hasMany(db.feedback, {
    forienKey : "userId",
    as : "feedback"
})
db.feedback.belongsTo(db.user, {
    forienKey : "userId",
    as : "user" 
})

 //User has One to Many relation with transaction
 db.user.hasMany(db.transaction, {
    forienKey : "userId",
    as : "transaction"
})
db.transaction.belongsTo(db.user, {
    forienKey : "userId",
    as : "user" 
})

 //User has One to Many relation with note
 db.user.hasMany(db.note, {
    forienKey : "userId",
    as : "note"
})
db.note.belongsTo(db.user, {
    forienKey : "userId",
    as : "user" 
})

 //book has One to Many relation with note
 db.book.hasMany(db.note, {
    forienKey : "bookId",
    as : "note"
})
db.note.belongsTo(db.book, {
    forienKey : "bookId",
    as : "book" 
})

//account has One to Many relation with alloted_account
db.account.hasMany(db.alloted_account, {
    forienKey : "accountId",
    as : "alloted_account"
})
db.alloted_account.belongsTo(db.account, {
    forienKey : "accountId",
    as : "account" 
})

 //account has One to Many relation with alloted_account
 db.user.hasMany(db.alloted_account, {
    forienKey : "userId",
    as : "alloted_account"
})
db.alloted_account.belongsTo(db.user, {
    forienKey : "userId",
    as : "user" 
})

 //account has One to Many relation with alloted_account
 db.book.hasMany(db.alloted_account, {
    forienKey : "bookId",
    as : "alloted_account"
})
db.alloted_account.belongsTo(db.book, {
    forienKey : "bookId",
    as : "book" 
})

//transaction has One to Many relation with emi_transaction
// db.transaction.hasMany(db.emi_transaction, {
//     forienKey : "transactionId",
//     as : "emi_transaction"
// })
// db.emi_transaction.belongsTo(db.transaction, {
//     forienKey : "transactionId",
//     as : "transaction" 
// })

db.collection.hasMany(db.emi_transaction, {
    foreignKey: "transactionId",
    as: "emi_transactions"
});

db.emi_transaction.belongsTo(db.collection, {
    foreignKey: "transactionId",
    as: "collection"
});

module.exports = db;
