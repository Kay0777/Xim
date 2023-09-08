// INITIALIZE USER MODEL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('Users', {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: {
        args: true,
        msg: 'Username is already exists'
      },
      validate: {
        isPhoneNumberOrEmail(value) {
          const phoneNumberRegex = /^\d{10}$/;
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

          if (!(phoneNumberRegex.test(value) || emailRegex.test(value))) {
            throw new Error('ID must be a phone number or email address!');
          }
        },
      }
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'password is required!'
        },
        len: {
          args: [4, 64],
          msg: 'password must be between 3 and 16 characters!'
        },
        isString(value) {
          if (typeof value !== 'string') {
            throw new Error('Password must be string!')
          }
        }
      }
    },
    refresh_token: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'refresh_token is required!'
        },
      }
    }
  }, {
    timestamps: false,
    indexes: [
      // CREATE INDEX refresh_token
      {
        name: 'refresh_token_index',
        using: 'BTREE',
        fields: ['refresh_token']
      },
    ]
  })

  return User;
};