const db = require("../../../config/config"); // Adjust the path to your config file
const { Op, where } = require("sequelize");
const Transaction = db.transaction;
const book = db.book;
const moment = require("moment");

// Income Expence
const dashboard_inc_exp = async (req, res) => {
  try {
    const { filter_type, bookId, userId } = req.query;
    // Validate bookId
    if (!bookId) {
      return res.status(400).json({
        status: false,
        message: "bookId is required",
      });
    }

    const transactions = await Transaction.findAll({
      where: { userId: userId },
      order: [["id", "DESC"]],
      attributes: [
        "id",
        "transaction_type",
        "amount",
        "createdAt",
        "bookId",
        "userId",
      ],
      include: [
        {
          model: book,
          as: "book",
        },
      ],
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No transactions found",
      });
    }

    const find_book = await book.findOne({ where: { id: bookId } });
    if (!find_book) {
      return res.status(404).json({
        status: false,
        message: "Book not found",
      });
    }

    const book_name = find_book.name;

    let report = {};

    transactions.forEach((transaction) => {
      const dateObj = new Date(transaction.createdAt);
      let key;

      // Grouping key based on filter_type
      if (filter_type === "monthly") {
        // key = dateObj.toISOString().slice(0, 7); // YYYY-MM
        key = `${dateObj.toLocaleString("default", {
          month: "long",
        })} ${dateObj.getFullYear()}`; // Example: "February 2025"
      } else if (filter_type === "yearly") {
        key = dateObj.toISOString().slice(0, 4); // YYYY
      } else if (filter_type === "weekly") {
        const year = dateObj.getUTCFullYear();
        const week = getISOWeek(dateObj);
        key = `${year}-W${week.toString().padStart(2, "0")}`; // YYYY-WW
      } else {
        // Default to daily
        key = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
      }

      if (!report[key]) {
        report[key] = {
          Income_Expense_Summary: {
            totalIncome: 0,
            totalExpense: 0,
            totalInc_Exp: 0,
          },
          // Collection_Payment_Summary: {
          //     totalCollection: 0,
          //     totalPayment: 0,
          //     total_collection_payment: 0
          // },
          // Sale_Purchase_Summary: {
          //     totalSale: 0,
          //     totalPurchase: 0,
          //     total_Sale_Purchase: 0
          // }
        };
      }

      // Income & Expense Summary
      if (transaction.transaction_type === "INCOME") {
        report[key].Income_Expense_Summary.totalIncome += transaction.amount;
      } else if (transaction.transaction_type === "EXPENSE") {
        report[key].Income_Expense_Summary.totalExpense += transaction.amount;
      }

      report[key].Income_Expense_Summary.totalInc_Exp =
        report[key].Income_Expense_Summary.totalIncome -
        report[key].Income_Expense_Summary.totalExpense;
    });

    return res.status(200).json({
      status: true,
      message: `Transaction report retrieved successfully (${
        filter_type || "daily"
      })`,
      book_name,
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Helper function for ISO Week Calculation
const getISOWeek = (date) => {
  const tempDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = tempDate.getUTCDay() || 7; // Make Sunday = 7
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  return Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7);
};

const currentMonth_inc_exp = async (req, res) => {
  try {
    const { bookId, userId } = req.query;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "userId is required",
      });
    }

    // Get the first and last date of the current month
    const currentDate = new Date();
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Build where condition dynamically
    const whereCondition = {
      userId,
      createdAt: {
        [Op.between]: [firstDay, lastDay],
      },
    };

    if (bookId) {
      whereCondition.bookId = bookId;
    }

    // Fetch transactions for the current month
    const transactions = await Transaction.findAll({
      where: whereCondition,
      order: [["id", "DESC"]],
      attributes: ["id", "transaction_type", "amount", "createdAt", "bookId"],
      include: [
        {
          model: book,
          as: "book",
        },
      ],
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No transactions found for the current month",
      });
    }

    // Prepare report
    const monthKey = `${currentDate.toLocaleString("default", {
      month: "long",
    })} ${currentDate.getFullYear()}`;
    let report = {
      [monthKey]: {
        Income_Expense_Summary: {
          totalIncome: 0,
          totalExpense: 0,
          totalInc_Exp: 0,
        },
      },
    };

    // Aggregate transactions
    transactions.forEach((transaction) => {
      if (transaction.transaction_type === "INCOME") {
        report[monthKey].Income_Expense_Summary.totalIncome +=
          transaction.amount;
      } else if (transaction.transaction_type === "EXPENSE") {
        report[monthKey].Income_Expense_Summary.totalExpense +=
          transaction.amount;
      }
    });

    // Calculate net
    report[monthKey].Income_Expense_Summary.totalInc_Exp =
      report[monthKey].Income_Expense_Summary.totalIncome -
      report[monthKey].Income_Expense_Summary.totalExpense;

    // Get book name if specific bookId is provided
    let book_name = null;
    if (bookId) {
      const find_book = await book.findOne({ where: { id: bookId } });
      if (!find_book) {
        return res.status(404).json({
          status: false,
          message: "Book not found",
        });
      }
      book_name = find_book.name;
    }

    return res.status(200).json({
      status: true,
      message: "Current month's transaction report retrieved successfully",
      book_name,
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  dashboard_inc_exp,
  currentMonth_inc_exp,
};
