const Joi = require('joi').extend(require('joi-phone-number'))

const signSchema = Joi.object({
  id: Joi.alternatives().try(
    Joi.string().min(11).email(),
    Joi.string().length(10).phoneNumber({ defaultCountry: 'BE', format: 'national' })
  ).required(),
  password: Joi.string().min(3).max(16).required()
});

const refreshAccessTokenSchema = Joi.object({
  refresh_token: Joi.string().required()
})

const fileIDSChema = Joi.object({
  id: Joi.number().integer().required(),
})

const getFilesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  list_size: Joi.number().integer().default(10)
})

const updateFileSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().integer().required(),
  }).required(),
})


module.exports = {
  signSchema,
  refreshAccessTokenSchema,
  fileIDSChema,
  getFilesSchema,
  updateFileSchema,
}