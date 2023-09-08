const { Router } = require('express');
const { User, File } = require('./models');
const { encoderPassword, createAnAccessJWT, today } = require('../../utils')


/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns
 */

async function signUp(req, res) {
  // ENCRYPT USER PASSWORD
  const encryptedPassword = encoderPassword(req.body.password, 3)
  
  // GENERATE A HASH REFRESH TOKEN
  const refreshToken = encoderPassword(JSON.stringify({ ...req.body, date: today() }));
  
  // CREATE A USER
  return User
    .create({
      id: req.body.id,
      password: encryptedPassword,
      refresh_token: refreshToken,
    })
    .then((user) => {
      console.log(user.dataValues);
      const { id } = user.dataValues;

      // GENERATE AN ACCESS JWT
      const accessToken = createAnAccessJWT({ id, password: encryptedPassword });
      
      // RETURN SUCCESS RESULT
      return res.status(200).send({
        access_token: accessToken,
        refresh_token: refreshToken
      })
    })
    .catch((err) => {
      return res.status(400).send({
        error: err.errors[0].message
      })
    })
};

async function signIn(req, res) {
  // ENCRYPT USER PASSWORD
  const encryptedPassword = encoderPassword(req.body.password, 3)

  return User
    .findOne({
      where: {
        id: req.body.id,
        password: encryptedPassword
      },
    })
    .then((user) => {
      if (!user) {
        return res.send({});
      }

      console.log(user);
      return res.send({});
    })
    .catch((err) => {
      return res.send({});
    })
};

const router = Router();
router.post('/signup', signUp); // => Done
router.post('/signin', signIn);
// router.post('/signin/new_token', refreshAccessToken)

// router.get('/info', getUserInfo)
// router.get('/logout', logout)

// router.post('/file/upload', upload.single('file'), uploadFile)
// router.get('/file/list', getFiles)
// router.delete('/file/delete/:id', deleteFile)
// router.get('/file/:id', getFileInfo)
// router.get('/file/download/:id', downloadFile)
// router.put('/file/upload/:id', upload.single('file'), putFile)

module.exports = router;
