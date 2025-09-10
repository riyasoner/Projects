module.exports = (sequelize, DataTypes) => {
  const supportTicketReply = sequelize.define("supportTicketReply", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    ticketId: { type: DataTypes.BIGINT, allowNull: true },
    senderType: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
    },
    senderId: { type: DataTypes.BIGINT, allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },
  });

  return supportTicketReply;
};
