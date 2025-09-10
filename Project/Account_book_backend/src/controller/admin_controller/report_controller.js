const dayjs = require("dayjs");
const db = require("../../../config/config"); // Adjust the path to your config file
const { Op, where, Sequelize } = require("sequelize");
const Transaction = db.transaction;
const Account = db.account;
const book = db.book;
const alloted_account = db.alloted_account;
const moment = require("moment");
const { hashValue, decrypt } = require("../../utils/cryptoHelper");

// transaction_type report
const get_transaction_type_report = async (req, res) => {
  try {
    const {
      filter_type,
      bookId,
      name,
      account_type,
      category,
      transaction_type,
      from_date,
      to_date,
      userId,
    } = req.query;

    const whereCondition = {};

    // Filter by transaction_type if provided
    if (transaction_type) {
      const typesArray = transaction_type
        .split("-")
        .filter((type) => type.trim() !== ""); // Ensure valid types
      if (typesArray.length > 0) {
        whereCondition.transaction_type = { [Op.in]: typesArray };
      }
    }

    // Filter by bookId if provided
    if (bookId) {
      whereCondition.bookId = { [Op.eq]: bookId };
    }

    // Filter by userId if provided
    if (userId) {
      whereCondition.userId = { [Op.eq]: userId };
    }

    // Filter by category if provided
    if (category) {
      whereCondition.category = category;
    }

    // Filter by date range if provided
    if (from_date && to_date) {
      const formattedFromDate = moment(from_date, "MM-DD-YYYY")
        .startOf("day")
        .toDate();
      const formattedToDate = moment(to_date, "MM-DD-YYYY")
        .endOf("day")
        .toDate();
      whereCondition.createdAt = {
        [Op.between]: [formattedFromDate, formattedToDate],
      };
    }

    // Fetch transactions based on provided filters
    const transactions = await Transaction.findAll({
      where: whereCondition,
      order: [["id", "DESC"]],
      attributes: ["id", "transaction_type", "amount", "createdAt", "bookId"],
      include: [
        {
          model: book,
          as: "book",
          required: false, // Make book inclusion optional
        },
        {
          model: Account,
          as: "account",
          required: false, // Make account inclusion optional
          attributes: ["id", "account_type", "name", "bookId"],
          where: {
            ...(account_type ? { account_type } : {}),
            ...(name ? { name: { [Op.like]: `%${name}%` } } : {}), // Filter by name if provided
          },
        },
      ],
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No transactions found",
      });
    }

    // Fetch book details only if bookId is provided
    let book_name = null;
    if (bookId) {
      const find_book = await book.findOne({ where: { id: bookId } });
      if (find_book) {
        book_name = find_book.name;
      }
    }

    let report = {};

    transactions.forEach((transaction) => {
      const dateObj = new Date(transaction.createdAt);
      let key;

      // Grouping key based on filter_type
      if (filter_type === "monthly") {
        key = dateObj.toISOString().slice(0, 7); // YYYY-MM
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
          Collection_Payment_Summary: {
            totalCollection: 0,
            totalPayment: 0,
            total_collection_payment: 0,
          },
          Sale_Purchase_Summary: {
            totalSale: 0,
            totalPurchase: 0,
            total_Sale_Purchase: 0,
          },
        };
      }

      // Income & Expense Summary
      if (transaction.transaction_type === "INCOME") {
        report[key].Income_Expense_Summary.totalIncome += transaction.amount;
      } else if (transaction.transaction_type === "EXPENSE") {
        report[key].Income_Expense_Summary.totalExpense += transaction.amount;
      }

      // Collection & Payment Summary
      if (transaction.transaction_type === "COLLECTION") {
        report[key].Collection_Payment_Summary.totalCollection +=
          transaction.amount;
      } else if (transaction.transaction_type === "PAYMENT") {
        report[key].Collection_Payment_Summary.totalPayment +=
          transaction.amount;
      }

      // Sale & Purchase Summary
      if (transaction.transaction_type === "SALE") {
        report[key].Sale_Purchase_Summary.totalSale += transaction.amount;
      } else if (transaction.transaction_type === "PURCHASE") {
        report[key].Sale_Purchase_Summary.totalPurchase += transaction.amount;
      }

      // Net Calculations
      report[key].Income_Expense_Summary.totalInc_Exp =
        report[key].Income_Expense_Summary.totalIncome -
        report[key].Income_Expense_Summary.totalExpense;

      report[key].Collection_Payment_Summary.total_collection_payment =
        report[key].Collection_Payment_Summary.totalCollection -
        report[key].Collection_Payment_Summary.totalPayment;

      report[key].Sale_Purchase_Summary.total_Sale_Purchase =
        report[key].Sale_Purchase_Summary.totalSale -
        report[key].Sale_Purchase_Summary.totalPurchase;
    });

    return res.status(200).json({
      status: true,
      message: `Transaction report retrieved successfully (${
        filter_type || "daily"
      })`,
      category,
      account_name: name,
      account_type,
      transaction_type,
      bookId,
      userId,
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

// according to account name report
const get_report_according_account_name = async (req, res) => {
  try {
    const {
      account_type,
      name,
      id,
      to_date,
      from_date,
      createdAt,
      bookId,
      filter_type,
      category,
      transaction_type,
      userId,
    } = req.query;

    const whereCondition = { is_deleted: false };

    if (userId) whereCondition.userId = userId;
    if (name) whereCondition.name = name;
    if (account_type) whereCondition.account_type = account_type;
    if (id) whereCondition.id = id;

    if (createdAt) {
      const formattedcreatedAt = moment(createdAt, "MM-DD-YYYY")
        .startOf("day")
        .toDate();
      whereCondition.createdAt = { [Op.gte]: formattedcreatedAt };
    }

    if (from_date && to_date) {
      const formattedFromDate = moment(from_date, "MM-DD-YYYY")
        .startOf("day")
        .toDate();
      const formattedToDate = moment(to_date, "MM-DD-YYYY")
        .endOf("day")
        .toDate();
      whereCondition.createdAt = {
        [Op.between]: [formattedFromDate, formattedToDate],
      };
    }

    let book_name = null;
    if (bookId) {
      const find_book = await book.findOne({ where: { id: bookId } });
      if (!find_book) {
        return res
          .status(404)
          .json({ status: false, message: "Book not found" });
      }
      book_name = find_book.name;
    }

    let accounts = [];
    const find_acc = await alloted_account.findAll({ where: { userId } });

    if (!find_acc) {
      console.log("No account found");
      return;
    }

    const find_account_ids = find_acc.map((acc) => acc.id);
    // console.log("Find account", find_account_ids)

    if (userId && bookId) {
      accounts = await Account.findAll({
        where: { userId, bookId },
        attributes: ["id", "name", "account_type", "bookId", "userId"],
        include: [
          {
            model: Transaction,
            as: "transaction", // Ensure alias matches the expected output
            attributes: [
              "id",
              "accountId",
              "to_account",
              "amount",
              "transaction_type",
              "transaction_date",
              "bookId",
              "createdAt",
            ],
            required: false, // Ensure accounts without transactions are still included
            on: {
              bookId,
              userId,
              [Op.or]: [
                {
                  "$account.id$": {
                    [Op.eq]: Sequelize.col("transaction.accountId"),
                  },
                },
                {
                  "$account.id$": {
                    [Op.eq]: Sequelize.col("transaction.to_account"),
                  },
                },
              ],
              ...(transaction_type
                ? { transaction_type: { [Op.in]: transaction_type.split("-") } }
                : {}),
              ...(category ? { category: { [Op.like]: `%${category}%` } } : {}),
            },
          },
        ],
        order: [["id", "DESC"]],
        // logging: console.log  // Debugging SQL output
      });

      if (!accounts || accounts.length === 0) {
        return res
          .status(200)
          .json({ status: false, message: "No accounts found", data: [] });
      }

      const creditTransactionTypes = [
        "INCOME",
        "TRANSFER",
        "COLLECTION",
        "SALE",
        "INVENTORY_SALE",
      ];

      const accountReports = accounts.map((account) => {
        const transactionsGrouped = {};

        (account.transaction || []).forEach((transaction) => {
          const dateObj = new Date(transaction.createdAt);
          let key;

          if (filter_type === "monthly") {
            key = dateObj.toISOString().slice(0, 7);
          } else if (filter_type === "yearly") {
            key = dateObj.toISOString().slice(0, 4);
          } else if (filter_type === "weekly") {
            const year = dateObj.getUTCFullYear();
            const week = getISOWeek(dateObj);
            key = `${year}-W${week.toString().padStart(2, "0")}`;
          } else {
            key = dateObj.toISOString().split("T")[0];
          }

          if (!transactionsGrouped[key]) {
            transactionsGrouped[key] = { totalCredits: 0, totalDebits: 0 };
          }

          if (creditTransactionTypes.includes(transaction.transaction_type)) {
            transactionsGrouped[key].totalCredits += transaction.amount;
          } else {
            transactionsGrouped[key].totalDebits += transaction.amount;
          }
        });

        return {
          id: account.id,
          name: account.name,
          account_type: account.account_type,
          bookId: account.bookId,
          userId: account.userId,
          category,
          transaction_type,
          book_name,
          report: Object.entries(transactionsGrouped).map(([period, data]) => ({
            period,
            totalCredits: data.totalCredits,
            totalDebits: data.totalDebits,
            netProfit: data.totalCredits - data.totalDebits,
          })),
        };
      });

      return res.status(200).json({
        status: true,
        message: "Transaction report retrieved successfully",
        data: accountReports,
      });
    }
    // else

    if (userId) {
      const find_acc = await alloted_account.findAll({ where: { userId } });

      if (!find_acc || find_acc.length === 0) {
        console.log("No account found");
        return res.status(404).json({
          status: false,
          message: "No accounts allocated to this user",
        });
      }

      // Ensure we're mapping accountId correctly
      const find_account_ids = find_acc.map((acc) => acc.accountId);

      accounts = await alloted_account.findAll({
        where: { userId },
        include: [
          {
            model: Account,
            as: "account",
            attributes: [
              "id",
              "name",
              "createdAt",
              "account_type",
              "bookId",
              "userId",
            ],
            include: [
              {
                model: Transaction,
                as: "transaction",
                attributes: [
                  "id",
                  "accountId",
                  "to_account",
                  "amount",
                  "transaction_type",
                  "transaction_date",
                  "bookId",
                  "createdAt",
                ],
                required: false,
                where: {
                  [Op.or]: [
                    { accountId: find_account_ids }, // FK match
                    { to_account: find_account_ids.map(String) }, // Ensure `to_account` matches as a string
                  ],
                },
              },
            ],
          },
        ],
        order: [["id", "DESC"]],
      });

      // console.log("Fetched Transactions:", JSON.stringify(accounts, null, 2));

      const creditTransactionTypes = [
        "INCOME",
        "TRANSFER",
        "COLLECTION",
        "SALE",
        "INVENTORY_SALE",
      ];

      const accountReports = accounts
        .map((allotedAccount) => {
          if (
            !allotedAccount.account ||
            !allotedAccount.account.transaction ||
            allotedAccount.account.transaction.length === 0
          ) {
            console.log(
              `No transactions found for account: ${allotedAccount.account?.id}`
            );
            return null;
          }

          const transactionsGrouped = {};

          allotedAccount.account.transaction.forEach((transaction) => {
            const dateObj = new Date(transaction.createdAt);
            let key;

            if (filter_type === "monthly") {
              key = dateObj.toISOString().slice(0, 7);
            } else if (filter_type === "yearly") {
              key = dateObj.toISOString().slice(0, 4);
            } else if (filter_type === "weekly") {
              const year = dateObj.getUTCFullYear();
              const week = getISOWeek(dateObj);
              key = `${year}-W${week.toString().padStart(2, "0")}`;
            } else {
              key = dateObj.toISOString().split("T")[0];
            }

            if (!transactionsGrouped[key]) {
              transactionsGrouped[key] = { totalCredits: 0, totalDebits: 0 };
            }

            if (creditTransactionTypes.includes(transaction.transaction_type)) {
              transactionsGrouped[key].totalCredits += transaction.amount;
            } else {
              transactionsGrouped[key].totalDebits += transaction.amount;
            }
          });

          return {
            id: allotedAccount.id,
            name: allotedAccount.account.name,
            account_type: allotedAccount.account.account_type,
            bookId: allotedAccount.account.bookId,
            userId: allotedAccount.account.userId,
            book_name,
            report: Object.entries(transactionsGrouped).map(
              ([period, data]) => ({
                period,
                totalCredits: data.totalCredits,
                totalDebits: data.totalDebits,
                netProfit: data.totalCredits - data.totalDebits,
              })
            ),
          };
        })
        .filter(Boolean); // Remove null results

      return res.status(200).json({
        status: true,
        message: "Transaction report retrieved successfully",
        data: accountReports,
      });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Category Distribution
const get_category_distribution = async (req, res) => {
  try {
    const {
      account_type,
      name,
      id,
      to_date,
      from_date,
      createdAt,
      filter_type,
      bookId,
      category,
      transaction_type,
      userId,
    } = req.query;

    const whereCondition = { is_deleted: false };

    if (account_type) whereCondition.account_type = { [Op.eq]: account_type };
    if (name) whereCondition.name = { [Op.eq]: name };
    if (id) whereCondition.id = { [Op.eq]: id };

    // Date Filters
    if (createdAt && moment(createdAt, "MM-DD-YYYY", true).isValid()) {
      whereCondition.createdAt = {
        [Op.gte]: moment(createdAt, "MM-DD-YYYY").startOf("day").toDate(),
      };
    } else if (createdAt) {
      return res.status(400).json({
        status: false,
        message: "Invalid date format for createdAt. Use MM-DD-YYYY.",
      });
    }

    if (
      from_date &&
      to_date &&
      moment(from_date, "MM-DD-YYYY", true).isValid() &&
      moment(to_date, "MM-DD-YYYY", true).isValid()
    ) {
      whereCondition.createdAt = {
        [Op.between]: [
          moment(from_date, "MM-DD-YYYY").startOf("day").toDate(),
          moment(to_date, "MM-DD-YYYY").endOf("day").toDate(),
        ],
      };
    } else if (from_date || to_date) {
      return res.status(400).json({
        status: false,
        message:
          "Invalid date format for from_date or to_date. Use MM-DD-YYYY.",
      });
    }

    let accounts = [];
    let find_book = null;

    if (bookId && userId) {
      find_book = await book.findOne({ where: { id: bookId } });
      if (!find_book) {
        return res
          .status(404)
          .json({ status: false, message: "Book not found" });
      }

      accounts = await Account.findAll({
        where: whereCondition,
        attributes: ["id", "name", "createdAt", "account_type"],
        include: [
          {
            model: Transaction,
            as: "transaction",
            attributes: [
              "id",
              "accountId",
              "amount",
              "transaction_type",
              "transaction_date",
              "createdAt",
              "category",
              "bookId",
            ],
            required: false, // Ensure accounts without transactions are still included
            on: {
              bookId,
              userId,
              [Op.or]: [
                {
                  "$account.id$": {
                    [Op.eq]: Sequelize.col("transaction.accountId"),
                  },
                },
                {
                  "$account.id$": {
                    [Op.eq]: Sequelize.col("transaction.to_account"),
                  },
                },
              ],
              ...(transaction_type
                ? { transaction_type: { [Op.in]: transaction_type.split("-") } }
                : {}),
              ...(category ? { category: { [Op.like]: `%${category}%` } } : {}),
            },
          },
        ],
        order: [["id", "DESC"]],
      });
    }

    if (userId) {
      const allotedAccounts = await alloted_account.findAll({
        where: { userId },
        include: [
          {
            model: Account,
            as: "account",
            attributes: ["id", "name", "createdAt", "account_type"],
            include: [
              {
                model: Transaction,
                as: "transaction",
                attributes: [
                  "id",
                  "accountId",
                  "amount",
                  "transaction_type",
                  "transaction_date",
                  "createdAt",
                  "category",
                  "bookId",
                ],
                where: {
                  userId,
                  [Op.or]: [
                    { accountId: { [Op.col]: "account.id" } }, // Match accountId
                    { to_account: { [Op.col]: "account.id" } }, // Match to_account
                  ],
                  ...(transaction_type
                    ? {
                        transaction_type: {
                          [Op.in]: transaction_type.split("-"),
                        },
                      }
                    : {}),
                  ...(category
                    ? { category: { [Op.like]: `%${category}%` } }
                    : {}),
                },
              },
            ],
          },
        ],
      });
      accounts = accounts.concat(
        allotedAccounts
          .map((a) => a.account)
          .filter((account) => account !== null)
      );
    }

    if (!accounts.length) {
      return res
        .status(200)
        .json({ status: false, message: "No accounts found", data: [] });
    }

    const getKeyByFilter = (date) => {
      const dateObj = new Date(date);
      if (filter_type === "monthly") return dateObj.toISOString().slice(0, 7);
      if (filter_type === "yearly") return dateObj.toISOString().slice(0, 4);
      if (filter_type === "weekly") {
        const year = dateObj.getUTCFullYear();
        const week = Math.ceil(
          ((dateObj - new Date(year, 0, 1)) / 86400000 +
            new Date(year, 0, 1).getDay() +
            1) /
            7
        );
        return `${year}-W${week.toString().padStart(2, "0")}`;
      }
      return dateObj.toISOString().split("T")[0];
    };

    const accountReports = accounts.map((account) => {
      let incomeCategoryDistribution = {};
      let expenseCategoryDistribution = {};
      let totalIncome = 0;
      let totalExpense = 0;

      (account.transaction || []).forEach((transaction) => {
        const { category, transaction_type, amount, createdAt } = transaction;
        const key = getKeyByFilter(createdAt);

        if (transaction_type === "INCOME") {
          totalIncome += parseFloat(amount);
          if (!incomeCategoryDistribution[key])
            incomeCategoryDistribution[key] = {};
          if (!incomeCategoryDistribution[key][category]) {
            incomeCategoryDistribution[key][category] = {
              totalAmount: 0,
              transactionCount: 0,
            };
          }
          incomeCategoryDistribution[key][category].totalAmount +=
            parseFloat(amount);
          incomeCategoryDistribution[key][category].transactionCount++;
        } else if (transaction_type === "EXPENSE") {
          totalExpense += parseFloat(amount);
          if (!expenseCategoryDistribution[key])
            expenseCategoryDistribution[key] = {};
          if (!expenseCategoryDistribution[key][category]) {
            expenseCategoryDistribution[key][category] = {
              totalAmount: 0,
              transactionCount: 0,
            };
          }
          expenseCategoryDistribution[key][category].totalAmount +=
            parseFloat(amount);
          expenseCategoryDistribution[key][category].transactionCount++;
        }
      });

      return {
        id: account.id,
        account_name: account.name,
        account_type: account.account_type,
        book_name: find_book ? find_book.name : null,
        category,
        transaction_type,
        totalIncome,
        income: incomeCategoryDistribution,
        totalExpense,
        expense: expenseCategoryDistribution,
      };
    });

    return res.status(200).json({
      status: true,
      message: "Transaction report retrieved successfully",
      data: accountReports,
    });
  } catch (error) {
    console.error("Error in get_category_distribution:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// report summery old (userId and bookId mandetory)

const get_summery = async (req, res) => {
  try {
    const { bookId, name, userId } = req.query;

    let book_name;
    let whereCondition = { is_deleted: false };

    if (userId) {
      whereCondition.userId = { [Op.eq]: userId };
    }

    if (name) {
      whereCondition.name = { [Op.eq]: name };
    }
    if (bookId) {
      whereCondition.bookId = { [Op.eq]: bookId };
    }

    let accounts = [];

    // Fetch book details if bookId is provided
    if (bookId && userId) {
      const find_book = await book.findOne({ where: { id: bookId } });

      // Check if book exists
      if (!find_book) {
        return res.status(404).json({
          status: false,
          message: "Book not found",
        });
      }

      book_name = find_book.name;

      // Update where condition to filter accounts by bookId
      whereCondition.bookId = bookId;
      // }

      // Fetch accounts filtered by bookId (if provided)
      accounts = await Account.findAll({
        where: { userId, bookId },
        include: [
          {
            model: Transaction,
            as: "transaction",
            attributes: ["id", "accountId", "amount", "transaction_type"], // Only necessary fields
            required: false, // Ensure accounts without transactions are still included
            on: {
              bookId,
              userId,
              [Op.or]: [
                {
                  "$account.id$": {
                    [Op.eq]: Sequelize.col("transaction.accountId"),
                  },
                },
                {
                  "$account.id$": {
                    [Op.eq]: Sequelize.col("transaction.to_account"),
                  },
                },
              ],
            },
          },
        ],
      });
    }
    if (userId) {
      const allotedAccounts = await alloted_account.findAll({
        where: { userId },
        include: [
          {
            model: Account,
            as: "account",
            attributes: ["id", "name", "createdAt", "account_type"],
            include: [
              {
                model: Transaction,
                as: "transaction",
                attributes: [
                  "id",
                  "accountId",
                  "amount",
                  "transaction_type",
                  "transaction_date",
                  "createdAt",
                  "category",
                  "bookId",
                ],
                where: {
                  userId,
                  [Op.or]: [
                    { accountId: { [Op.col]: "account.id" } }, // Match accountId
                    { to_account: { [Op.col]: "account.id" } }, // Match to_account
                  ],
                },
              },
            ],
          },
        ],
      });
      accounts = accounts.concat(
        allotedAccounts
          .map((a) => a.account)
          .filter((account) => account !== null)
      );
    }

    if (!accounts || accounts.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No accounts found",
        data: [],
      });
    }

    // Define credit transaction types
    const creditTransactionTypes = [
      "INCOME",
      "TRANSFER",
      "COLLECTION",
      "SALE",
      "INVENTORY_SALE",
    ];

    // Group transactions by `account_type`
    const groupedData = {};

    accounts.forEach((account) => {
      const transactions = account.transaction || [];

      const totalCredits = transactions
        .filter(
          (tx) =>
            creditTransactionTypes.includes(tx.transaction_type) ||
            (["PERSONNEL", "PAYABLE_RECEIVABLE"].includes(
              account.account_type
            ) &&
              tx.transaction_type === "PAYMENT")
        )
        .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

      const totalDebits = transactions
        .filter(
          (tx) =>
            !creditTransactionTypes.includes(tx.transaction_type) &&
            !(
              ["PERSONNEL", "PAYABLE_RECEIVABLE"].includes(
                account.account_type
              ) && tx.transaction_type === "PAYMENT"
            )
        )
        .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

      const netProfit = totalCredits - totalDebits;

      // Group data by `account_type`
      if (!groupedData[account.account_type]) {
        groupedData[account.account_type] = {
          account_type: account.account_type,
          totalCredits: 0,
          totalDebits: 0,
          netProfit: 0,
        };
      }

      groupedData[account.account_type].totalCredits += totalCredits;
      groupedData[account.account_type].totalDebits += totalDebits;
      groupedData[account.account_type].netProfit += netProfit;
    });

    return res.status(200).json({
      status: true,
      message: "Account summary retrieved successfully",
      book_name: bookId ? book_name : null, // Return book_name only if bookId is provided
      bookId: bookId,
      userId: userId,
      data: Object.values(groupedData), // Convert object to array
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

//report summery new (only bookId mandetory)

const get_summery_by_BookId = async (req, res) => {
  try {
    const { bookId, name, userId } = req.query;

    let book_name;
    let whereCondition = { is_deleted: false };

    if (userId) {
      whereCondition.userId = { [Op.eq]: userId };
    }

    if (name) {
      whereCondition.name = { [Op.eq]: name };
    }
    if (bookId) {
      whereCondition.bookId = { [Op.eq]: bookId };
    }

    let accounts = [];

    // Fetch book details if bookId is provided
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

    // Fetch direct accounts
    accounts = await Account.findAll({
      where: {
        ...(userId && { userId }),
        ...(bookId && { bookId }),
      },
      include: [
        {
          model: Transaction,
          as: "transaction",
          attributes: ["id", "accountId", "amount", "transaction_type"],
          required: false,
          where: {
            ...(userId && { userId }),
          },
        },
      ],
    });

    // Fetch alloted accounts if userId is provided
    if (userId) {
      const allotedAccounts = await alloted_account.findAll({
        where: { userId },
        include: [
          {
            model: Account,
            as: "account",
            attributes: ["id", "name", "createdAt", "account_type"],
            include: [
              {
                model: Transaction,
                as: "transaction",
                attributes: [
                  "id",
                  "accountId",
                  "amount",
                  "transaction_type",
                  "transaction_date",
                  "createdAt",
                  "category",
                  "bookId",
                ],
                where: {
                  ...(userId && { userId }),
                  [Op.or]: [
                    { accountId: { [Op.col]: "account.id" } },
                    { to_account: { [Op.col]: "account.id" } },
                  ],
                },
              },
            ],
          },
        ],
      });

      accounts = accounts.concat(
        allotedAccounts
          .map((a) => a.account)
          .filter((account) => account !== null)
      );
    }

    if (!accounts || accounts.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No accounts found",
        data: [],
      });
    }

    const creditTransactionTypes = [
      "INCOME",
      "TRANSFER",
      "COLLECTION",
      "SALE",
      "INVENTORY_SALE",
    ];

    const groupedData = {};

    accounts.forEach((account) => {
      const transactions = account.transaction || [];

      const totalCredits = transactions
        .filter(
          (tx) =>
            creditTransactionTypes.includes(tx.transaction_type) ||
            (["PERSONNEL", "PAYABLE_RECEIVABLE"].includes(
              account.account_type
            ) &&
              tx.transaction_type === "PAYMENT")
        )
        .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

      const totalDebits = transactions
        .filter(
          (tx) =>
            !creditTransactionTypes.includes(tx.transaction_type) &&
            !(
              ["PERSONNEL", "PAYABLE_RECEIVABLE"].includes(
                account.account_type
              ) && tx.transaction_type === "PAYMENT"
            )
        )
        .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

      const netProfit = totalCredits - totalDebits;

      if (!groupedData[account.account_type]) {
        groupedData[account.account_type] = {
          account_type: account.account_type,
          totalCredits: 0,
          totalDebits: 0,
          netProfit: 0,
        };
      }

      groupedData[account.account_type].totalCredits += totalCredits;
      groupedData[account.account_type].totalDebits += totalDebits;
      groupedData[account.account_type].netProfit += netProfit;
    });

    return res.status(200).json({
      status: true,
      message: "Account summary retrieved successfully",
      book_name: bookId ? book_name : null,
      bookId,
      userId: userId || null,
      data: Object.values(groupedData),
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Category wise report
const get_report_according_category = async (req, res) => {
  try {
    const {
      filter_type,
      bookId,
      category,
      from_date,
      to_date,
      transaction_type,
      name,
      account_type,
      userId,
    } = req.query;

    const whereCondition = {};

    // Get first and last date of the current month
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Apply filters only if values exist
    if (userId) whereCondition.userId = { [Op.eq]: userId };
    if (bookId) whereCondition.bookId = { [Op.eq]: bookId };
    if (category) whereCondition.category = category;
    if (transaction_type) {
      const typesArray = transaction_type
        .split("-")
        .filter((type) => type.trim() !== "");
      if (typesArray.length > 0) {
        whereCondition.transaction_type = { [Op.in]: typesArray };
      }
    }
    if (
      from_date &&
      to_date &&
      moment(from_date, "MM-DD-YYYY", true).isValid() &&
      moment(to_date, "MM-DD-YYYY", true).isValid()
    ) {
      whereCondition.createdAt = {
        [Op.between]: [
          moment(from_date, "MM-DD-YYYY").startOf("day").toDate(),
          moment(to_date, "MM-DD-YYYY").endOf("day").toDate(),
        ],
      };
    } else if (from_date || to_date) {
      return res.status(400).json({
        status: false,
        message:
          "Invalid date format for from_date or to_date. Use MM-DD-YYYY.",
      });
    }

    // Handle `current_month` filter
    if (filter_type === "current_month") {
      whereCondition.createdAt = { [Op.between]: [startOfMonth, endOfMonth] };
    }

    // Fetch transactions with optional filters
    const transactions = await Transaction.findAll({
      where: whereCondition,
      order: [["id", "DESC"]],
      attributes: [
        "id",
        "category",
        "transaction_type",
        "amount",
        "createdAt",
        "bookId",
      ],
      include: [
        { model: book, as: "book", attributes: ["name"] },
        {
          model: Account,
          as: "account",
          attributes: ["id", "account_type", "name", "bookId"],
          where: {
            ...(account_type ? { account_type } : {}),
            ...(name ? { name: { [Op.like]: `%${name}%` } } : {}),
          },
          required: false, // Ensure this doesn't filter out transactions if no match found
        },
      ],
    });

    if (!transactions.length) {
      return res
        .status(404)
        .json({ status: false, message: "No transactions found" });
    }

    // Fetch book details if bookId exists
    let book_name = null;
    if (bookId) {
      const find_book = await book.findOne({
        where: { id: bookId },
        attributes: ["name"],
      });
      book_name = find_book ? find_book.name : null;
    }

    const creditTransactionTypes = [
      "INCOME",
      "TRANSFER",
      "COLLECTION",
      "SALE",
      "INVENTORY_SALE",
    ];
    const transactionsGrouped = {};

    transactions.forEach((transaction) => {
      const dateObj = new Date(transaction.createdAt);
      let key;
      if (filter_type === "monthly") {
        key = dateObj.toISOString().slice(0, 7); // YYYY-MM
      } else if (filter_type === "yearly") {
        key = dateObj.toISOString().slice(0, 4); // YYYY
      } else if (filter_type === "weekly") {
        const year = dateObj.getUTCFullYear();
        const week = getISOWeek(dateObj);
        key = `${year}-W${week.toString().padStart(2, "0")}`; // YYYY-WW
      } else if (filter_type === "current_month") {
        key = dateObj.toISOString().slice(0, 7); // YYYY-MM
      } else {
        key = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
      }

      if (!transactionsGrouped[key]) {
        transactionsGrouped[key] = {
          totalCredits: 0,
          totalDebits: 0,
          netProfit: 0,
        };
      }

      if (creditTransactionTypes.includes(transaction.transaction_type)) {
        transactionsGrouped[key].totalCredits += transaction.amount;
      } else {
        transactionsGrouped[key].totalDebits += transaction.amount;
      }

      transactionsGrouped[key].netProfit =
        transactionsGrouped[key].totalCredits -
        transactionsGrouped[key].totalDebits;
    });

    return res.status(200).json({
      status: true,
      message: `Category-wise report retrieved successfully (${
        filter_type || "daily"
      })`,
      transaction_type,
      category,
      account_type,
      account_name: name,
      book_name,
      data: transactionsGrouped,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Get all transactions with respect ot category
const get_transactions_according_category = async (req, res) => {
  try {
    const {
      transaction_type,
      category,
      name,
      account_type,
      to_date,
      from_date,
      filter_type,
      bookId,
      userId,
    } = req.query;

    // if (!bookId) {
    //     return res.status(400).json({
    //         status: false,
    //         message: "bookId is required"
    //     });
    // }
    const whereCondition = {};

    if (userId) {
      whereCondition.userId = { [Op.eq]: userId };
    }

    // Filter by transaction_type
    if (transaction_type) {
      const typesArray = transaction_type
        .split("-")
        .filter((type) => type.trim() !== ""); // Ensure valid types
      if (typesArray.length > 0) {
        whereCondition.transaction_type = { [Op.in]: typesArray };
      }
    }
    if (bookId) {
      whereCondition.bookId = bookId;
    }

    // Filter by category
    if (category) {
      whereCondition.category = category;
    }

    // Filter by date range
    if (from_date && to_date) {
      const formattedFromDate = moment(from_date, "MM-DD-YYYY")
        .startOf("day")
        .toDate();
      const formattedToDate = moment(to_date, "MM-DD-YYYY")
        .endOf("day")
        .toDate();
      whereCondition.createdAt = {
        [Op.between]: [formattedFromDate, formattedToDate],
      };
    }

    // Fetch transactions with optional filtering by account_type and account.name
    const transactions = await Transaction.findAll({
      where: whereCondition,
      include: [
        {
          model: Account,
          as: "account",
          attributes: ["id", "account_type", "name", "bookId"],
          where: {
            // ...(account_type ? { account_type } : {}),
            ...(account_type
              ? { account_type: { [Op.in]: account_type.split("-") } }
              : {}),
            ...(name ? { name: { [Op.like]: `%${name}%` } } : {}), // Filter by name in Account table
          },
        },
      ],
      order: [["id", "DESC"]],
    });

    let groupedTransactions = {};

    transactions.forEach((transaction) => {
      const dateObj = new Date(transaction.createdAt);
      let key;

      // Grouping key based on filter_type
      if (filter_type === "monthly") {
        key = dateObj.toISOString().slice(0, 7); // YYYY-MM
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

      // Group transactions by the generated key
      if (!groupedTransactions[key]) {
        groupedTransactions[key] = [];
      }
      groupedTransactions[key].push(transaction);
    });

    return res.status(200).json({
      status: true,
      message:
        transactions.length > 0
          ? "Transactions retrieved successfully"
          : "No transactions found",
      data: groupedTransactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getSuperAdminCategoryDistribution = async (req, res) => {
  try {
    const { bookId, name, filter_type } = req.query;

    if (!bookId) {
      return res
        .status(400)
        .json({ status: false, message: "bookId is required" });
    }

    const accountFilter = { bookId };

    // If name is present and not empty or 'book id' (case-insensitive), apply filter
    if (name && name.trim() !== "" && name.trim().toLowerCase() !== "book id") {
      const hashedName = hashValue(name);
      accountFilter.name_hash = hashedName; // Use hash column for filtering
    }

    const accounts = await Account.findAll({
      where: accountFilter,
      attributes: ["id", "name", "account_type"],
    });

    if (!accounts.length) {
      return res.status(404).json({
        status: false,
        message: "No matching accounts found",
        data: [],
      });
    }

    const accountIds = accounts.map((acc) => acc.id);

    const transactions = await Transaction.findAll({
      where: { accountId: { [Op.in]: accountIds }, bookId },
      attributes: [
        "accountId",
        "transaction_type",
        "category",
        "amount",
        "createdAt",
      ],
      raw: true,
    });

    const getKeyByFilter = (date) => {
      const dateObj = new Date(date);
      if (filter_type === "monthly") return dateObj.toISOString().slice(0, 7);
      if (filter_type === "yearly") return dateObj.toISOString().slice(0, 4);
      if (filter_type === "weekly") {
        const year = dateObj.getUTCFullYear();
        const week = Math.ceil(
          ((dateObj - new Date(year, 0, 1)) / 86400000 +
            new Date(year, 0, 1).getDay() +
            1) /
            7
        );
        return `${year}-W${week.toString().padStart(2, "0")}`;
      }
      return dateObj.toISOString().split("T")[0];
    };

    const report = accounts.map((account) => {
      const accountTxns = transactions.filter(
        (t) => t.accountId === account.id
      );

      let incomeCategoryDistribution = {};
      let expenseCategoryDistribution = {};
      let totalIncome = 0;
      let totalExpense = 0;

      accountTxns.forEach((txn) => {
        const { transaction_type, category, amount, createdAt } = txn;
        const key = getKeyByFilter(createdAt);
        const category1 = decrypt(category); // <-- APPLY hashValue here

        if (transaction_type === "INCOME") {
          totalIncome += parseFloat(amount);
          if (!incomeCategoryDistribution[key])
            incomeCategoryDistribution[key] = {};
          if (!incomeCategoryDistribution[key][category1]) {
            incomeCategoryDistribution[key][category1] = {
              totalAmount: 0,
              transactionCount: 0,
            };
          }
          incomeCategoryDistribution[key][category1].totalAmount +=
            parseFloat(amount);
          incomeCategoryDistribution[key][category1].transactionCount++;
        } else if (transaction_type === "EXPENSE") {
          totalExpense += parseFloat(amount);
          if (!expenseCategoryDistribution[key])
            expenseCategoryDistribution[key] = {};
          if (!expenseCategoryDistribution[key][category1]) {
            expenseCategoryDistribution[key][category1] = {
              totalAmount: 0,
              transactionCount: 0,
            };
          }
          expenseCategoryDistribution[key][category1].totalAmount +=
            parseFloat(amount);
          expenseCategoryDistribution[key][category1].transactionCount++;
        }
      });

      return {
        id: account.id,
        account_name: account.name,
        account_type: account.account_type,
        book_name: null, // Optional: you can join with book to get this
        category1: null,
        transaction_type: null,
        totalIncome,
        income: incomeCategoryDistribution,
        totalExpense,
        expense: expenseCategoryDistribution,
      };
    });

    return res.status(200).json({
      status: true,
      message: "Transaction report retrieved successfully",
      data: report,
    });
  } catch (error) {
    console.error("Error in getSuperAdminCategoryDistribution:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

const getPeriodicReportByBookidAndAccountname = async (req, res) => {
  try {
    const {
      bookId,
      name,
      filter_type,
      transaction_type,
      category,
      from_date,
      to_date,
      createdAt,
    } = req.query;

    if (!bookId || !name) {
      return res.status(400).json({
        status: false,
        message: "Please provide both bookId and account name",
      });
    }

    // Find the book name
    const find_book = await book.findOne({ where: { id: bookId } });
    if (!find_book) {
      return res.status(404).json({ status: false, message: "Book not found" });
    }
    const book_name = find_book.name;

    // Build where clause for transactions
    let transactionWhere = { bookId };

    // Filter by createdAt
    if (createdAt) {
      const formattedCreatedAt = moment(createdAt, "MM-DD-YYYY")
        .startOf("day")
        .toDate();
      transactionWhere.createdAt = { [Op.gte]: formattedCreatedAt };
    }

    // Filter by from_date and to_date (overrides createdAt if both present)
    if (from_date && to_date) {
      const formattedFromDate = moment(from_date, "MM-DD-YYYY")
        .startOf("day")
        .toDate();
      const formattedToDate = moment(to_date, "MM-DD-YYYY")
        .endOf("day")
        .toDate();
      transactionWhere.createdAt = {
        [Op.between]: [formattedFromDate, formattedToDate],
      };
    }

    // transaction_type filter (supports multiple via hyphen separated)
    if (transaction_type) {
      transactionWhere.transaction_type = {
        [Op.in]: transaction_type.split("-"),
      };
    }

    // category filter (LIKE %category%)
    if (category) {
      transactionWhere.category = { [Op.like]: `%${category}%` };
    }
    const accountFilter = { bookId };

    if (name && name.trim() !== "") {
      accountFilter.name_hash = hashValue(name.trim()); // hash the name for filtering
    }

    // Find accounts matching bookId and name (no userId)
    const accounts = await Account.findAll({
      where: accountFilter,
      attributes: ["id", "name", "account_type", "bookId", "userId"],
      include: [
        {
          model: Transaction,
          as: "transaction",
          attributes: [
            "id",
            "accountId",
            "to_account",
            "amount",
            "transaction_type",
            "transaction_date",
            "bookId",
            "createdAt",
          ],
          required: false,
          where: transactionWhere,
        },
      ],
      order: [["id", "DESC"]],
    });

    if (!accounts || accounts.length === 0) {
      return res
        .status(200)
        .json({ status: false, message: "No accounts found", data: [] });
    }

    const creditTransactionTypes = [
      "INCOME",
      "TRANSFER",
      "COLLECTION",
      "SALE",
      "INVENTORY_SALE",
    ];

    const accountReports = accounts.map((account) => {
      const transactionsGrouped = {};

      (account.transaction || []).forEach((transaction) => {
        const dateObj = new Date(transaction.createdAt);
        let key;

        if (filter_type === "monthly") {
          key = dateObj.toISOString().slice(0, 7);
        } else if (filter_type === "yearly") {
          key = dateObj.toISOString().slice(0, 4);
        } else if (filter_type === "weekly") {
          const year = dateObj.getUTCFullYear();
          const week = getISOWeek(dateObj);
          key = `${year}-W${week.toString().padStart(2, "0")}`;
        } else {
          key = dateObj.toISOString().split("T")[0];
        }

        if (!transactionsGrouped[key]) {
          transactionsGrouped[key] = { totalCredits: 0, totalDebits: 0 };
        }

        if (creditTransactionTypes.includes(transaction.transaction_type)) {
          transactionsGrouped[key].totalCredits += transaction.amount;
        } else {
          transactionsGrouped[key].totalDebits += transaction.amount;
        }
      });

      return {
        id: account.id,
        name: account.name,
        account_type: account.account_type,
        bookId: account.bookId,
        userId: account.userId,
        book_name,
        report: Object.entries(transactionsGrouped).map(([period, data]) => ({
          period,
          totalCredits: data.totalCredits,
          totalDebits: data.totalDebits,
          netProfit: data.totalCredits - data.totalDebits,
        })),
      };
    });

    return res.status(200).json({
      status: true,
      message: "Transaction report retrieved successfully",
      data: accountReports,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  get_transaction_type_report,
  get_report_according_account_name,
  get_category_distribution,
  get_summery,
  get_summery_by_BookId,
  get_report_according_category,
  get_transactions_according_category,
  getSuperAdminCategoryDistribution,
  getPeriodicReportByBookidAndAccountname,
};
