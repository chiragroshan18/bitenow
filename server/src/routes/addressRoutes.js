const express = require('express');
const {
  createAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress,
} = require('../controllers/addressController');
const validate = require('../middlewares/validate');
const { createAddressSchema } = require('../validators/addressValidators');
const { authenticate } = require('../middlewares/authenticate');

const router = express.Router();

router.use(authenticate);

router.post('/', validate(createAddressSchema), createAddress);
router.get('/', getMyAddresses);
router.put('/:id', validate(createAddressSchema), updateAddress);
router.delete('/:id', deleteAddress);

module.exports = router;