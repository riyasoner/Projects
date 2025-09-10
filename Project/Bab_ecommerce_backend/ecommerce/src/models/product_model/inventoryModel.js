module.exports = (sequelize, DataTypes) => {
    const inventory = sequelize.define("inventory", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },

        productId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        variantId: {
            type: DataTypes.BIGINT,
            allowNull: true, // Nullable if no variant for product
        },

        sellerId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        location: {
            type: DataTypes.STRING,
            allowNull: true, // Optional for warehouse/location
        },

        restockDate: {
            type: DataTypes.DATE,
        },

    });

    return inventory;
};
