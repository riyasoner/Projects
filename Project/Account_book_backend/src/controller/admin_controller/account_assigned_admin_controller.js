const { where, Op } = require("sequelize");
const db = require("../../../config/config"); // Adjust the path to your config file
const User = db.user;
const account = db.account;
const transaction = db.transaction
const alloted_account = db.alloted_account

// Assign account to User by admin
const assign_account = async (req, res) => {
  try {
      const { userId, accountId,bookId } = req.body;

      // Validate input
      if (!userId || !accountId || !bookId) {
          return res.status(400).json({
              status: false,
              message: "User ID ,Book Id and account ID are required."
          });
      }

      // Check if the account exists
      const check_account = await account.findOne({ where: { id: accountId } });
      if (!check_account) {
          return res.status(404).json({
              status: false,
              message: "Account not found."
          });
      }

      const get_userId_of_acc = check_account.userId;
      const find_user_of_acc = await User.findOne({ where: { id: get_userId_of_acc } });
      const get_admin_name = find_user_of_acc ? find_user_of_acc.name : "Admin"; // Default if user not found

      // Check if the user exists
      const check_user = await User.findOne({ where: { id: userId } });
      if (!check_user) {
          return res.status(404).json({
              status: false,
              message: "User not found."
          });
      }

      // Check if the userId and accountId combination already exists
      const existingAssignment = await alloted_account.findOne({
          where: { userId, accountId,bookId }
      });

      if (existingAssignment) {
          return res.status(400).json({
              status: false,
              message: "This account is already assigned to the same user."
          });
      }

      // Assign the account to the user
      const add_assign_account = await alloted_account.create({
          userId: userId,
          accountId: accountId,
          bookId:bookId,
          assign_by: get_admin_name || "Admin"
      });

      return res.status(200).json({
          status: true,
          message: "Account assigned to the user successfully.",
          data: add_assign_account
      });
  } catch (error) {
      console.error("Error in account assignment API:", error.message);
      return res.status(500).json({
          status: false,
          message: "Internal server error.",
          error: error.message
      });
  }
};

// Get all assign accounts through user id
const getAssiaccountByUserId = async (req, res) => {
  try {
    const { userId } = req.query;

    const getaccounts = await alloted_account.findAll({
      where: { userId: userId },
      include: [

        {
          model: account,
          as: "account",
          attributes: ['id', 'name', 'description','account_type','balance']
        },
        // {
        //   model: User,
        //   as: "user",
        //   attributes: ['id', 'name', 'user_type', 'email_id', 'phone_no'],

        // }
      ],
      order: [['id', 'DESC']]
    });

    if (!getaccounts || getaccounts.length === 0) {
      return res.status(200).json({
        status: false,
        message: "accounts are not found according this user id",
        data: []
      });
    }

        // Transform the response to move `accountId` after `name` and `description`
        const formattedaccounts = getaccounts.map((account) => ({
          id: account.account.id,
          name: account.account?.name || null,
          accountId: account.account?.id || null, // Move accountId here
          description: account.account?.description || null,
          userId: account.userId,
          account_balance: account.account.balance,
          // createdAt: account.createdAt,
          // updatedAt: account.updatedAt,
          // user: account.user,
        }));

    return res.status(200).json({
      status: true,
      message: "accounts are retrieved successfully",
      data: formattedaccounts
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// Get all user through account id
const getUsersthroughaccountId = async (req, res) => {
  try {
    const { accountId } = req.query;

    if (!accountId) {
      return res.status(400).json({
        status: false,
        message: "accountId is required",
        data: [],
      });
    }

    const getaccounts = await alloted_account.findAll({
      where: { accountId: accountId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "user_type", "email_id", "phone_no"],
        },
      ],
      order: [["id", "DESC"]],
    });

    if (!getaccounts || getaccounts.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No users found for this accountId",
        data: [],
      });
    }

    // Group users under the given accountId
    const responseData = {
      accountId: accountId,
      users: getaccounts
        .map((account) => account.user)
        .filter((user) => user !== null), // Remove null values if any
    };

    return res.status(200).json({
      status: true,
      message: "Users retrieved successfully for the given accountId",
      data: responseData,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


// Get all assign accounts / shared accountlist
const getAllAssiaccount = async (req, res) => {
  try {
    const getaccounts = await alloted_account.findAll({
      include: [
        {
          model: User,
          as: "user", // Must match the alias in the belongsTo association
          attributes: ["id", "name", "user_type", "email_id", "phone_no"],
        },
      ],
      order: [["id", "DESC"]],
    });

    if (!getaccounts || getaccounts.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No assigned accounts found",
        data: [],
      });
    }

    // Group accounts by accountId and aggregate users
    const groupedaccounts = getaccounts.reduce((acc, account) => {
      const { accountId, user } = account;

      if (!acc[accountId]) {
        acc[accountId] = {
          accountId: accountId,
          users: [],
        };
      }

      if (user) {
        acc[accountId].users.push(user);
      }

      return acc;
    }, {});

    // Convert object to array format
    const formattedaccounts = Object.values(groupedaccounts);

    return res.status(200).json({
      status: true,
      message: "Assigned accounts retrieved successfully",
      data: formattedaccounts,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

//On User End
const getAssigneAccountById = async (req, res) => {
  try {
    const {accountId,userId} = req.query;

    const whereCondition = {  };

    if (accountId) {
        whereCondition.accountId = { [Op.eq]: accountId };
    }
    if (userId) {
      whereCondition.userId = { [Op.eq]: userId };
  }

  if (!accountId || !userId) {
    return res.status(201).json({
      status: false,
      message: "Account Id and User Id both are required",
    });
  }

    // Fetch the account without filtering transactions
    const find_assigned_account = await alloted_account.findOne({
      where:whereCondition,
      include: [
        {
          model: account,
          as: "account",
          attributes: ["id", "name", "account_type", "bookId", "userId"],
        },
      ],
      order: [["id", "DESC"]],
    });

    // Check if the account exists
    if (!find_assigned_account) {
      return res.status(404).json({
        status: false,
        message: "Account not found",
      });
    }

    // Fetch transactions separately ensuring both accountId and to_account are considered
    const transactions = await transaction.findAll({
    //   where: {
    //     [Op.or]: [{ accountId: id }, { to_account: id },
    //         { userId },
    //     ],
    //   },
    where: {
        [Op.and]: [
          { [Op.or]: [{ accountId: accountId }, { to_account: accountId }] }, // Match either accountId or to_account
          { userId }, // Ensure transactions also belong to userId
        ],
      },
      attributes: [
        "id",
        "accountId",
        "source_acc_name",
        "amount",
        "to_account",
        "target_acc_name",
        "transaction_type",
        "transaction_date",
        "bookId",
        "transaction_time",
        "account_settled",
        "description",
        "acc_setled_date",
        "userId"
      ],
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
      .filter((tx) =>
        creditTransactionTypes.includes(tx.transaction_type) ||
        (find_assigned_account.account.account_type === "PERSONNEL" ||
          find_assigned_account.account.account_type === "PAYABLE_RECEIVABLE") &&
        tx.transaction_type === "PAYMENT"
      )
      .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

    // Calculate total debits
    const totalDebits = transactions
      .filter((tx) =>
        !creditTransactionTypes.includes(tx.transaction_type) &&
        !((find_assigned_account.account.account_type === "PERSONNEL" ||
          find_assigned_account.account.account_type === "PAYABLE_RECEIVABLE") &&
          tx.transaction_type === "PAYMENT")
      )
      .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

    // Calculate net profit
    const netProfit = totalCredits - totalDebits;

    // Construct the response data
    const responseData = {
      id: find_assigned_account.account.id,
      account_name: find_assigned_account.account.account_name,
      account_type: find_assigned_account.account.account_type,
      bookId:find_assigned_account.account.bookId,
      totalCredits,
      totalDebits,
      netProfit,
      transactions, // Transactions retrieved separately
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

// All account list by userId and bookId 
const getAllAccountsByUserIdAndBookId = async (req, res) => {
    try {
        const { userId,name, bookId } = req.query;

        if (!userId || !bookId) {
          return res.status(200).json({
              status: false,
              message: "User Id and Book Id both are required",
              data: [],
          });
      }
        const whereCondition = {
            is_deleted: false,
        };

        if (userId) {
            whereCondition.userId = { [Op.eq]: userId };
        }
        if (name) {
            whereCondition.name = { [Op.eq]: name };
        }
        if (bookId) {
            whereCondition.bookId = { [Op.eq]: bookId };
        }

        // Fetch accounts with related transactions
        const accounts = await account.findAll({
            where: whereCondition,
            order: [['id', 'DESC']],
        });

        if (!accounts || accounts.length === 0) {
            return res.status(200).json({
                status: false,
                message: "No accounts found",
                data: [],
            });
        }

        return res.status(200).json({
            status: true,
            message: "Accounts retrieved successfully",
            data:accounts ,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};


module.exports = {
    assign_account,
    getAssiaccountByUserId,
    getAllAssiaccount,
    getUsersthroughaccountId,
    getAssigneAccountById,
    getAllAccountsByUserIdAndBookId
}