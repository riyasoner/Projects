const db = require("../../../config/config"); // Adjust the path to your config file
const Account = db.account;
const transaction = db.transaction;
const Book = db.book;
const { Op, where, fn, col } = require("sequelize");
const { hashValue } = require("../../utils/cryptoHelper");

// Create a new account
const createAccount = async (req, res) => {
  try {
    const { name, description, account_type, unit, bookId, userId } = req.body;

    if (!bookId && !userId) {
      return res.status(200).json({
        status: false,
        message: "Book id and userId are required",
      });
    }
    const check_book = await Book.findOne({ where: { id: bookId } });
    if (!check_book) {
      return res.status(200).json({
        status: false,
        message: "This book is not exists",
      });
    }

    // Validate account_type value
    const allowedAccountTypes = [
      "None",
      "PAYABLE_RECEIVABLE",
      "BANK",
      "CREDIT_CARD",
      "PRODUCT",
      "PERSONNEL",
      "SAVINGS",
      "CASH",
    ];
    if (!allowedAccountTypes.includes(account_type)) {
      return res.status(400).json({
        status: false,
        message: `Invalid account_type. Allowed values are: ${allowedAccountTypes.join(
          ", "
        )}`,
        data: [],
      });
    }

    const newAccount = await Account.create({
      name,
      description,
      account_type,
      unit,
      bookId,
      userId,
    });

    if (!newAccount) {
      return res.status(400).json({
        status: false,
        message: "Account not created",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Account created successfully",
      data: newAccount,
    });
  } catch (error) {
    console.error("Error in createAccount API:", error.message);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Get all accounts
// const getAllAccounts = async (req, res) => {
//     try {

//         const { account_type } = req.query
//         const whereCondition = {};

//         if (account_type) {
//             whereCondition.account_type = { [Op.eq]: account_type };
//         }
//         const accounts = await Account.findAll({
//             where: whereCondition,
//             include:[
//                 {
//                     model:transaction,
//                     as:"transaction"
//                 }
//             ],
//             order: [['id', 'DESC']],
//         });

//         if (!accounts || accounts.length === 0) {
//             return res.status(200).json({
//                 status: false,
//                 message: "No accounts found",
//                 data: []
//             });
//         }

//         return res.status(200).json({
//             status: true,
//             message: "Accounts retrieved successfully",
//             data: accounts
//         });
//     } catch (error) {
//         return res.status(500).json({
//             status: false,
//             message: error.message
//         });
//     }
// };

const getAllAccounts = async (req, res) => {
  try {
    const { account_type, name, id, bookId, userId, search } = req.query;
    const whereCondition = {
      is_deleted: false,
    };
    if (search) {
      // agar search value kisi account_type ke equal hai
      whereCondition[Op.or] = [
        { account_type: { [Op.eq]: search } },
        { name_hash: hashValue(search.trim()) },
      ];
    }

    if (account_type) {
      whereCondition.account_type = { [Op.eq]: account_type };
    }
    if (userId) {
      whereCondition.userId = { [Op.eq]: Number(userId) };
    }

    if (name) {
      whereCondition.name_hash = hashValue(name.trim());
    }
    if (id) {
      whereCondition.id = { [Op.eq]: id };
    }
    if (bookId) {
      whereCondition.bookId = { [Op.eq]: bookId };
    }

    // Fetch accounts with related transactions
    const accounts = await Account.findAll({
      where: whereCondition,
      include: [
        {
          model: transaction,
          as: "transaction",
          attributes: [
            "id",
            "accountId",
            "amount",
            "transaction_type",
            "transaction_date",
            "transaction_time",
          ], // Include necessary fields
        },
      ],
      order: [["id", "DESC"]],
    });

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

    const accountData = accounts.map((account) => {
      const transactions = account.transaction || [];

      // Determine credit and debit transactions based on rules
      const totalCredits = transactions
        .filter(
          (tx) =>
            creditTransactionTypes.includes(tx.transaction_type) ||
            ((account.account_type === "PERSONNEL" ||
              account.account_type === "PAYABLE_RECEIVABLE") &&
              tx.transaction_type === "PAYMENT")
        )
        .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

      const totalDebits = transactions
        .filter(
          (tx) =>
            !creditTransactionTypes.includes(tx.transaction_type) &&
            !(
              (account.account_type === "PERSONNEL" ||
                account.account_type === "PAYABLE_RECEIVABLE") &&
              tx.transaction_type === "PAYMENT"
            )
        )
        .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

      // Calculate net profit
      const netProfit = totalCredits - totalDebits;

      return {
        ...account.toJSON(), // Include account details
        totalCredits,
        totalDebits,
        netProfit,
      };
    });

    // Group by account_type for aggregated results
    const groupedData = accountData.reduce((acc, account) => {
      if (!acc[account.account_type]) {
        acc[account.account_type] = {
          account_type: account.account_type,
          totalCredits: 0,
          totalDebits: 0,
          netProfit: 0,
          accounts: [],
        };
      }

      acc[account.account_type].totalCredits += account.totalCredits;
      acc[account.account_type].totalDebits += account.totalDebits;
      acc[account.account_type].netProfit += account.netProfit;
      acc[account.account_type].accounts.push(account);

      return acc;
    }, {});

    return res.status(200).json({
      status: true,
      message: "Accounts retrieved successfully",
      data: Object.values(groupedData),
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// New Transaction according to accountId and to_account
// const getAccountById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {userId} = req.query;

//         // Build where condition dynamically
//         let accountWhereCondition = { id };
//         if (userId) {
//           accountWhereCondition.userId = userId;
//         }

//     // Fetch the account without filtering transactions
//     const account = await Account.findOne({
//       where: accountWhereCondition,
//     });

//     // Check if the account exists
//     if (!account) {
//       return res.status(404).json({
//         status: false,
//         message: "Account not found",
//       });
//     }

//     // Fetch transactions separately ensuring both accountId and to_account are considered
//     const transactions = await transaction.findAll({

//     where: {
//         [Op.and]: [
//           { [Op.or]: [{ accountId: id }, { to_account: id }] }, // Match either accountId or to_account
//           { userId }, // Ensure transactions also belong to userId
//         ],
//       },
//       attributes: [
//         "id",
//         "accountId",
//         "source_acc_name",
//         "amount",
//         "to_account",
//         "target_acc_name",
//         "transaction_type",
//         "transaction_date",
//         "bookId",
//         "transaction_time",
//         "account_settled",
//         "description",
//         "acc_setled_date",
//         "userId"
//       ],
//     });

//     const creditTransactionTypes = [
//       "INCOME",
//       "TRANSFER",
//       "COLLECTION",
//       "SALE",
//       "INVENTORY_SALE",
//     ];

//     // Calculate total credits
//     const totalCredits = transactions
//       .filter((tx) =>
//         creditTransactionTypes.includes(tx.transaction_type) ||
//         (account.account_type === "PERSONNEL" ||
//           account.account_type === "PAYABLE_RECEIVABLE") &&
//         tx.transaction_type === "PAYMENT"
//       )
//       .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

//     // Calculate total debits
//     const totalDebits = transactions
//       .filter((tx) =>
//         !creditTransactionTypes.includes(tx.transaction_type) &&
//         !((account.account_type === "PERSONNEL" ||
//           account.account_type === "PAYABLE_RECEIVABLE") &&
//           tx.transaction_type === "PAYMENT")
//       )
//       .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

//     // Calculate net profit
//     const netProfit = totalCredits - totalDebits;

//     // Construct the response data
//     const responseData = {
//       id: account.id,
//       account_name: account.name,
//       account_type: account.account_type,
//       balance:account.balance,
//       totalCredits,
//       totalDebits,
//       netProfit,
//       transactions, // Transactions retrieved separately
//     };

//     return res.status(200).json({
//       status: true,
//       message: "Account retrieved successfully",
//       data: responseData,
//     });
//   } catch (error) {
//     // Handle errors
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// userId Optional if yes then show only userid trasaction otherwise all
const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query; // userId is optional

    // Fetch the account without filtering transactions
    const account = await Account.findOne({ where: { id } });

    // Check if the account exists
    if (!account) {
      return res.status(200).json({
        status: false,
        message: "Account not found",
      });
    }

    // Build where condition for transactions dynamically
    let transactionWhereCondition = {
      [Op.or]: [{ accountId: id }, { to_account: id }], // Match either accountId or to_account
    };

    if (userId) {
      transactionWhereCondition.userId = userId; // Only fetch transactions for this user
    }

    // Fetch transactions based on userId condition
    const transactions = await transaction.findAll({
      where: transactionWhereCondition,
      // attributes: [
      //   "id",
      //   "accountId",
      //   "source_acc_name",
      //   "amount",
      //   "to_account",
      //   "target_acc_name",
      //   "transaction_type",
      //   "transaction_date",
      //   "bookId",
      //   "transaction_time",
      //   "account_settled",
      //   "description",
      //   "acc_setled_date",
      //   "userId",
      //   "view_by_superAdmin",
      //   "upload_image",
      // ],
    });

    const creditTransactionTypes = [
      "INCOME",
      "TRANSFER",
      "COLLECTION",
      "SALE",
      "INVENTORY_SALE",
    ];

    // Calculate total credits
    const totalCredits = transactions
      .filter(
        (tx) =>
          creditTransactionTypes.includes(tx.transaction_type) ||
          ((account.account_type === "PERSONNEL" ||
            account.account_type === "PAYABLE_RECEIVABLE") &&
            tx.transaction_type === "PAYMENT")
      )
      .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

    // Calculate total debits
    const totalDebits = transactions
      .filter(
        (tx) =>
          !creditTransactionTypes.includes(tx.transaction_type) &&
          !(
            (account.account_type === "PERSONNEL" ||
              account.account_type === "PAYABLE_RECEIVABLE") &&
            tx.transaction_type === "PAYMENT"
          )
      )
      .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

    // Calculate net profit
    const netProfit = totalCredits - totalDebits;

    // Construct the response data
    const responseData = {
      id: account.id,
      account_name: account.name,
      account_type: account.account_type,
      balance: account.balance,
      totalCredits,
      totalDebits,
      netProfit,
      transactions, // Transactions based on userId condition
    };

    return res.status(200).json({
      status: true,
      message: "Account retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// get account by id only for balance purpose

const getAccountById_for_balance = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find the account directly
    const account = await Account.findOne({
      where: { id },
      // attributes: ['id', ['name', 'account_name'], 'account_type', 'balance'],
    });

    if (!account) {
      return res.status(404).json({
        status: false,
        message: "Account not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Account retrieved successfully",
      data: account,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Update an account by ID
const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // if (req.body.account_type) {
    //   // Validate account_type value if it is being updated
    //   const allowedAccountTypes = [
    //     "payable",
    //     "bank",
    //     "credit card",
    //     "product",
    //     "personnal",
    //     "savings",
    //     "cash",
    //   ];
    //   if (!allowedAccountTypes.includes(req.body.account_type)) {
    //     return res.status(200).json({
    //       status: false,
    //       message: `Invalid account_type. Allowed values are: ${allowedAccountTypes.join(
    //         ", "
    //       )}`,
    //     });
    //   }
    // }

    const [updated] = await Account.update(req.body, { where: { id } });

    if (updated === 0) {
      return res.status(200).json({
        status: false,
        message: "Account not found or no changes made",
      });
    }

    const updatedAccount = await Account.findOne({ where: { id } });

    return res.status(200).json({
      status: true,
      message: "Account updated successfully",
      data: updatedAccount,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Delete an account by ID
const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Account.findOne({ where: { id } });

    if (!deleted) {
      return res.status(200).json({
        status: false,
        message: "Account not found",
      });
    }
    const update_is_deleted = deleted.is_deleted;

    if (update_is_deleted) {
      return res
        .status(200)
        .json({ status: false, message: "This account already deleted" });
    }
    deleted.is_deleted = "true";
    await deleted.save();

    return res.status(200).json({
      status: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// archive an account by ID
const archiveAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const archived = await Account.findOne({ where: { id } });

    if (!archived) {
      return res.status(200).json({
        status: false,
        message: "Account not found",
      });
    }
    const update_is_archive = archived.is_archive;

    if (update_is_archive) {
      return res.status(200).json({
        status: false,
        message: "This account already add on archived",
      });
    }
    archived.is_archive = "true";
    await archived.save();

    return res.status(200).json({
      status: true,
      message: "Account added on archived successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const get_deleted_and_archive_account = async (req, res) => {
  try {
    const { is_archive, is_deleted, bookId, userId } = req.query;
    const whereCondition = {};

    if (is_archive !== undefined) {
      whereCondition.is_archive = { [Op.eq]: is_archive === "true" };
    }

    if (is_deleted !== undefined) {
      whereCondition.is_deleted = { [Op.eq]: is_deleted === "true" };
    }

    if (bookId !== undefined) {
      whereCondition.bookId = { [Op.eq]: bookId };
    }

    if (userId !== undefined) {
      whereCondition.userId = { [Op.eq]: userId };
    }

    const accounts = await Account.findAll({
      where: whereCondition,
      order: [["id", "DESC"]],
    });

    if (!accounts || accounts.length === 0) {
      return res.status(200).json({
        status: false,
        message: "Archive and deleted accounts are not found",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Archive and deleted accounts retrieved successfully",
      data: accounts,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const restore_account = async (req, res) => {
  try {
    const { accountId } = req.body;

    if (!accountId) {
      return res.status(400).json({
        status: false,
        message: "Account ID is required",
      });
    }

    const account = await Account.findOne({ where: { id: accountId } });

    if (!account) {
      return res.status(404).json({
        status: false,
        message: "Account not found",
      });
    }

    if (account.is_deleted === false) {
      return res.status(200).json({
        status: false,
        message: "Account is already restored",
      });
    }

    account.is_deleted = false;
    await account.save();

    return res.status(200).json({
      status: true,
      message: "Account restored successfully",
      data: account,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deleteAccountPermanently = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await Account.findOne({ where: { id } });

    if (!account) {
      return res.status(404).json({
        status: false,
        message: "Account not found",
      });
    }

    await Account.destroy({ where: { id } });

    return res.status(200).json({
      status: true,
      message: "Account permanently deleted",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getAccountSuggestions = async (req, res) => {
  try {
    const { search, bookId, userId } = req.query;

    if (!search || !search.trim()) {
      return res.status(200).json({
        status: false,
        message: "Search query is required",
        data: [],
      });
    }

    const trimmedSearch = search.trim().toLowerCase();

    const accounts = await Account.findAll({
      where: {
        is_deleted: false,
        [Op.or]: [
          // Case-insensitive search on account_type
          where(fn("LOWER", col("account_type")), {
            [Op.like]: `%${trimmedSearch}%`,
          }),
          // Case-insensitive search on name
          where(fn("LOWER", col("name")), {
            [Op.like]: `%${trimmedSearch}%`,
          }),
          // Optional: hash match if you store hashed names
          { name_hash: hashValue(search.trim()) },
        ],
      },
      attributes: ["id", "name", "account_type", "description"],
      limit: 10,
      order: [["name", "ASC"]],
    });

    return res.status(200).json({
      status: true,
      message: "Suggestions retrieved successfully",
      data: accounts,
    });
  } catch (error) {
    console.error("Suggestion API error:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  archiveAccount,
  get_deleted_and_archive_account,
  getAccountById_for_balance,
  restore_account,
  deleteAccountPermanently,
  getAccountSuggestions,
};
