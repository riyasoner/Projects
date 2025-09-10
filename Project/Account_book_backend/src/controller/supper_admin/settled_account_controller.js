const db = require("../../../config/config"); // Adjust the path to your config file
const { Op, where } = require("sequelize");
const Transaction = db.transaction;
const account = db.account;
const user = db.user;
const moment = require("moment-timezone"); // Import moment.js to handle date format issues

// Apk side sending request or creating settlement of account
const account_settled_api = async (req, res) => {
    try {
        const { accountId, bookId, userId, from_date, to_date, selectedDate, acc_setled_date } = req.body;

        if (!accountId || !bookId || !userId || !acc_setled_date) {
            return res.status(400).json({
                status: false,
                message: "Account ID, Book ID, User Id and Settled Date are required"
            });
        }

        // Default `from_date` `to_date` to earliest possible date if not provided
        const formattedFromDate = from_date
            ? moment(from_date, ["YYYY-MM-DD", "MM-DD-YYYY"]).startOf('day').format("YYYY-MM-DD HH:mm:ss")
            : "1900-01-01 00:00:00";

        const formattedToDate = to_date
            ? moment(to_date, ["YYYY-MM-DD", "MM-DD-YYYY"]).endOf('day').format("YYYY-MM-DD HH:mm:ss")
            : "2999-12-31 23:59:59";

        // Default `selectedDate` till all the transaction will be setteled 
        const formattedSettledDate = selectedDate
            ? moment(selectedDate, ["YYYY-MM-DD", "MM-DD-YYYY"]).endOf('day').format("YYYY-MM-DD HH:mm:ss")
            : formattedToDate;

        // const findTransactions = await Transaction.findAll({
        //     where: {
        //         accountId: accountId,
        //         bookId: bookId,
        //         userId: userId,
        //         account_settled: false,
        //         transaction_date: {
        //             [Op.between]: [formattedFromDate, formattedToDate],  // ✅ Filter within date range
        //             [Op.lte]: formattedSettledDate  // ✅ Only transactions up to `selectedDate`
        //         }
        //     }
        // });
        const findTransactions = await Transaction.findAll({
            where: {
                accountId: accountId,
                bookId: bookId,
                userId: userId,
                account_settled: false,
                transaction_date: {
                    [Op.and]: [
                        { [Op.gte]: formattedFromDate },
                        { [Op.lte]: formattedToDate },
                        { [Op.lte]: formattedSettledDate }
                    ]
                }
            }
        });


        console.log("Found settled transactions:", findTransactions.length);
        // findTransactions.forEach(tx => console.log("Transaction Date:", tx.transaction_date));

        if (findTransactions.length === 0) {
            return res.status(200).json({
                status: true,
                message: "No transactions found within the selected date range",
                data: []
            });
        }

        // Update all matching transactions by marking them as settled
        await Promise.all(
            findTransactions.map(async (transaction) => {
                // transaction.account_settled = true; // ✅ Mark as settled
                transaction.settlement_status = "Pending";
                transaction.acc_setled_date = acc_setled_date; // ✅ Store settled date
                await transaction.save();
            })
        );

        return res.status(200).json({
            status: true,
            message: "Transactions marked as settled successfully",
            data: findTransactions
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Supper Admin side get settlement request according to pending status
const getAllSettlementRequest = async (req, res) => {
    try {
        const { accountId, userId, bookId } = req.query;

        const whereCondition = { settlement_status: "Pending" };

        if (accountId) {
            whereCondition.accountId = { [Op.eq]: accountId };
        }
        if (userId) {
            whereCondition.userId = { [Op.eq]: userId };
        }
        if (bookId) {
            whereCondition.bookId = { [Op.eq]: bookId };
        }

        const get_account = await Transaction.findAll({
            where: whereCondition,
            attributes: [
                "id",
                "accountId",
                "bookId",
                "userId",
                "amount",
                "transaction_type",
                "transaction_date",
                "transaction_time",
                "account_settled",
                "description",
                "settlement_status",
                "acc_setled_date",
            ],
            include: [
                {
                    model: account,
                    as: "account",
                    attributes: ["name", "balance"], // Fetching account name
                },
                {
                    model: user,
                    as: "user",
                    attributes: ["name", "user_type"], // Fetching user name
                },
            ],
            order: [["id", "DESC"]],
        });

        if (!get_account || get_account.length === 0) {
            return res.status(200).json({
                status: false,
                message: "Pending Settlement Account are not found",
                data: []
            });
        }

        return res.status(200).json({
            status: true,
            message: "Pending Settlement Account are retrieved successfully",
            data: get_account
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// change status by supper admin
const approve_reject_settlement = async (req, res) => {
    try {
        const { accountId, userId, bookId, settlement_status } = req.query; // settlement_status can be 'approved' or 'rejected'

        const request = await Transaction.findOne({
            where: { accountId, userId, bookId }
        });
        if (!request) {
            return res.status(201).json({
                status: false,
                message: "Settlement request not found "
            });
        }

        if (settlement_status === "Rejected") {
            request.settlement_status = "Rejected";
            await request.save();
            return res.status(200).json({ status: true, message: "Settlement request Rejected" });
        }

        // Fetch transactions for this request
        const findTransactions = await Transaction.findAll({
            where: {
                accountId: request.accountId,
                bookId: request.bookId,
                userId: request.userId,
                account_settled: false
            }
        });

        if (findTransactions.length === 0) {
            return res.status(200).json({
                status: true,
                message: "No transactions found for this settlement request"
            });
        }

        // Mark transactions as settled
        await Promise.all(
            findTransactions.map(async (transaction) => {
                transaction.account_settled = true;
                transaction.settlement_status = "Approved"
                transaction.acc_setled_date = request.acc_setled_date;
                await transaction.save();
            })
        );

        // // Update the request status
        // request.settlement_status = "Approved";
        // await request.save();

        return res.status(200).json({
            status: true,
            message: "Settlement request approved, transactions settled",
            transactions: findTransactions
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

module.exports = {
    account_settled_api,
    getAllSettlementRequest,
    approve_reject_settlement
}