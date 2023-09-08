const path = require('path');

const express = require('express');

const { APP } = require('./config')

const { auth } = require('./middleware')
const { v1, v2 } = require('./routes')

const cors = require('cors');


const app = express();
app.use(cors({
  origin: "*",
  methods: [
    'GET',
    'PUT',
    'POST',
    'DELETE'
  ],
  preflightContinue: false,
}))
app.use(express.json({ limit: '5MB' }))
app.use(express.static(path.join(__dirname, 'uploads')))

/**
 * @MAIN_ROUTES
*/
app.use('/api/v1/', auth, v1)
app.use('/api/v2/', v2)

/**
 * @HANDLE_NOT_FOUND_ROUTES
*/
app.use((req, res) => {
  return res.status(404).send({
    message: 'Not found!'
  });
});

/**
 * @HANDLE_ERRORS
*/
app.use((err, req, res, next) => {
  console.log(err);
  return res.status(500).send({
    error: 'Error on Server side!'
  })
})

app.listen(APP.port, APP.host, () => {
  console.log('Server:', `http://${APP.host}:${APP.port}`);
})
