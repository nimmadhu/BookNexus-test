import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../config/db.js';

interface BookAttributes {
  id: number;
  title: string;
  author: string;
  isbn: string;
  imageUrl?: string;
  subject: string;
  researchArea: string;
  location: string;
  totalCopies: number;
  availableCopies: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BookCreationAttributes extends Optional<BookAttributes, 'id'> {}

class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
  public id!: number;
  public title!: string;
  public author!: string;
  public isbn!: string;
  public imageUrl?: string;
  public subject!: string;
  public researchArea!: string;
  public location!: string;
  public totalCopies!: number;
  public availableCopies!: number;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    researchArea: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalCopies: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    availableCopies: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'Book',
  }
);

export default Book;