
module.exports = (sequelize, DataTypes) => {
    const emi_transaction = sequelize.define('emi_transaction', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      transaction_type:{
        type: DataTypes.ENUM,
        values: [ "INCOME", "SALE", "INVENTORY_SALE", "EXPENSE", "PURCHASE", "INVENTORY_PURCHASE", "PERSONNEL_EXPENSE", "COLLECTION", "PAYMENT", "TRANSFER", "LEND", "BORROW", "ADD", "SUBTRACT" ],
        // defaultValue:"INCOME",
        allowNull:false
      },
      starting_balance : {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        // defaultValue:0,
      },
      account_type:{
        type: DataTypes.ENUM,
        values: [ "None","PAYABLE_RECEIVABLE", "BANK", "CREDIT_CARD", "PRODUCT", "PERSONNEL", "SAVINGS", "CASH" ],
        defaultValue:"None",
        allowNull:false
      },
      transaction_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      category : {
        type: DataTypes.STRING,
        allowNull: true
      },
      description : {
        type: DataTypes.STRING,
        allowNull: true
      },  
      to_account : {
        type: DataTypes.STRING,
        allowNull: true
      },
      amount : {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue:0,
      },
      account_settled : {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:false,
      },
      transaction_time : {
        type: DataTypes.STRING,
        allowNull: true,
        // defaultValue:0,
      },
      view_by_superAdmin : {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:false,
      },
      acc_setled_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      transaction_id : {
        type: DataTypes.STRING,
        allowNull: true
      },
      upload_image : {
        type: DataTypes.STRING,
        allowNull: true
      },
      settlement_status:{
        type: DataTypes.ENUM,
        values: [ "None","Pending", "Approved", "Rejected"],
        defaultValue:"None",
        allowNull:true
      },
      target_acc_name : {
        type: DataTypes.STRING,
        allowNull: true
      },
      source_acc_name : {
        type: DataTypes.STRING,
        allowNull: true
      },
      coll_kisht_type : {
        type: DataTypes.STRING,
        allowNull: true
      },
      coll_emi_times : {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      coll_total_amount  : {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue:0,
      },
      coll_emiDue_date : {
        type: DataTypes.DATE,
        allowNull: true
      },
      emi_status:{
        type: DataTypes.ENUM,
        values: ["None", "Unpaid", "Paid"],
        defaultValue:"None",
        allowNull:true
      },
      collection_status:{
        type: DataTypes.ENUM,
        values: ["None","Pending", "Completed", "Cancelled"],
        defaultValue:"None",
        allowNull:true
      },
      accountId : {
        type: DataTypes.STRING,
        allowNull: true
      },
      bookId : {
        type: DataTypes.STRING,
        allowNull: true
      },
      userId : {
        type: DataTypes.STRING,
        allowNull: true
      },
    });
  
    return emi_transaction 
 }