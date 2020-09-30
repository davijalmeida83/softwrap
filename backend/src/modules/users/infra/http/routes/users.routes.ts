import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import multer from 'multer';
import uploadConfig from '@config/upload';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig.multer);

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.get('/', usersController.list);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      id_owner: Joi.string().required(),
      name: Joi.string().required(),
      age: Joi.string().required(),
      maritalstatus: Joi.string().required(),
      cpf: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create
);


usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update
);
export default usersRouter;
