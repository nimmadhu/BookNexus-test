import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Book from './Book.js';

interface CheckoutAttributes {
  id: number;
  userId: number;
  bookId: number;
  checkedOutAt: Date;
  returnedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CheckoutCreationAttributes extends Optional<CheckoutAttributes, 'id'> {}

class Checkout extends Model<CheckoutAttributes, CheckoutCreationAttributes> implements CheckoutAttributes {
  public id!: number;
  public userId!: number;
  public bookId!: number;
  public checkedOutAt!: Date;
  public returnedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Checkout.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Book,
        key: 'id',
      },
    },
    checkedOutAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    returnedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'Checkout',
  }
);

// Establish relationships
User.hasMany(Checkout, { foreignKey: 'userId' });
Checkout.belongsTo(User, { foreignKey: 'userId' });

Book.hasMany(Checkout, { foreignKey: 'bookId' });
Checkout.belongsTo(Book, { foreignKey: 'bookId' });

export default Checkout;