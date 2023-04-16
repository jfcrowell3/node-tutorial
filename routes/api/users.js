const express = require('express');
const router = express.Router();
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getUser,
} = require('../../controllers/usersController');
const User = require('../../model/User');

router
  .route('^/$')
  .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), getAllUsers)
  .post(verifyRoles(ROLES_LIST.Admin), createNewUser)
  .put(verifyRoles(ROLES_LIST.Admin), updateUser)
  .delete(verifyRoles(ROLES_LIST.Admin), deleteUser);

router
  .route('/:id')
  .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), getUser);

module.exports = router;
