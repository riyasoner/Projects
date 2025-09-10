const { where, Op } = require("sequelize");
const db = require("../../../config/config"); // Adjust the path to your config file
const Book = db.book;
const account = db.account;
const transaction = db.transaction;
const alloted_book = db.alloted_book;
const alloted_account = db.alloted_account;
const User = db.user;

// Create a new edit book
const create_Book = async (req, res) => {
  try {
    const {
      name,
      description,
      usage_type,
      usage_mode,
      account_unit,
      time_zone,
      hide_account,
      createrBySuperAdmin,
      createdByUserId,
    } = req.body;

    // Validate usage_mode value
    const allowedUsageModes = ["simple", "normal"];
    if (!allowedUsageModes.includes(usage_mode)) {
      return res.status(201).json({
        status: false,
        message: `Invalid usage_mode. Allowed values are: ${allowedUsageModes.join(
          ", "
        )}`,
        data: [],
      });
    }

    const newEditBook = await Book.create({
      name,
      description,
      usage_type,
      usage_mode,
      account_unit,
      time_zone,
      hide_account: hide_account || false,
      createrBySuperAdmin,
      createdByUserId,
    });

    if (!newEditBook) {
      return res.status(201).json({
        status: false,
        message: "edit book not created",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Edit book created successfully",
      data: newEditBook,
    });
  } catch (error) {
    console.error("Error in createEditBook API:", error.message);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Get all edit books
const getAllBooks = async (req, res) => {
  const { createdByUserId } = req.query;
  try {
    const whereClause = createdByUserId ? { createdByUserId } : {};

    const editBooks = await Book.findAll({ where: whereClause });

    if (!editBooks || editBooks.length === 0) {
      return res.status(200).json({
        status: false,
        message: "Books are not found",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Books are retrieved successfully",
      data: editBooks,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Get Admin Home page without UserId all account
// const getBookById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { userId } = req.query;

//     // Fetch the allotted book associated with the given bookId and userId
//     const allottedBook = await alloted_book.findOne({
//       where: { bookId: id },
//       include: [
//         {
//           model: Book,
//           as: "book",
//           include: [
//             {
//               model: account,
//               as: "account",
//               where: { is_deleted: false },
//               required: false,
//               attributes: ["id", "name", "account_type", "balance"],
//               include: [
//                 {
//                   model: transaction,
//                   as: "transaction",
//                   attributes: [
//                     "id",
//                     "accountId",
//                     "amount",
//                     "transaction_type",
//                     "transaction_date",
//                     "transaction_time",
//                   ],
//                   required: false,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     });

//     if (!allottedBook || !allottedBook.book) {
//       return res.status(404).json({
//         status: false,
//         message: "Book not found",
//       });
//     }

//     const book = allottedBook.book;
//     const creditTransactionTypes = [
//       "INCOME",
//       "TRANSFER",
//       "COLLECTION",
//       "SALE",
//       "INVENTORY_SALE",
//     ];

//     // Group and calculate financial data based on account_type
//     const accountGroupedData = {};
//     book.account.forEach((account) => {
//       const transactions = account.transaction || [];

//       // Calculate total credits
//       const totalCredits = transactions
//         .filter(
//           (tx) =>
//             creditTransactionTypes.includes(tx.transaction_type) ||
//             ((account.account_type === "PERSONNEL" ||
//               account.account_type === "PAYABLE_RECEIVABLE") &&
//               tx.transaction_type === "PAYMENT")
//         )
//         .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

//       // Calculate total debits
//       const totalDebits = transactions
//         .filter(
//           (tx) =>
//             !creditTransactionTypes.includes(tx.transaction_type) &&
//             !(
//               (account.account_type === "PERSONNEL" ||
//                 account.account_type === "PAYABLE_RECEIVABLE") &&
//               tx.transaction_type === "PAYMENT"
//             )
//         )
//         .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

//       // Calculate net profit
//       const netProfit = totalCredits - totalDebits;

//       // Group by account_type
//       if (!accountGroupedData[account.account_type]) {
//         accountGroupedData[account.account_type] = [];
//       }

//       accountGroupedData[account.account_type].push({
//         id: account.id,
//         account_name: account.name,
//         account_type: account.account_type,
//         account_balance: account.balance,
//         totalCredits,
//         totalDebits,
//         netProfit,
//       });
//     });

//     const responseData = {
//       bookDetails: {
//         id: book.id,
//         name: book.name,
//         description: book.description,
//         usage_type: book.usage_type,
//         usage_mode: book.usage_mode,
//         createdAt: book.createdAt,
//         updatedAt: book.updatedAt,
//       },
//       accounts: accountGroupedData,
//     };

//     return res.status(200).json({
//       status: true,
//       message: "Book retrieved successfully",
//       data: responseData,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    // Fetch the allotted book associated with the given bookId and userId
    const allottedBook = await alloted_book.findOne({
      where: { bookId: id },
      include: [
        {
          model: Book,
          as: "book",
          include: [
            {
              model: account,
              as: "account",
              where: {
                is_deleted: false,
                ...(userId && { userId }), // Filter by userId if provided
              },
              required: false,
              attributes: ["id", "name", "account_type", "balance"],
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
                  ],
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!allottedBook || !allottedBook.book) {
      return res.status(404).json({
        status: false,
        message: "Book not found",
      });
    }

    const book = allottedBook.book;
    const creditTransactionTypes = [
      "INCOME",
      "TRANSFER",
      "COLLECTION",
      "SALE",
      "INVENTORY_SALE",
    ];

    const accountGroupedData = {};
    let totalBookBalance = 0;

    book.account.forEach((account) => {
      const transactions = account.transaction || [];

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

      const netProfit = totalCredits - totalDebits;

      totalBookBalance += parseFloat(account.balance || 0); // Accumulate total book balance

      if (!accountGroupedData[account.account_type]) {
        accountGroupedData[account.account_type] = [];
      }

      accountGroupedData[account.account_type].push({
        id: account.id,
        account_name: account.name,
        account_type: account.account_type,
        account_balance: account.balance,
        totalCredits,
        totalDebits,
        netProfit,
      });
    });

    const responseData = {
      bookDetails: {
        id: book.id,
        name: book.name,
        description: book.description,
        usage_type: book.usage_type,
        usage_mode: book.usage_mode,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
        totalBalance: totalBookBalance, // Add overall balance
      },
      accounts: accountGroupedData,
    };

    return res.status(200).json({
      status: true,
      message: "Book retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// User side home page Get All acc with respect to userId
const getBookById_user_side = async (req, res) => {
  try {
    const { userId } = req.query;

    // Check if user exists
    const check_user = await User.findOne({ where: { id: userId } });

    if (!check_user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Check user type
    if (check_user.user_type !== "user") {
      return res.status(403).json({
        status: false,
        message: "Access denied. Only users can access this resource.",
      });
    }

    // Fetch allotted books and related accounts
    const allottedBooks = await alloted_account.findAll({
      where: { userId },
      include: [
        {
          model: account,
          as: "account",
          attributes: ["id", "name", "account_type", "balance", "bookId"],
          required: false, // Allows returning even if no accounts exist
        },
      ],
    });

    // Check if any allotted accounts exist
    if (!allottedBooks || allottedBooks.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No allotted accounts found for this user",
      });
    }

    // Extract only account details and filter out null values
    const accounts = allottedBooks
      .map((entry) => entry.account)
      .filter((acc) => acc); // Removes null accounts

    return res.status(200).json({
      status: true,
      message: "Accounts retrieved successfully",
      data: accounts, // Only return the accounts array
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Update an edit book by ID
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Book.update(req.body, { where: { id } });

    if (updated === 0) {
      return res.status(404).json({
        status: false,
        message: "Edit book not found or no changes made",
      });
    }

    const updatedEditBook = await Book.findOne({ where: { id } });

    return res.status(200).json({
      status: true,
      message: "Edit book updated successfully",
      data: updatedEditBook,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Delete an edit book by ID
const deletBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Delete related transactions
    await transaction.destroy({ where: { bookId: id } });

    const deleted = await Book.destroy({ where: { id } });

    if (!deleted) {
      return res.status(200).json({
        status: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

//Admin Side Home Screen Arrow simbol api report(PDF)
const get_book_report = async (req, res) => {
  try {
    const { id } = req.params;

    const { account_type, userId } = req.query;

    const whereCondition = { is_deleted: false, bookId: id };

    // if (account_type) {
    //     whereCondition.account_type = { [Op.eq]: account_type };
    // }
    if (account_type) {
      const typesArray = account_type
        .split("-")
        .filter((type) => type.trim() !== ""); // Ensure valid types
      if (typesArray.length > 0) {
        whereCondition.account_type = { [Op.in]: typesArray };
      }
    }

    const editBook = await Book.findOne({
      where: { id },
      include: [
        {
          model: account,
          as: "account",
          // where: { is_deleted: false },
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
              ],
              // where:{userId}
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    if (!editBook) {
      return res.status(404).json({
        status: false,
        message: "Book not found",
      });
    }

    const creditTransactionTypes = [
      "INCOME",
      "TRANSFER",
      "COLLECTION",
      "SALE",
      "INVENTORY_SALE",
    ];

    // Group and calculate financial data based on account_type
    const accountGroupedData = {};
    const accountTypeTotals = {}; // Store total credits, debits, and net profit for each account type

    editBook.account.forEach((account) => {
      const transactions = account.transaction || [];

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

      // Group by account_type
      if (!accountGroupedData[account.account_type]) {
        accountGroupedData[account.account_type] = [];
        accountTypeTotals[account.account_type] = {
          totalCredits: 0,
          totalDebits: 0,
          totalNetProfit: 0,
        };
      }

      accountGroupedData[account.account_type].push({
        id: account.id,
        account_name: account.name,
        account_type: account.account_type,
        totalCredits,
        totalDebits,
        netProfit,
      });

      // Update totals for account type
      accountTypeTotals[account.account_type].totalCredits += totalCredits;
      accountTypeTotals[account.account_type].totalDebits += totalDebits;
      accountTypeTotals[account.account_type].totalNetProfit += netProfit;
    });

    // Append totals to each account type group
    const accountSummaryData = {}; // Store summary separately

    for (const accountType in accountTypeTotals) {
      accountSummaryData[`${accountType}_summary`] = {
        OverAllCredits: accountTypeTotals[accountType].totalCredits,
        OverAllDebits: accountTypeTotals[accountType].totalDebits,
        OverAllNetProfit: accountTypeTotals[accountType].totalNetProfit,
      };
    }

    // Merge the structured accountGroupedData with summary data
    const responseData = {
      bookDetails: {
        id: editBook.id,
        name: editBook.name,
        description: editBook.description,
        usage_type: editBook.usage_type,
        usage_mode: editBook.usage_mode,
        createdAt: editBook.createdAt,
        updatedAt: editBook.updatedAt,
      },
      accounts: { ...accountGroupedData, ...accountSummaryData },
    };

    return res.status(200).json({
      status: true,
      message: "Book retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// User Side Home Screen Arrow simbol api report(PDF)
const get_account_report = async (req, res) => {
  try {
    const { account_type, userId } = req.query;
    const whereCondition = {};

    if (userId) {
      whereCondition.userId = { [Op.eq]: userId };
    }

    if (account_type) {
      const typesArray = account_type
        .split("-")
        .filter((type) => type.trim() !== ""); // Ensure valid types
      if (typesArray.length > 0) {
        whereCondition.account_type = { [Op.in]: typesArray };
      }
    }

    // Fetch allotted accounts along with their related accounts and transactions
    const allottedAccounts = await alloted_account.findAll({
      where: { userId }, // Ensure userId is applied correctly
      include: [
        {
          model: account,
          as: "account",
          attributes: ["id", "name", "account_type", "balance"],
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
              ],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    if (!allottedAccounts || allottedAccounts.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No accounts found for the given user.",
      });
    }

    const creditTransactionTypes = [
      "INCOME",
      "TRANSFER",
      "COLLECTION",
      "SALE",
      "INVENTORY_SALE",
    ];

    // Group and calculate financial data based on account_type
    const accountGroupedData = {};
    const accountTypeTotals = {}; // Store total credits, debits, and net profit for each account type

    allottedAccounts.forEach((entry) => {
      if (!entry.account) return;

      const account = entry.account;
      const transactions = account.transaction || [];

      // Calculate total credits
      const totalCredits = transactions
        .filter((tx) => creditTransactionTypes.includes(tx.transaction_type))
        .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

      // Calculate total debits
      const totalDebits = transactions
        .filter((tx) => !creditTransactionTypes.includes(tx.transaction_type))
        .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

      // Calculate net profit
      const netProfit = totalCredits - totalDebits;

      // Group by account_type
      if (!accountGroupedData[account.account_type]) {
        accountGroupedData[account.account_type] = [];
        accountTypeTotals[account.account_type] = {
          totalCredits: 0,
          totalDebits: 0,
          totalNetProfit: 0,
        };
      }

      accountGroupedData[account.account_type].push({
        id: account.id,
        account_name: account.name,
        account_type: account.account_type,
        balance: account.balance,
        totalCredits,
        totalDebits,
        netProfit,
      });

      // Update totals for account type
      accountTypeTotals[account.account_type].totalCredits += totalCredits;
      accountTypeTotals[account.account_type].totalDebits += totalDebits;
      accountTypeTotals[account.account_type].totalNetProfit += netProfit;
    });

    // Append totals to each account type group
    const accountSummaryData = {};

    for (const accountType in accountTypeTotals) {
      accountSummaryData[`${accountType}_summary`] = {
        OverAllCredits: accountTypeTotals[accountType].totalCredits,
        OverAllDebits: accountTypeTotals[accountType].totalDebits,
        OverAllNetProfit: accountTypeTotals[accountType].totalNetProfit,
      };
    }

    // Merge structured accountGroupedData with summary data
    const responseData = {
      accounts: { ...accountGroupedData, ...accountSummaryData },
    };

    return res.status(200).json({
      status: true,
      message: "Accounts retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  create_Book,
  getAllBooks,
  getBookById,
  updateBook,
  deletBook,
  get_book_report,
  getBookById_user_side,
  get_account_report,
};
