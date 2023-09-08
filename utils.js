const { createHash } = require('crypto');
const { HASH, APP, FOLDER } = require('./config')
const jwt = require('jsonwebtoken')

const fs = require('fs');
const path = require('path');

const multer = require('multer');

function encoderPassword(key, loop = 1) {
  if (loop === 0) {
    return key;
  }
  const hash = createHash(HASH.algorithm).update(key).digest(HASH.hash);
  return encoderPassword(hash, loop - 1);
}

function createAnAccessJWT(key) {
  return jwt.sign(key, APP.secretKey, { expiresIn: APP.secretKeyTimeOut, })
}

function verifyAccessJWT(key) {
  return jwt.verify(key, APP.secretKey, (err, decoded) => {
    if (err) {
      return {
        error: err,
        value: null
      }
    }
    return {
      error: null,
      value: decoded
    }
  })
}

function today() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();
  const hour = currentDate.getHours();
  const minute = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const milliseconds = currentDate.getMilliseconds()

  return `${day}/${month}/${year} ${hour}:${minute}:${seconds}.${milliseconds}`;
}

function createFilePath(filename) {
  return path.join(process.cwd(), FOLDER, filename)
}

function removeFile(filename) {
  return new Promise((resolve) => {
    const fullFilePath = createFilePath(filename)

    fs.unlinkSync(fullFilePath, (err) => {
      if (err) {
        return resolve({
          error: err
        })
      }

      resolve({
        error: null
      })
    })
  })
}


const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync(FOLDER)) {
        fs.mkdirSync(FOLDER)
      }
      return cb(null, FOLDER)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original file name
    },
  }),
});




module.exports = {
  encoderPassword,
  createAnAccessJWT,
  verifyAccessJWT,
  today,
  removeFile,
  createFilePath,
  upload
}
