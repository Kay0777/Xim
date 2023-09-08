// INITIALIZE FILE MODEL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const File = sequelize.define('Files', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    format: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'file format is required!'
        },
        isInt: {
          msg: 'file format must be string!'
        },
        len: {
          args: [3, 16],
          msg: 'file format must be between 3 and 16 characters!'
        }
      }
    }
  }, { timestamps: false });

  return File;
}