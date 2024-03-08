import { router } from '../../middleware/app.middleware.js';
import auth from './auth/auth.route.js';
import collection from './collections/collection.route.js';
import product from './products/product.route.js';


router.use('/auth', auth);
router.use('/collection', collection);
router.use('/product', product);

export default router;
