import { router } from '../../middleware/app.middleware.js';
import auth from "../user/auth/auth.route.js";

router.use('/auth', auth);

export default router;
