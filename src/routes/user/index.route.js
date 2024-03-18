import { router } from '../../middleware/app.middleware.js';
import auth from "../user/auth/auth.route.js";
import collection from "../user/collections/collection.route.js";

router.use('/auth', auth);
router.use('/collection', collection);

export default router;
