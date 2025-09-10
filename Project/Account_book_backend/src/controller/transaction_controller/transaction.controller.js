const db = require("../../../config/config"); // Adjust the path to your config file
const { Op, eq, fn, col, like, where } = require("sequelize");
const dayjs = require("dayjs");
const moment = require("moment-timezone");
const Transaction = db.transaction;
const Account = db.account;
const user = db.user;
const Notification = db.notification;
const EmiTransaction = db.emi_transaction;
const sequelize = db.sequelize;
const Collection = db.collection;
const cryptoHelper = require("../../utils/cryptoHelper");
const { decrypt } = cryptoHelper;

// const FCM = require('fcm-node');
// const serverKey = process.env.SERVER_KEY;
// const fcm = new FCM(serverKey);

const createTransaction = async (req, res) => {
  try {
    const {
      transaction_type,
      transaction_date,
      category,
      description,
      to_account,
      starting_balance,
      account_type,
      amount,
      accountId,
      bookId,
      transaction_time,
      userId,
      source_acc_name,
      target_acc_name,
    } = req.body;

    const allowedTransactionTypes = [
      "INCOME",
      "SALE",
      "INVENTORY_SALE",
      "EXPENSE",
      "PURCHASE",
      "INVENTORY_PURCHASE",
      "PERSONNEL_EXPENSE",
      "COLLECTION",
      "PAYMENT",
      "TRANSFER",
      "LEND",
      "BORROW",
      "ADD",
      "SUBTRACT",
    ];
    if (
      transaction_type &&
      !allowedTransactionTypes.includes(transaction_type)
    ) {
      return res.status(400).json({
        status: false,
        message: `Invalid transaction_type. Allowed values are: ${allowedTransactionTypes.join(
          ", "
        )}`,
        data: [],
      });
    }

    if (
      transaction_date &&
      !dayjs(transaction_date, "MM-DD-YYYY", true).isValid()
    ) {
      return res.status(400).json({
        status: false,
        message:
          "Invalid transaction_date. Ensure the date is in MM-DD-YYYY format.",
        data: [],
      });
    }

    const formattedDate = transaction_date
      ? dayjs(transaction_date, "MM-DD-YYYY").format("YYYY-MM-DD")
      : null;

    // --------------------------TRANSFER----OR----PAYMENT------------------------------

    // Handle TRANSFER transaction
    if (transaction_type === "TRANSFER" || transaction_type === "PAYMENT") {
      if (!to_account || !accountId) {
        return res.status(400).json({
          status: false,
          message:
            "Both source and target accounts are required for this transaction.",
          data: [],
        });
      }

      // Fetch Source and Target Accounts
      const sourceAccount = await Account.findOne({ where: { id: accountId } });
      const targetAccount = await Account.findOne({
        where: { id: to_account },
      });

      if (!sourceAccount || !targetAccount) {
        return res.status(404).json({
          status: false,
          message: "Invalid source or target account.",
          data: [],
        });
      }

      // Save initial balances
      // const current_source_acc_balance = sourceAccount.balance;
      // const current_targeted_acc_balance = targetAccount.balance;

      // // Update balances
      // sourceAccount.balance -= parseFloat(amount);
      // targetAccount.balance += parseFloat(amount);

      // await Promise.all([sourceAccount.save(), targetAccount.save()]);
      // Update balances
      sourceAccount.balance -= parseFloat(amount);
      targetAccount.balance += parseFloat(amount);

      // Save updated balances
      await Promise.all([sourceAccount.save(), targetAccount.save()]);

      // Get updated balances AFTER saving
      const current_source_acc_balance = sourceAccount.balance;
      const current_targeted_acc_balance = targetAccount.balance;

      // Create transaction
      const transferTransaction = await Transaction.create({
        transaction_type,
        transaction_date: formattedDate,
        transaction_time,
        category: category || "Uncategorized",
        description,
        amount,
        account_type,
        to_account,
        accountId, // Source
        bookId,
        userId,
        source_acc_name,
        target_acc_name,
        current_source_acc_available_balance: current_source_acc_balance,
        current_targeted_acc_available_balance: current_targeted_acc_balance,
      });

      // Generate Transaction ID
      const generateBookingID = (id) => {
        const now = new Date();
        return `TRS${String(now.getDate()).padStart(2, "0")}${String(
          now.getMonth() + 1
        ).padStart(2, "0")}${now.getFullYear()}${id}`;
      };

      transferTransaction.transaction_id = generateBookingID(
        transferTransaction.id
      );

      if (req.file) {
        transferTransaction.upload_image = `upload_image/${req.file.filename}`;
      }

      await transferTransaction.save();

      //--------------------------- 🔔 Notification ----------------------------
      try {
        const source_user = await user.findOne({
          where: { id: sourceAccount.userId },
        });
        const target_user = await user.findOne({
          where: { id: targetAccount.userId },
        });

        if (!source_user || !target_user) {
          console.warn("One or both users not found for notification.");
        } else if (source_user.login_from !== "web") {
          const Account_name = sourceAccount.name;
          const target_device_id = target_user.device_id;

          const message = {
            to: target_device_id,
            notification: {
              title: "Payment Transfer",
              body: `Amount: ${amount} has been transferred by ${Account_name}`,
            },
          };

          await Notification.create({
            message: message.notification.body,
            type: "payment_transfer",
            target_id: to_account,
            source_id: accountId,
            userId,
            bookId: sourceAccount.bookId,
            transaction_id: transferTransaction.transaction_id,
            data: message.notification.body,
          });

          // Uncomment if using FCM:
          // fcm.send(message, function (err, response) {
          //   if (err) {
          //     console.error("FCM Error:", err);
          //   } else {
          //     console.log("Notification sent:", response);
          //   }
          // });
        }
      } catch (error) {
        console.error("Notification handling failed:", error);
      }

      return res.status(200).json({
        status: true,
        message: "Transaction completed successfully",
        data: transferTransaction,
      });
    }
    // ---------------------------------COLLECTION-----------------------------------------

    if (transaction_type === "COLLECTION") {
      try {
        const {
          coll_kisht_type,
          coll_emiDue_date,
          coll_emi_times,
          coll_total_amount,
        } = req.body;

        // 🔒 Validate required fields
        if (
          !coll_kisht_type ||
          !coll_emi_times ||
          !coll_emiDue_date ||
          !coll_total_amount
        ) {
          return res.status(400).json({
            status: false,
            message:
              "Please provide EMI type, due date, number of EMIs, and total amount.",
          });
        }

        // 🔍 Fetch accounts
        const sourceAccount = await Account.findOne({
          where: { id: accountId },
        });
        const targetAccount = await Account.findOne({
          where: { id: to_account },
        });

        if (!sourceAccount || !targetAccount) {
          return res.status(404).json({
            status: false,
            message: "Invalid source or target account.",
          });
        }

        const amountPerEMI =
          parseFloat(coll_total_amount) / parseFloat(coll_emi_times);
        let nextEmiDate = new Date(coll_emiDue_date);

        // 📆 Define EMI intervals
        const intervalMapping = {
          monthly: 1,
          "2_monthly": 2,
          "3_monthly": 3,
          "6_monthly": 6,
          weekly: 7,
          "2_weekly": 14,
          "3_weekly": 21,
        };

        // 🏷️ Booking ID generator
        const generateBookingID = (id) => {
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0");
          const day = String(now.getDate()).padStart(2, "0");
          return `TRS${day}${month}${year}${id}`;
        };

        // 📘 Step 1: Create Collection record
        const collection = await Collection.create({
          transaction_type,
          transaction_date,
          category,
          description,
          to_account,
          amount: amountPerEMI,
          account_type,
          accountId,
          bookId,
          transaction_time,
          userId,
          source_acc_name,
          target_acc_name,
          coll_kisht_type,
          coll_total_amount,
          coll_emi_times,
          emi_status: "Unpaid",
          coll_emiDue_date,
        });

        collection.transaction_id = generateBookingID(collection.id);
        await collection.save();

        // 📘 Step 2: Create EMI installment records
        const createdEMITransactions = [];

        for (let i = 0; i < coll_emi_times; i++) {
          const emiDueDate = nextEmiDate.toISOString().split("T")[0];

          const emi = await EmiTransaction.create({
            transactionId: collection.id, // use collection ID for relation
            transaction_type,
            transaction_date,
            to_account,
            amount: amountPerEMI,
            account_type,
            accountId,
            bookId,
            transaction_time,
            userId,
            source_acc_name,
            target_acc_name,
            coll_kisht_type,
            coll_total_amount,
            coll_emi_times: coll_emi_times - i,
            emi_status: "Unpaid",
            coll_emiDue_date: emiDueDate,
          });

          emi.transaction_id = generateBookingID(emi.id);
          await emi.save();
          createdEMITransactions.push(emi);

          // 📅 Update next EMI date
          if (intervalMapping[coll_kisht_type]) {
            if (coll_kisht_type.includes("monthly")) {
              nextEmiDate.setMonth(
                nextEmiDate.getMonth() + intervalMapping[coll_kisht_type]
              );
            } else if (coll_kisht_type.includes("weekly")) {
              nextEmiDate.setDate(
                nextEmiDate.getDate() + intervalMapping[coll_kisht_type]
              );
            }
          }
        }

        // ✅ Final response
        return res.status(200).json({
          status: true,
          message: "Collection and EMI records created successfully.",
          collection,
          emi_transactions: createdEMITransactions,
        });
      } catch (error) {
        console.error("Error processing COLLECTION:", error);
        return res.status(500).json({
          status: false,
          message: error.message,
        });
      }
    }

    // --------------------------------- NORMAL TRANSACTION TYPE -----------------------------------------
    const account = await Account.findByPk(accountId);
    if (!account) {
      return res.status(404).json({
        status: false,
        message: "Account not found",
        data: [],
      });
    }
    // const old_source_balance = account.balance;

    // For other transaction types, proceed with normal transaction creation
    // const newTransaction = await Transaction.create({
    //   transaction_type,
    //   transaction_date: formattedDate,
    //   category: category || "Uncategorized",
    //   description,
    //   to_account,
    //   amount,
    //   account_type,
    //   starting_balance,
    //   accountId,
    //   bookId,
    //   transaction_time,
    //   userId,
    //   current_source_acc_available_balance: old_source_balance,
    // });
    // Update account balance based on transaction type
    if (["INCOME", "ADD"].includes(transaction_type)) {
      account.balance += parseFloat(amount); // Increase balance
    } else if (
      ["EXPENSE", "SALE", "PERSONNEL_EXPENSE", "SUBTRACT"].includes(
        transaction_type
      )
    ) {
      account.balance -= parseFloat(amount); // Decrease balance
    }

    await account.save();

    // ✅ Now create the transaction AFTER balance is updated
    const newTransaction = await Transaction.create({
      transaction_type,
      transaction_date: formattedDate,
      category: category || "Uncategorized",
      description,
      to_account,
      amount,
      account_type,
      starting_balance,
      accountId,
      bookId,
      transaction_time,
      userId,
      current_source_acc_available_balance: account.balance, // ✅ Updated balance
    });

    if (!newTransaction) {
      return res.status(201).json({
        status: false,
        message: "Transaction not created",
        data: [],
      });
    }

    if (req.file) {
      // const filePath = req.file
      // ? `upload_image/${req.file.filename}`
      // : "/src/uploads/upload_image/default.png";
      const filePath = `upload_image/${req.file.filename}`;

      newTransaction.upload_image = filePath;
      await newTransaction.save();
    }

    // Generate and update booking ID
    const generateBookingID = (transaction_id) => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      return `TRS${day}${month}${year}${transaction_id}`;
    };

    newTransaction.transaction_id = generateBookingID(newTransaction.id);
    await newTransaction.save();

    // const add_balance = await Account.findByPk(accountId);

    // // Update account balance based on transaction type
    // if (["INCOME", "ADD"].includes(transaction_type)) {
    //   add_balance.balance += parseFloat(amount); // Increase balance
    // } else if (
    //   ["EXPENSE", "SALE", "PERSONNEL_EXPENSE", "SUBTRACT"].includes(
    //     transaction_type
    //   )
    // ) {
    //   if (add_balance.balance < amount) {
    //       return res.status(400).json({
    //           status: false,
    //           message: "Insufficient balance in the source account.",
    //           data: []
    //       });
    //   }
    //   add_balance.balance -= parseFloat(amount); // Decrease balance
    // }
    // await add_balance.save();

    //--------------------------- FCM NOTIFICATION STOR ----------------------------
    const sourceAccount = await Account.findOne({ where: { id: accountId } });
    const targetAccount = await Account.findOne({ where: { id: to_account } });
    const source_user_id = sourceAccount.userId;
    const acc_book_id = sourceAccount.bookId;
    const Account_name = sourceAccount.name;

    const target_user_id = targetAccount.userId;

    const target_user = await user.findOne({ where: { id: target_user_id } });

    if (!target_user) {
      console.warn(`Target user with ID ${target_user_id} not found.`);
    } else {
      const target_device_id = target_user.device_id;

      var message = {
        to: target_device_id,
        notification: {
          title: `Payment Transfer`,
          body: `Amount : ${amount} has been transferred by ${Account_name}`,
        },
      };

      await Notification.create({
        message: message.notification.body,
        type: transaction_type,
        target_id: to_account,
        source_id: accountId,
        userId: userId,
        bookId: acc_book_id,
        transaction_id: newTransaction.transaction_id,
        data: message.notification.body,
      });
      // Send FCM message here if you're using it
    }

    // const updatedSourceAccount = await Account.findOne({
    //   where: { id: accountId },
    // });
    // console.log(updatedSourceAccount);
    // const current_source_acc_balance = updatedSourceAccount.balance;
    // newTransaction.current_source_acc_available_balance =
    //   current_source_acc_balance;
    // await newTransaction.save();

    // const updatedTragetAccount = await Account.findOne({
    //   where: { id: to_account },
    // });
    // const current_receving_acc_balance = updatedTragetAccount.balance;
    // newTransaction.current_targeted_acc_available_balance =
    //   current_receving_acc_balance;
    // await newTransaction.save();

    return res.status(200).json({
      status: true,
      message: "Transaction created successfully",
      data: newTransaction,
    });
  } catch (error) {
    console.error("Error in createTransaction API:", error.message);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Get all transactions without pagination
// const getAllTransactions = async (req, res) => {
//     try {
//         // const page = Number(req.query.page) || 1;
//         // const limit = Number(req.query.limit) || 10;
//         // const offset = (page - 1) * limit;

//         const {
//             id,
//             transaction_type,
//             transaction_date,
//             category,
//             to_account,
//             userId,
//             bookId,
//             accountId
//         } = req.query
//         const whereCondition = {};

//         if (id) {
//             whereCondition.id = { [Op.eq]: id };
//         }
//         if (transaction_type) {
//             whereCondition.transaction_type = { [Op.like]: `%${transaction_type}%` };
//         }
//         if (category) {
//             whereCondition.category = { [Op.eq]: category };
//         }
//         // if (accountId) {
//         //     whereCondition.accountId = { [Op.eq]: accountId };
//         // }
//         if (accountId) {
//             whereCondition[Op.or] = [
//                 { accountId: { [Op.eq]: accountId } },
//                 { to_account: { [Op.eq]: accountId } }
//             ];
//         }
//         if (to_account) {
//             whereCondition.to_account = { [Op.like]: `%${to_account}%` };
//         }
//         if (transaction_date) {
//             // Parse the input date in the specified format
//             const parsedDate = moment(transaction_date, "MM-DD-YYYY", true); // strict parsing

//             if (!parsedDate.isValid()) {
//                 return res.status(400).json({
//                     status: false,
//                     message: "Invalid date format. Please use MM-DD-YYYY.",
//                 });
//             }

//             // Adjust timezone to match your local time or database timezone
//             const startOfDay = parsedDate.clone().startOf("day").tz("Your/Timezone").format("YYYY-MM-DD HH:mm:ss");
//             const endOfDay = parsedDate.clone().endOf("day").tz("Your/Timezone").format("YYYY-MM-DD HH:mm:ss");

//             whereCondition.transaction_date = {
//                 [Op.between]: [startOfDay, endOfDay],
//             };
//         }
//         if (bookId) {
//             whereCondition.bookId = { [Op.eq]: bookId };
//           }
//           if (userId) {
//             whereCondition.userId = { [Op.eq]: userId };
//           }

//         // const transactions = await Transaction.findAll({
//         //     where: whereCondition,
//         //     include: [
//         //         {
//         //             model: EmiTransaction,
//         //             as: "emi_transaction",
//         //         },
//         //         {
//         //             model:Account,
//         //             as:"account"
//         //         }
//         //     ],
//         //     order: [['id', 'DESC']],
//         //     limit: limit,
//         //     offset: offset,
//         // });

//         const transactions = await Transaction.findAll({
//             where: whereCondition,
//             include: [
//                 {
//                     model: EmiTransaction,
//                     as: "emi_transaction",
//                 },
//                 {
//                     model: Account,
//                     as: "account", // based on accountId
//                     attributes:['id','name','balance','description','bookId','userId']
//                 }
//             ],
//             order: [['id', 'DESC']],
//             // limit: limit,
//             // offset: offset,
//         });

//         if (!transactions || transactions.length === 0) {
//             return res.status(404).json({
//                 status: false,
//                 message: "No transactions found",
//                 data: []
//             });
//         }

//         // Get unique to_account IDs
//         const toAccountIds = [...new Set(transactions.map(t => t.to_account).filter(Boolean))];

//         // Fetch all related to_account accounts in one query
//         const toAccounts = await Account.findAll({
//             where: { id: toAccountIds },
//             attributes:['id','name','balance','description','bookId','userId']

//         });

//         // Create a lookup map for fast matching
//         const toAccountMap = {};
//         toAccounts.forEach(acc => {
//             toAccountMap[acc.id] = acc;
//         });

//         // Append to_account details to each transaction
//         const transactionsWithToAccount = transactions.map(transaction => {
//             const to_account_details = toAccountMap[transaction.to_account] || null;
//             return {
//                 ...transaction.toJSON(),
//                 to_account_details
//             };
//         });

//         const totalCount = await Transaction.count({ where: whereCondition });
//         // const totalPages = Math.ceil(totalCount / limit);

//         return res.status(200).json({
//             status: true,
//             message: "Transactions retrieved successfully",
//             data: transactionsWithToAccount
//         });

//     } catch (error) {
//         return res.status(500).json({
//             status: false,
//             message: error.message
//         });
//     }
// };

// Get all transactions with pagination
// const getAllTransactions = async (req, res) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const offset = (page - 1) * limit;

//     const {
//       id,
//       transaction_type,
//       transaction_date,
//       category,
//       to_account,
//       userId,
//       bookId,
//       accountId,
//     } = req.query;

//     const whereCondition = {};

//     if (id) {
//       whereCondition.id = { [Op.eq]: id };
//     }
//     if (transaction_type) {
//       whereCondition.transaction_type = { [Op.like]: `%${transaction_type}%` };
//     }
//     if (category) {
//       whereCondition.category = { [Op.eq]: category };
//     }
//     if (accountId) {
//       whereCondition[Op.or] = [
//         { accountId: { [Op.eq]: accountId } },
//         { to_account: { [Op.eq]: accountId } },
//       ];
//     }
//     if (to_account) {
//       whereCondition.to_account = { [Op.like]: `%${to_account}%` };
//     }
//     if (transaction_date) {
//       const parsedDate = moment(transaction_date, "MM-DD-YYYY", true);
//       if (!parsedDate.isValid()) {
//         return res.status(400).json({
//           status: false,
//           message: "Invalid date format. Please use MM-DD-YYYY.",
//         });
//       }
//       const startOfDay = parsedDate
//         .clone()
//         .startOf("day")
//         .tz("Your/Timezone")
//         .format("YYYY-MM-DD HH:mm:ss");
//       const endOfDay = parsedDate
//         .clone()
//         .endOf("day")
//         .tz("Your/Timezone")
//         .format("YYYY-MM-DD HH:mm:ss");

//       whereCondition.transaction_date = {
//         [Op.between]: [startOfDay, endOfDay],
//       };
//     }
//     if (bookId) {
//       whereCondition.bookId = { [Op.eq]: bookId };
//     }
//     if (userId) {
//       whereCondition.userId = { [Op.eq]: userId };
//     }

//     const totalCount = await Transaction.count({ where: whereCondition });
//     const totalPages = Math.ceil(totalCount / limit);

//     const transactions = await Transaction.findAll({
//       where: whereCondition,
//       include: [
//         // {
//         //     model: EmiTransaction,
//         //     as: "emi_transaction",
//         // },
//         {
//           model: Account,
//           as: "account",
//           attributes: [
//             "id",
//             "name",
//             "balance",
//             "description",
//             "bookId",
//             "userId",
//           ],
//         },
//         {
//           model: user,
//           as: "user",
//           attributes: ["id", "name"],
//         },
//       ],
//       order: [["id", "DESC"]],
//       limit: limit,
//       offset: offset,
//     });

//     const toAccountIds = [
//       ...new Set(transactions.map((t) => t.to_account).filter(Boolean)),
//     ];

//     const toAccounts = await Account.findAll({
//       where: { id: toAccountIds },
//       attributes: ["id", "name", "balance", "description", "bookId", "userId"],
//     });

//     const toAccountMap = {};
//     toAccounts.forEach((acc) => {
//       toAccountMap[acc.id] = acc;
//     });

//     const transactionsWithToAccount = transactions.map((transaction) => {
//       const to_account_details = toAccountMap[transaction.to_account] || null;
//       return {
//         ...transaction.toJSON(),
//         to_account_details,
//       };
//     });

//     return res.status(200).json({
//       status: true,
//       message: "Transactions retrieved successfully",
//       page,
//       limit,
//       totalPages,
//       totalCount,
//       data: transactionsWithToAccount,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

//Get All transaction for the download without the pagination

const getAllTransactions_without_pagination = async (req, res) => {
  try {
    const {
      id,
      transaction_type,
      transaction_date,
      category,
      to_account,
      userId,
      bookId,
      accountId,
      startDate,
      endDate,
    } = req.query;

    const whereCondition = {};

    if (id) {
      whereCondition.id = { [Op.eq]: id };
    }

    if (transaction_type) {
      whereCondition.transaction_type = { [Op.like]: `%${transaction_type}%` };
    }

    if (category) {
      const categoryHash = cryptoHelper.hashValue(category.trim());
      whereCondition.category_hash = { [Op.eq]: categoryHash };
    }

    if (accountId) {
      whereCondition[Op.or] = [
        { accountId: { [Op.eq]: accountId } },
        { to_account: { [Op.eq]: accountId } },
      ];
    }

    if (to_account) {
      whereCondition.to_account = { [Op.like]: `%${to_account}%` };
    }

    // Date range filter (preferred)
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Start of the day

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of the day

      whereCondition.transaction_date = {
        [Op.between]: [start, end],
      };
    }
    // Fallback: single date filter
    else if (transaction_date) {
      whereCondition.transaction_date = {
        [Op.eq]: transaction_date,
      };
    }

    if (bookId) {
      whereCondition.bookId = { [Op.eq]: bookId };
    }

    if (userId) {
      whereCondition.userId = { [Op.eq]: userId };
    }

    const transactions = await Transaction.findAll({
      where: whereCondition,
      include: [
        // {
        //     model: EmiTransaction,
        //     as: "emi_transactions"
        // },
        {
          model: Account,
          as: "account",
          attributes: [
            "id",
            "name",
            "balance",
            "description",
            "bookId",
            "userId",
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    const toAccountIds = [
      ...new Set(transactions.map((t) => t.to_account).filter(Boolean)),
    ];

    const toAccounts = await Account.findAll({
      where: { id: toAccountIds },
      attributes: ["id", "name", "balance", "description", "bookId", "userId"],
    });

    const toAccountMap = {};
    toAccounts.forEach((acc) => {
      toAccountMap[acc.id] = acc;
    });

    const transactionsWithToAccount = transactions.map((transaction) => {
      return {
        ...transaction.toJSON(),
        to_account_details: toAccountMap[transaction.to_account] || null,
      };
    });

    return res.status(200).json({
      status: true,
      message: "Transactions retrieved successfully",
      totalCount: transactionsWithToAccount.length,
      data: transactionsWithToAccount,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Get a transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({ where: { id } });

    if (!transaction) {
      return res.status(404).json({
        status: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Update a transaction by ID
const updateTransaction = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const oldTransaction = await Transaction.findOne({ where: { id } });
    if (!oldTransaction) {
      return res.status(404).json({
        status: false,
        message: "Transaction not found",
      });
    }

    // Extract previous values
    const oldAmount = oldTransaction.amount;
    const oldSource = oldTransaction.accountId;
    const oldTarget = oldTransaction.to_account;
    const type = oldTransaction.transaction_type; // keep original type

    // Extract new values
    const newAmount = updatedData.amount ?? oldAmount;
    const newSource = updatedData.accountId ?? oldSource;
    const newTarget = updatedData.to_account ?? oldTarget;
    const amountDiff = newAmount - oldAmount;

    // Transaction type groups
    const expenseTypes = [
      "EXPENSE",
      "PURCHASE",
      "PERSONNEL_EXPENSE",
      "INVENTORY_PURCHASE",
      "SUBTRACT",
    ];
    const incomeTypes = ["INCOME", "SALE", "INVENTORY_SALE", "ADD"];
    const dualTypes = ["TRANSFER", "LEND", "BORROW", "PAYMENT", "COLLECTION"];

    const adjustBalance = async (accountId, amount, direction) => {
      if (!accountId || amount === 0) return;
      await Account.increment(
        { balance: direction * amount },
        { where: { id: accountId }, transaction: t }
      );
    };

    // === Source Account Adjustments ===
    if (oldSource !== newSource) {
      // Revert old source
      if (expenseTypes.includes(type) || dualTypes.includes(type)) {
        await adjustBalance(oldSource, oldAmount, 1); // increase back
      } else if (incomeTypes.includes(type)) {
        await adjustBalance(oldSource, oldAmount, -1); // decrease back
      }

      // Apply new source
      if (expenseTypes.includes(type) || dualTypes.includes(type)) {
        await adjustBalance(newSource, newAmount, -1); // decrease
      } else if (incomeTypes.includes(type)) {
        await adjustBalance(newSource, newAmount, 1); // increase
      }
    } else if (amountDiff !== 0) {
      if (expenseTypes.includes(type) || dualTypes.includes(type)) {
        await adjustBalance(newSource, amountDiff, -1);
      } else if (incomeTypes.includes(type)) {
        await adjustBalance(newSource, amountDiff, 1);
      }
    }

    // === Target Account Adjustments (dualTypes only) ===
    if (dualTypes.includes(type)) {
      if (oldTarget !== newTarget) {
        if (oldTarget) await adjustBalance(oldTarget, oldAmount, -1); // revert old target
        if (newTarget) await adjustBalance(newTarget, newAmount, 1); // apply new target
      } else if (amountDiff !== 0) {
        await adjustBalance(newTarget, amountDiff, 1);
      }
    }

    // === Update transaction data ===
    const [updated] = await Transaction.update(
      { ...updatedData, transaction_type: type },
      { where: { id }, transaction: t }
    );

    if (!updated) {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "No changes applied",
      });
    }

    await t.commit();

    // Fetch updated balances AFTER commit
    const sourceAccount = await Account.findOne({ where: { id: newSource } });
    const targetAccount = await Account.findOne({ where: { id: newTarget } });

    await Transaction.update(
      {
        current_source_acc_available_balance: sourceAccount?.balance ?? null,
        current_targeted_acc_available_balance: targetAccount?.balance ?? null,
      },
      { where: { id } }
    );

    const updatedTransaction = await Transaction.findOne({ where: { id } });

    return res.status(200).json({
      status: true,
      message: "Transaction updated successfully",
      data: updatedTransaction,
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
// Delete a transaction by ID
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the transaction first
    const transaction = await Transaction.findOne({ where: { id } });

    if (!transaction) {
      return res.status(404).json({
        status: false,
        message: "Transaction not found",
      });
    }

    const { accountId, to_account, amount, transaction_type } = transaction;

    // Handle balance reversal for specific types
    if (["TRANSFER", "PAYMENT", "COLLECTION"].includes(transaction_type)) {
      const sourceAccount = await Account.findByPk(accountId);
      const targetAccount = await Account.findByPk(to_account);

      if (!sourceAccount || !targetAccount) {
        return res.status(404).json({
          status: false,
          message: "Associated accounts not found",
        });
      }

      // Reverse the balances
      sourceAccount.balance += parseFloat(amount); // Add back to source
      targetAccount.balance -= parseFloat(amount); // Deduct from target

      await sourceAccount.save();
      await targetAccount.save();
    }

    // For income or add types, just reverse the source
    else if (["INCOME", "ADD"].includes(transaction_type)) {
      const sourceAccount = await Account.findByPk(accountId);
      if (sourceAccount) {
        sourceAccount.balance -= parseFloat(amount);
        await sourceAccount.save();
      }
    }

    // For expense or subtract types, just reverse the source
    else if (
      ["EXPENSE", "SUBTRACT", "SALE", "PERSONNEL_EXPENSE"].includes(
        transaction_type
      )
    ) {
      const sourceAccount = await Account.findByPk(accountId);
      if (sourceAccount) {
        sourceAccount.balance += parseFloat(amount);
        await sourceAccount.save();
      }
    }

    // Delete the transaction
    const deleted = await Transaction.destroy({ where: { id } });

    return res.status(200).json({
      status: true,
      message: "Transaction deleted successfully and balances updated",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const get_upcoming_transactions = async (req, res) => {
  try {
    const {
      transaction_type,
      transaction_date,
      category,
      to_account,
      userId,
      bookId,
    } = req.query;

    const transactionWhere = {};
    let emiWhere = {};

    if (userId) {
      transactionWhere.userId = userId;
    }

    if (bookId) {
      transactionWhere.bookId = bookId;
    }

    if (transaction_type) {
      transactionWhere.transaction_type = {
        [Op.like]: `%${transaction_type}%`,
      };
    }

    if (category) {
      const categoryHash = hashValue(category.trim()); // hash the trimmed input
      transactionWhere.category_hash = categoryHash; // search by hash
    }

    if (to_account) {
      transactionWhere.to_account = { [Op.like]: `%${to_account}%` };
    }

    // Get today's start timestamp in Asia/Kolkata timezone
    const today = moment()
      .tz("Asia/Kolkata")
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");

    // Default transaction date filter for upcoming transactions
    const transactionDateFilter = {
      transaction_date: { [Op.gt]: today },
    };

    if (transaction_date) {
      const parsedDate = moment(transaction_date, "MM-DD-YYYY", true);

      if (!parsedDate.isValid()) {
        return res.status(400).json({
          status: false,
          message: "Invalid date format. Please use MM-DD-YYYY.",
        });
      }

      const startOfDay = parsedDate
        .clone()
        .startOf("day")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss");
      const endOfDay = parsedDate
        .clone()
        .endOf("day")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss");

      transactionDateFilter.transaction_date = {
        [Op.between]: [startOfDay, endOfDay],
      };
      emiWhere.coll_emiDue_date = { [Op.between]: [startOfDay, endOfDay] };
    } else {
      emiWhere.coll_emiDue_date = { [Op.gt]: today };
    }

    // Find only upcoming transactions
    const transactions = await Transaction.findAll({
      where: {
        ...transactionWhere,
        ...transactionDateFilter,
      },
      // include: [
      //   {
      //     model: EmiTransaction,
      //     as: "emi_transaction",
      //     required: false,
      //     where: emiWhere,
      //   },
      // ],
      order: [["id", "DESC"]],
    });

    if (!transactions || transactions.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No upcoming transactions found",
        data: [],
      });
    }

    // Separate EMI transaction data and count based on transactionId
    const groupedEmiTransactions = {};
    const emiTransactions = await EmiTransaction.findAll({
      where: emiWhere,
      order: [["id", "DESC"]],
    });

    // Group EMI transactions by transactionId
    emiTransactions.forEach((emi) => {
      const txnId = emi.transactionId;
      if (!groupedEmiTransactions[txnId]) {
        groupedEmiTransactions[txnId] = {
          transactionId: txnId,
          emi_transaction: [],
          emi_counts: {
            none: 0,
            Pending: 0,
            Completed: 0,
          },
        };
      }

      // Add EMI data to the respective transactionId group
      groupedEmiTransactions[txnId].emi_transaction.push(emi.toJSON());

      // Update EMI status counts
      if (emi.collection_status === "None") {
        groupedEmiTransactions[txnId].emi_counts.none += 1;
      } else if (emi.collection_status === "Pending") {
        groupedEmiTransactions[txnId].emi_counts.Pending += 1;
      } else if (emi.collection_status === "Completed") {
        groupedEmiTransactions[txnId].emi_counts.Completed += 1;
      }
    });

    // Combine transactions with the grouped EMI data
    const dataWithEmiCounts = await Promise.all(
      transactions.map(async (transaction) => {
        const transactionId = transaction.id;

        return {
          ...transaction.toJSON(),
          emi_transaction: groupedEmiTransactions[transactionId]
            ? groupedEmiTransactions[transactionId].emi_transaction
            : [],
          emi_counts: groupedEmiTransactions[transactionId]
            ? groupedEmiTransactions[transactionId].emi_counts
            : { none: 0, Pending: 0, Completed: 0 },
        };
      })
    );

    return res.status(200).json({
      status: true,
      message: "Upcoming transactions with EMI data retrieved successfully",
      data: {
        transactions: dataWithEmiCounts,
        // emi_transaction: Object.values(groupedEmiTransactions),
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ===================== AUTOMATIC EMI DEDUCTION FUNCTION =====================

// At the time of deduction status will be updated
const processScheduledEmi = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    // Fetch transactions where coll_emiDue_date is exactly today
    const emiTransactions = await EmiTransaction.findAll({
      where: {
        transaction_type: "COLLECTION",
        emi_status: "Unpaid",
        [Op.and]: [
          where(fn("DATE", col("coll_emiDue_date")), today), // Ensures date-only comparison
        ],
      },
    });

    if (!emiTransactions.length) {
      // return res.status(200).json({status:false, message: "No EMIs due today." });
      return "No EMIs due today.";
    }
    console.log(emiTransactions.length);
    await Promise.all(
      emiTransactions.map(async (transaction) => {
        const { userId, amount, bookId, accountId, to_account, id } =
          transaction;
        console.log(id);
        const sourceAccount = await Account.findOne({
          where: { id: accountId },
        });
        const targetAccount = await Account.findOne({
          where: { id: to_account },
        });

        if (!sourceAccount || !targetAccount) {
          console.error(
            `Invalid source or target account for Transaction ID: ${transaction.id}`
          );
          return;
        }

        // Deduct balance and save transaction
        sourceAccount.balance -= parseFloat(amount);
        await sourceAccount.save();

        targetAccount.balance += parseFloat(amount);
        await targetAccount.save();

        // ✅ Fix: Update transaction status for each transaction
        transaction.emi_status = "Paid";
        transaction.collection_status = "Pending";
        transaction.transaction_date = new Date();
        await transaction.save();
        const transaction_date = new Date();
        const transaction_time = new Date().toLocaleTimeString("en-GB"); // HH:mm:ss
        const category = "EMI_PAYMENT"; // tum apna category set kar sakti ho

        const newTransaction = await Transaction.create({
          transaction_type: "COLLECTION",
          transaction_date,
          transaction_time,
          category,
          description: `EMI paid from ${sourceAccount.name} to ${targetAccount.name}`,
          to_account: targetAccount.id,
          amount,
          account_type: sourceAccount.account_type,
          accountId: sourceAccount.id,
          bookId: sourceAccount.bookId,
          userId: sourceAccount.userId,
          source_acc_name: sourceAccount.name,
          target_acc_name: targetAccount.name,
          current_source_acc_available_balance: sourceAccount.balance,
          current_targeted_acc_available_balance: targetAccount.balance,
        });

        // Send notification
        const targetUser = await user.findOne({
          where: { id: targetAccount.userId },
        });
        const targetDeviceId = targetUser?.device_id;
        const accountName = targetAccount.name;

        var message = {
          to: targetDeviceId,
          notification: {
            title: "EMI Payment Received",
            body: `Amount: ${amount} has been credited to your account (${accountName}).`,
          },
        };

        await Notification.create({
          message: message.notification.body,
          type: "payment_received(EMI)",
          target_id: to_account,
          source_id: accountId,
          userId: userId,
          bookId: bookId,
          transaction_id: transaction.transaction_id,
          data: message.notification.body,
        });

        // fcm.send(message, function (err, response) {
        //     if (err) {
        //         console.error("Notification Failed!", err);

        //     } else {
        //         console.log("Notification Sent Successfully: ", response);

        //     }
        // });

        // return res.status(200).json({
        //     status:true,
        //     message: "All scheduled EMIs processed successfully.",
        //     data:newTransaction
        // });
        console.log("EMI Processed for transaction ID:", transaction.id);
      })
    );

    console.log("All scheduled EMIs processed successfully.");
  } catch (error) {
    console.error("Error processing scheduled EMIs:", error);
    //    return res.status(500).json({ status:false,message: error.message });
  }
};

// change Collection status for Emi
const change_collection_status = async (req, res) => {
  try {
    const { to_account, accountId, collection_status, coll_emi_times } =
      req.body;

    if (!to_account || !accountId || !collection_status) {
      return res.status(400).json({
        status: false,
        message:
          "Missing required parameters: to_account, accountId, or collection_status",
      });
    }

    // Validate collection_status
    if (!["Completed", "Cancelled"].includes(collection_status)) {
      return res.status(400).json({
        status: false,
        message:
          "Invalid collection_status provided. Use 'Completed' or 'Cancelled'.",
      });
    }

    // If accountId is an array, check multiple transactions
    if (Array.isArray(accountId)) {
      // Fetch all transactions with the given accountIds that are pending
      const transactions = await EmiTransaction.findAll({
        where: {
          to_account,
          accountId: { [Op.in]: accountId },
          transaction_type: "COLLECTION",
          collection_status: "Pending",
        },
      });

      if (transactions.length === 0) {
        return res.status(200).json({
          status: false,
          message:
            "No pending collection transactions found for the provided accountIds.",
        });
      }

      // Filter out transactions where emi_status is NOT "Paid"
      const unpaidTransactions = transactions.filter(
        (txn) => txn.emi_status !== "Paid"
      );

      if (unpaidTransactions.length > 0) {
        return res.status(200).json({
          status: false,
          message:
            "Some transactions cannot be updated because payment has not been made.",
          unpaid_transactions: unpaidTransactions.map((txn) => ({
            accountId: txn.accountId,
            coll_emi_times: txn.coll_emi_times,
            coll_emiDue_date: txn.coll_emiDue_date,
            emi_status: txn.emi_status,
          })),
        });
      }

      // Proceed with bulk update only if all are paid
      await EmiTransaction.update(
        { collection_status },
        {
          where: {
            to_account,
            accountId: { [Op.in]: accountId },
            transaction_type: "COLLECTION",
            collection_status: "Pending",
            emi_status: "Paid", // Ensuring only "Paid" transactions get updated
          },
        }
      );

      return res.status(200).json({
        status: true,
        message: `Collection status has been updated to '${collection_status}' for ${transactions.length} transactions.`,
      });
    }

    // If updating a single transaction, check coll_emi_times
    if (!coll_emi_times) {
      return res.status(400).json({
        status: false,
        message:
          "coll_emi_times is required for updating a single transaction.",
      });
    }

    // Fetch the specific transaction
    const transaction = await EmiTransaction.findOne({
      where: {
        to_account,
        accountId,
        coll_emi_times,
        transaction_type: "COLLECTION",
        collection_status: "Pending",
      },
    });

    if (!transaction) {
      return res.status(200).json({
        status: false,
        message:
          "No pending collection transaction found with the given coll_emi_times.",
      });
    }

    // **New Validation**: Check if emi_status is "Paid"
    if (transaction.emi_status !== "Paid") {
      return res.status(200).json({
        status: false,
        message: `Payment not paid. This payment will be held on ${transaction.coll_emiDue_date} at 12 PM.`,
      });
    }

    // Update the specific transaction
    await EmiTransaction.update(
      { collection_status },
      { where: { id: transaction.id } }
    );

    return res.status(200).json({
      status: true,
      message: `Collection status updated to '${collection_status}' for transaction ID: ${transaction.id}.`,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// const markEmiAsPaidOrComplete = async (req, res) => {
//     try {
//         const { accountId, to_account, coll_emi_times, transaction_id } = req.body;

//         if (!accountId || !to_account) {
//             return res.status(400).json({
//                 status: false,
//                 message: "Missing required fields: accountId or to_account"
//             });
//         }

//         if (Array.isArray(accountId)) {
//             const transactions = await EmiTransaction.findAll({
//                 where: {
//                     to_account,
//                     accountId: { [Op.in]: accountId },
//                     transaction_type: "COLLECTION",
//                 }
//             });

//             if (transactions.length === 0) {
//                 return res.status(404).json({
//                     status: false,
//                     message: "No EMI transactions found for provided account IDs."
//                 });
//             }

//             let updatedCount = 0;

//             for (const txn of transactions) {
//                 // ✅ Skip already paid
//                 if (txn.emi_status === "Paid") {
//                     continue;
//                 }

//                 const sourceAccount = await Account.findOne({ where: { id: txn.accountId } });
//                 const targetAccount = await Account.findOne({ where: { id: to_account } });

//                 if (!sourceAccount || !targetAccount) {
//                     continue;
//                 }

//                 const amount = txn.amount;

//                 sourceAccount.balance -= amount;
//                 targetAccount.balance += amount;

//                 await sourceAccount.save();
//                 await targetAccount.save();

//                 await EmiTransaction.update(
//                     {
//                         emi_status: "Paid",
//                         collection_status: "Completed"
//                     },
//                     {
//                         where: { id: txn.id }
//                     }
//                 );

//                 updatedCount++;
//             }

//             return res.status(200).json({
//                 status: true,
//                 message: `Updated and transferred for ${updatedCount} EMI transactions. Already paid transactions were skipped.`
//             });
//         }

//         // ✅ Single EMI logic
//         if (!coll_emi_times) {
//             return res.status(400).json({
//                 status: false,
//                 message: "coll_emi_times is required for single transaction update."
//             });
//         }

//         const transaction = await EmiTransaction.findOne({
//             where: {
//                 accountId,
//                 to_account,
//                 coll_emi_times,
//                 transaction_type: "COLLECTION",
//                 transaction_id
//             }
//         });

//         if (!transaction) {
//             return res.status(404).json({
//                 status: false,
//                 message: "Transaction not found."
//             });
//         }

//         if (transaction.emi_status === "Paid") {
//             return res.status(200).json({
//                 status: true,
//                 message: "EMI is already marked as 'Paid'. No action taken."
//             });
//         }

//         const sourceAccount = await Account.findOne({ where: { id: accountId } });
//         const targetAccount = await Account.findOne({ where: { id: to_account } });

//         if (!sourceAccount || !targetAccount) {
//             return res.status(404).json({
//                 status: false,
//                 message: "Source or target account not found."
//             });
//         }

//         const amount = transaction.amount;

//         sourceAccount.balance -= amount;
//         await sourceAccount.save();

//         targetAccount.balance += amount;
//         await targetAccount.save();

//         await EmiTransaction.update(
//             { emi_status: "Paid" },
//             { where: { id: transaction.id } }
//         );

//         return res.status(200).json({
//             status: true,
//             message: `EMI status marked as 'Paid' and amount transferred for accountId ${accountId} and coll_emi_times ${coll_emi_times}.`
//         });

//     } catch (error) {
//         console.error("EMI update error:", error);
//         return res.status(500).json({
//             status: false,
//             message: error.message || "Internal server error"
//         });
//     }
// };
const get_all_collection = async (req, res) => {
  try {
    const { accountId, userId, bookId } = req.query;
    if (!accountId) {
      return res.status(400).json({
        status: false,
        message: "accountId is required",
      });
    }

    // Build the where condition dynamically
    const collectionWhere = {};
    if (userId) collectionWhere.userId = userId;
    if (bookId) collectionWhere.bookId = bookId;

    const collections = await db.collection.findAll({
      where: collectionWhere,
      include: [
        {
          model: db.emi_transaction,
          as: "emi_transactions",
          required: true,
          where: { accountId },
        },
      ],
      order: [["transaction_date", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      message: "COLLECTION transactions with EMI for the given accountId",
      data: collections,
    });
  } catch (error) {
    console.error("Error fetching collection transactions:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const markEmiAsPaidOrComplete = async (req, res) => {
  try {
    const { accountId, to_account, coll_emi_times, transaction_id } = req.body;

    if (!accountId || !to_account) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields: accountId or to_account",
      });
    }

    // 🔁 Create collection transaction log
    const createCollectionTransaction = async (
      txn,
      sourceAccount,
      targetAccount
    ) => {
      const amount = txn.amount;
      const now = new Date();

      const transaction_date = now.toISOString();
      const transaction_time = now.toTimeString().split(" ")[0];

      const mainTxn = await Transaction.findOne({
        where: { id: txn.transactionId },
      });

      const category =
        txn.category && txn.category.trim() !== ""
          ? txn.category
          : mainTxn?.category || "EMI Payment";

      const newTransaction = await Transaction.create({
        transaction_type: "COLLECTION",
        transaction_date,
        transaction_time,
        category,
        description: `EMI paid from ${sourceAccount.name} to ${targetAccount.name}`,
        to_account: targetAccount.id,
        amount,
        account_type: sourceAccount.account_type,
        accountId: sourceAccount.id,
        bookId: sourceAccount.bookId,
        userId: sourceAccount.userId,
        source_acc_name: sourceAccount.name,
        target_acc_name: targetAccount.name,
        current_source_acc_available_balance: sourceAccount.balance,
        current_targeted_acc_available_balance: targetAccount.balance,
        emiId: txn.id,
      });

      const bookingID = `TRS${String(now.getDate()).padStart(2, "0")}${String(
        now.getMonth() + 1
      ).padStart(2, "0")}${now.getFullYear()}${newTransaction.id}`;

      newTransaction.transaction_id = bookingID;
      await newTransaction.save();
    };

    // ✅ Multiple EMI case
    if (Array.isArray(accountId)) {
      const transactions = await EmiTransaction.findAll({
        where: {
          to_account,
          accountId: { [Op.in]: accountId },
          transaction_type: "COLLECTION",
        },
      });

      if (!transactions.length) {
        return res.status(404).json({
          status: false,
          message: "No EMI transactions found for provided account IDs.",
        });
      }

      let updatedCount = 0;

      for (const txn of transactions) {
        if (txn.emi_status === "Paid") continue;

        const sourceAccount = await Account.findByPk(txn.accountId);
        const targetAccount = await Account.findByPk(to_account);
        if (!sourceAccount || !targetAccount) continue;

        const amount = txn.amount;

        // 🔄 Update balances
        sourceAccount.balance -= amount;
        targetAccount.balance += amount;
        await Promise.all([sourceAccount.save(), targetAccount.save()]);

        // ✅ Mark EMI Paid
        await EmiTransaction.update(
          { emi_status: "Paid", collection_status: "Completed" },
          { where: { id: txn.id } }
        );

        // ✅ Create collection log
        await createCollectionTransaction(txn, sourceAccount, targetAccount);
        updatedCount++;
      }

      return res.status(200).json({
        status: true,
        message: `Updated and transferred for ${updatedCount} EMI transactions. Already paid transactions were skipped.`,
      });
    }

    // ✅ Single EMI case
    if (!coll_emi_times) {
      return res.status(400).json({
        status: false,
        message: "coll_emi_times is required for single transaction update.",
      });
    }

    const transaction = await EmiTransaction.findOne({
      where: {
        accountId,
        to_account,
        coll_emi_times,
        transaction_type: "COLLECTION",
        transaction_id,
      },
    });

    if (!transaction) {
      return res.status(404).json({
        status: false,
        message: "Transaction not found.",
      });
    }

    if (transaction.emi_status === "Paid") {
      return res.status(200).json({
        status: true,
        message: "EMI is already marked as 'Paid'. No action taken.",
      });
    }

    const sourceAccount = await Account.findByPk(accountId);
    const targetAccount = await Account.findByPk(to_account);
    if (!sourceAccount || !targetAccount) {
      return res.status(404).json({
        status: false,
        message: "Source or target account not found.",
      });
    }

    const amount = transaction.amount;

    // 🔄 Update balances
    sourceAccount.balance -= amount;
    targetAccount.balance += amount;
    await Promise.all([sourceAccount.save(), targetAccount.save()]);

    // ✅ Mark EMI as paid
    await EmiTransaction.update(
      { emi_status: "Paid", collection_status: "Completed" },
      { where: { id: transaction.id } }
    );

    // ✅ Create collection log
    await createCollectionTransaction(
      transaction,
      sourceAccount,
      targetAccount
    );

    return res.status(200).json({
      status: true,
      message: `EMI status marked as 'Paid' and amount transferred for accountId ${accountId} and coll_emi_times ${coll_emi_times}.`,
    });
  } catch (error) {
    console.error("EMI update error:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const {
      id,
      transaction_type,
      transaction_date,
      category,
      to_account,
      userId,
      bookId,
      accountId,
    } = req.query;

    const whereClauses = [];

    if (id) whereClauses.push(`tx.id = ${sequelize.escape(id)}`);
    if (transaction_type)
      whereClauses.push(
        `tx.transaction_type LIKE ${sequelize.escape(`%${transaction_type}%`)}`
      );
    if (category) {
      const categoryHash = cryptoHelper.hashValue(category.trim());
      whereClauses.push(`tx.category_hash = ${sequelize.escape(categoryHash)}`);
    }
    if (accountId)
      whereClauses.push(
        `(tx.accountId = ${sequelize.escape(
          accountId
        )} OR tx.to_account = ${sequelize.escape(accountId)})`
      );
    if (to_account)
      whereClauses.push(
        `tx.to_account LIKE ${sequelize.escape(`%${to_account}%`)}`
      );

    if (transaction_date) {
      const parsedDate = moment(transaction_date, "MM-DD-YYYY", true);
      if (!parsedDate.isValid()) {
        return res.status(400).json({
          status: false,
          message: "Invalid date format. Use MM-DD-YYYY.",
        });
      }
      const startOfDay = parsedDate
        .clone()
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      const endOfDay = parsedDate
        .clone()
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      whereClauses.push(
        `tx.transaction_date BETWEEN ${sequelize.escape(
          startOfDay
        )} AND ${sequelize.escape(endOfDay)}`
      );
    }

    if (bookId) whereClauses.push(`tx.bookId = ${sequelize.escape(bookId)}`);
    if (userId) whereClauses.push(`tx.userId = ${sequelize.escape(userId)}`);

    const whereConditionString =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // ---------------- MAIN QUERY ----------------
    let transactionsQuery;

    if (accountId) {
      // ✅ Case 1: accountId provided → running balance calculate
      transactionsQuery = `
        WITH tx_with_balances AS (
          SELECT 
            t.id,
            t.accountId,
            t.to_account,
            t.userId,
            t.bookId,
            t.transaction_type,
            t.amount,
            t.category,
            t.transaction_date,
            t.description,

            -- Running balance only for selected account
SUM(
  CASE
    -- Debit (money going out) for accountId
    WHEN t.accountId = ${sequelize.escape(accountId)}
      AND t.transaction_type IN (
        'EXPENSE','PURCHASE','PERSONNEL_EXPENSE','INVENTORY_PURCHASE',
        'SUBTRACT','PAYMENT','TRANSFER','LEND','BORROW','COLLECTION' -- ✅ COLLECTION also reduces from accountId
      ) THEN -t.amount

    -- Credit (money coming in) for accountId
    WHEN t.accountId = ${sequelize.escape(accountId)}
      AND t.transaction_type IN (
        'INCOME','SALE','INVENTORY_SALE','ADD'
      ) THEN t.amount

    -- Credit for to_account (incoming transfers & COLLECTION)
    WHEN t.to_account = ${sequelize.escape(accountId)}
      AND t.transaction_type IN (
        'TRANSFER','LEND','BORROW','PAYMENT','COLLECTION' -- ✅ COLLECTION adds to to_account
      ) THEN t.amount

    ELSE 0
  END
) OVER (
  ORDER BY t.transaction_date ASC, t.id ASC
  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
) AS running_balance


          FROM transactions t
          WHERE t.accountId = ${sequelize.escape(
            accountId
          )} OR t.to_account = ${sequelize.escape(accountId)}
        )
        SELECT 
          tx.*,
          JSON_OBJECT(
            'id', sa.id,
            'name', sa.name,
            'balance', sa.balance,
            'description', sa.description,
            'bookId', sa.bookId,
            'userId', sa.userId
          ) AS account,
          JSON_OBJECT(
            'id', ta.id,
            'name', ta.name,
            'balance', ta.balance,
            'description', ta.description,
            'bookId', ta.bookId,
            'userId', ta.userId
          ) AS to_account_details,
          JSON_OBJECT(
            'id', u.id,
            'name', u.name
          ) AS user
        FROM tx_with_balances tx
        LEFT JOIN accounts sa ON tx.accountId = sa.id
        LEFT JOIN accounts ta ON tx.to_account = ta.id
        LEFT JOIN users u ON tx.userId = u.id
        ${whereConditionString}
        ORDER BY tx.transaction_date DESC, tx.id DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
    } else {
      // ✅ Case 2: Only bookId (or other filters) → no running balance
      transactionsQuery = `
        SELECT 
          tx.*,
          NULL AS running_balance,
          JSON_OBJECT(
            'id', sa.id,
            'name', sa.name,
            'balance', sa.balance,
            'description', sa.description,
            'bookId', sa.bookId,
            'userId', sa.userId
          ) AS account,
          JSON_OBJECT(
            'id', ta.id,
            'name', ta.name,
            'balance', ta.balance,
            'description', ta.description,
            'bookId', ta.bookId,
            'userId', ta.userId
          ) AS to_account_details,
          JSON_OBJECT(
            'id', u.id,
            'name', u.name
          ) AS user
        FROM transactions tx
        LEFT JOIN accounts sa ON tx.accountId = sa.id
        LEFT JOIN accounts ta ON tx.to_account = ta.id
        LEFT JOIN users u ON tx.userId = u.id
        ${whereConditionString}
        ORDER BY tx.transaction_date DESC, tx.id DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
    }

    const [transactions] = await sequelize.query(transactionsQuery);

    // Count query
    const [countResult] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM transactions tx
      ${whereConditionString};
    `);

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const safeJson = (val) => {
      if (!val) return null;
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return null;
        }
      }
      if (typeof val === "object") return val;
      return null;
    };
    const safeDecrypt = (val) => {
      if (!val) return null;
      try {
        return decrypt(val);
      } catch (err) {
        // console.warn("Decryption failed for value:", val, err.message);
        return val; // or null, depending on what you want to return
      }
    };

    // 🔑 Decrypt fields
    const decryptedTransactions = transactions.map((txn) => {
      const account = safeJson(txn.account);
      const to_account_details = safeJson(txn.to_account_details);
      const user = safeJson(txn.user);

      return {
        ...txn,
        category: safeDecrypt(txn.category),
        description: safeDecrypt(txn.description),
        target_acc_name: safeDecrypt(txn.target_acc_name),
        source_acc_name: safeDecrypt(txn.source_acc_name),
        account: account
          ? {
              ...account,
              name: safeDecrypt(account.name),
              description: safeDecrypt(account.description),
            }
          : null,
        to_account_details: to_account_details
          ? {
              ...to_account_details,
              name: safeDecrypt(to_account_details.name),
              description: safeDecrypt(to_account_details.description),
            }
          : null,
        user: user ? { ...user, name: safeDecrypt(user.name) } : null,
      };
    });

    return res.status(200).json({
      status: true,
      message: "Transactions retrieved successfully",
      page,
      limit,
      totalPages,
      totalCount,
      data: decryptedTransactions,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const update_collection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const {
      transaction_date,
      category,
      description,
      to_account,
      coll_total_amount,
      coll_emiDue_date,
      coll_emi_times,
      coll_kisht_type,
    } = req.body;

    const collection = await db.collection.findOne({
      where: { id: collectionId },
      include: [{ model: db.emi_transaction, as: "emi_transactions" }],
    });

    if (!collection) {
      return res.status(404).json({
        status: false,
        message: "Collection not found",
      });
    }

    const hasPaid = collection.emi_transactions.some(
      (emi) => emi.emi_status === "Paid"
    );

    if (hasPaid) {
      return res.status(400).json({
        status: false,
        message: "Update not allowed. At least one EMI is already paid.",
      });
    }

    // Update collection fields
    await collection.update({
      transaction_date,
      category,
      description,
      to_account,
      coll_total_amount,
      coll_emiDue_date,
      coll_emi_times,
      coll_kisht_type,
    });

    // Recalculate EMIs
    const existingEmis = collection.emi_transactions || [];
    const perEmiAmount =
      coll_emi_times > 0
        ? coll_total_amount / coll_emi_times
        : coll_total_amount;

    // Update existing EMIs
    for (let i = 0; i < Math.min(coll_emi_times, existingEmis.length); i++) {
      await existingEmis[i].update({
        transaction_date,
        to_account,
        amount: perEmiAmount,
        coll_emiDue_date, // optionally calculate dynamic due dates
        coll_emi_times,
        coll_kisht_type,
      });
    }

    // Create new EMIs if coll_emi_times increased
    if (coll_emi_times > existingEmis.length) {
      for (let i = existingEmis.length; i < coll_emi_times; i++) {
        await db.emi_transaction.create({
          collectionId: collection.id,
          transaction_date,
          to_account,
          amount: perEmiAmount,
          coll_emiDue_date, // optionally increment due date per EMI
          coll_emi_times,
          coll_kisht_type,
          emi_status: "Unpaid",
          transaction_type: "COLLECTION",
        });
      }
    }

    // Delete extra EMIs if coll_emi_times decreased
    if (coll_emi_times < existingEmis.length) {
      for (let i = coll_emi_times; i < existingEmis.length; i++) {
        await existingEmis[i].destroy();
      }
    }

    return res.status(200).json({
      status: true,
      message: "Collection and related EMIs updated successfully",
      data: collection,
    });
  } catch (error) {
    console.error("Error updating collection:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
const delete_collection = async (req, res) => {
  try {
    const { collectionId } = req.params;

    // Step 1: Fetch collection with its EMIs
    const collection = await db.collection.findOne({
      where: { id: collectionId },
      include: [
        {
          model: db.emi_transaction,
          as: "emi_transactions",
        },
      ],
    });

    if (!collection) {
      return res.status(404).json({
        status: false,
        message: "Collection not found",
      });
    }

    // Step 2: Handle EMIs (reverse Paid, then delete all)
    for (const emi of collection.emi_transactions) {
      if (emi.emi_status === "Paid") {
        const sourceAccount = await db.account.findByPk(emi.accountId);
        const targetAccount = await db.account.findByPk(emi.to_account);

        if (sourceAccount && targetAccount) {
          // 🔄 Reverse balances
          sourceAccount.balance += emi.amount; // refund source
          targetAccount.balance -= emi.amount; // deduct from target
          await Promise.all([sourceAccount.save(), targetAccount.save()]);
        }
        await db.transaction.destroy({
          where: { emiId: emi.id },
        });
      }

      //  Delete EMI completely
      await emi.destroy();
    }

    // Step 3: Delete the collection itself
    await collection.destroy();

    return res.status(200).json({
      status: true,
      message:
        "Collection and all related EMIs deleted successfully. Paid EMIs were reversed before deletion.",
    });
  } catch (error) {
    console.error("Error deleting collection:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getAllTransactions_without_pagination,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  get_upcoming_transactions,
  processScheduledEmi,
  change_collection_status,
  markEmiAsPaidOrComplete,
  get_all_collection,
  update_collection,
  delete_collection,
};
