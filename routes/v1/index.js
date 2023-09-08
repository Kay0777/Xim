const path = require('path');
const fs = require('fs');

const { Router } = require('express');
const { User, File } = require('./db');

const { signSchema,
  refreshAccessTokenSchema,
  fileIDSChema,
  getFilesSchema,
  updateFileSchema,
} = require('./schema');

const { encoderPassword, createAnAccessJWT, today, removeFile, createFilePath, upload } = require('../../utils');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns
 */
async function signUp(req, res) {
  const { error, value } = signSchema.validate(req.body);
  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    })
  };

  // CHECK USERNAME IS EXIST OR NOT
  const users = await User.getUser([value.id]);
  if (users.length) {
    return res.status(409).send({
      error: 'User is already'
    })
  }
  // ENCRYPT USER PASSWORD
  const encryptedPassword = encoderPassword(value.password, 3)

  // GENERATE A HASH REFRESH TOKEN
  const refreshToken = encoderPassword(JSON.stringify({ ...value, date: today() }));

  // CREATE A USERNAME BY ENCRYPTED PASSWORD
  const params = [value.id, encryptedPassword, refreshToken];
  await User.createUser(params);

  // GENERATE AN ACCESS JWT
  const accessToken = createAnAccessJWT({ id: value.id, password: encryptedPassword });


  return res.status(201).send({
    access_token: accessToken,
    refresh_token: refreshToken
  });
}

async function signIn(req, res) {
  const { error, value } = signSchema.validate(req.body);
  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    })
  };

  const users = await User.getUser([value.id]);
  if (!users.length) {
    return res.status(401).send({
      error: 'Unauthorized user!'
    })
  }

  // GENERATE AN ACCESS JWT
  const [{ id, password }] = users;
  const accessToken = createAnAccessJWT({ id, password });

  return res.status(200).send({
    access_token: accessToken,
  });
}

async function refreshAccessToken(req, res) {
  const { error, value } = refreshAccessTokenSchema.validate(req.body);
  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    })
  };

  const users = await User.getUserByRefreshToken([value.refresh_token]);
  if (!users.length) {
    return res.status(401).send({
      err: 'Unauthorized user!'
    })
  }

  // GENERATE AN ACCESS JWT
  const [{ id, password }] = users;
  const accessToken = createAnAccessJWT({ id, password });

  return res.status(200).send({
    access_token: accessToken,
  })
}

async function getUserInfo(req, res) {
  return res.status(200).send({
    id: req.user.id
  })
}

async function logout(req, res) {
  const { id, password } = req.user;

  const refreshToken = encoderPassword(
    JSON.stringify({
      id,
      password,
      date: today()
    })
  );

  await User.updateRefreshToken([refreshToken, id])

  return res.status(200).send({
    refresh_token: refreshToken
  })

}

async function uploadFile(req, res) {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).send({
      error: 'Please upload a file',
    });
  }
  const { file: { filename, mimetype, size } } = req;
  const params = [filename, path.extname(filename), mimetype, size]
  await File.uploadFile(params)

  return res.status(200).send({
    message: 'File upload successfully'
  })

}

async function getFiles(req, res) {
  const { error, value } = getFilesSchema.validate(req.query);
  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    })
  };

  const params = [value.list_size, (value.page - 1) * value.list_size];
  const files = await File.getFiles(params);

  return res.status(200).send(files);
}

async function deleteFile(req, res) {
  const { error, value } = fileIDSChema.validate(req.params);
  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    })
  };

  // GET FILE PARAMS TO DELETE FROM LOCAL STORAGE
  const params = [value.id]
  const [{ name }] = await File.getFileByID(params)

  // AT FIRST REMOVE FILE FROM LOCAL STORAGE
  // IF FILE IS REMOVED SUCCESSFULLY
  const { error: err } = removeFile(name);
  if (err) {
    return res.status(500).send({
      error: err
    })
  }

  // THEN UPDATE FILE STATUS ON DB
  await File.deleteFile(params)

  return res.status(200).send({
    message: 'File deleted successfully',
  })
}

async function getFileInfo(req, res) {
  const { error, value } = fileIDSChema.validate(req.params);
  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    })
  };

  const params = [value.id];
  const file = await File.getFileByID(params);
  return res.status(200).send(file[0])
}

async function downloadFile(req, res) {
  const { error, value } = fileIDSChema.validate(req.params);
  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    })
  };

  // GET FILE PARAMS
  const params = [value.id];
  const [{ name, type }] = await File.getFileByID(params);

  // NEW VERSION OF THE DOWNLOAD
  const file = createFilePath(name);
  return res.download(file, name, (err) => {
    if (err) {
      return res.status(500).send({
        error: err
      })
    }
  });

  // // OLD VERSION OF THE DOWNLOAD
  // res.setHeader('Content-disposition', `attachment; filename=${name}`);
  // res.setHeader('Content-Type', type);

  // const stream = fs.createReadStream(createFilePath(name));
  // stream.pipe(res);
  // return;
}

async function putFile(req, res) {
  const { error, value } = updateFileSchema.validate({
    ...req.params,
    file: req.file
  });
  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    })
  }

  // GET FILE PARAMS TO DELETE FROM LOCAL STORAGE
  const params = [value.id]
  const [{ name }] = await File.getFileByID(params)

  // AT FIRST REMOVE FILE FROM LOCAL STORAGE
  const { error: err } = removeFile(name);
  if (err) {
    return res.status(500).send({
      error: err
    })
  }
  // IF FILE IS REMOVED SUCCESSFULLY

  // AT SECOND UPDATE A NEW FILE PARAMS ON DB
  const { filename, mimetype, size } = value.file;
  const updateParams = [filename, path.extname(filename), mimetype, size, value.id]
  await File.updateFile(updateParams)

  return res.status(200).send({
    message: 'File updated successfully!'
  })

}

const router = Router()

router.post('/signup', signUp) // Done
router.post('/signin', signIn) // Done
router.post('/signin/new_token', refreshAccessToken) // Done

router.get('/info', getUserInfo) // Done
router.get('/logout', logout) // Done

router.post('/file/upload', upload.single('file'), uploadFile) // Done
router.get('/file/list', getFiles) // Done
router.delete('/file/delete/:id', deleteFile) // Done
router.get('/file/:id', getFileInfo) // Done
router.get('/file/download/:id', downloadFile) // Done
router.put('/file/upload/:id', upload.single('file'), putFile) // Done

module.exports = router;