const db = require("../../../config/config"); // Adjust the path to your config file
const { Op, where } = require("sequelize");
const Transaction = db.transaction;
const Account = db.account;
const book = db.book;
const moment = require("moment");

const transaction_view_by_superAdmin = async (req, res) => {
    try {
        const { accountId, bookId, transanctionId} = req.body;

        const whereCondition = { accountId: accountId, bookId: bookId, view_by_superAdmin: false  };
    
        if (transanctionId) {
            whereCondition.id = { [Op.eq]: transanctionId };
        }

        if (!accountId || !bookId) {
            return res.status(400).json({
                status: false,
                message: "Account ID and Book ID both are required"
            });
        }

        const find_unViwedTransactions = await Transaction.findAll({
            where: whereCondition
        });

        if (find_unViwedTransactions.length === 0) {
            return res.status(200).json({
                status: true,
                message: "Transactions Already Viewed"
            });
        }

        // Updating all transactions using Promise.all()
        await Promise.all(
            find_unViwedTransactions.map(async (transaction) => {
                transaction.view_by_superAdmin = true;
                await transaction.save();
            })
        );

        return res.status(200).json({
            status: true,
            message: "Transactions Viewed by Admin successfully"
            // data: find_unViwedTransactions
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};


module.exports = { 
    transaction_view_by_superAdmin
}