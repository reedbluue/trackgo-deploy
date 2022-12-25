import { Composer } from 'telegraf';
import { RegistrationController } from '../controllers/RegistrationController.js';
const registrationRouter = new Composer();
registrationRouter.command('entrar', RegistrationController.signIn);
export default registrationRouter;
