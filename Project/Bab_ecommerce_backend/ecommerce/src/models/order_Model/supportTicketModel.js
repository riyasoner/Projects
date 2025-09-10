module.exports = (sequelize, DataTypes) => {
  const supportTicket = sequelize.define("supportTicket", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.BIGINT, allowNull: true },
    subject: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM("open", "in_progress", "resolved", "closed"),
      defaultValue: "open",
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "medium",
    },
  });

  return supportTicket;
};
