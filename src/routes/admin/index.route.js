import { router } from '../../middleware/app.middleware.js';
import auth from './auth/auth.route.js';
import collection from './collections/collection.route.js';
import product from './products/product.route.js';
import category from "./category/category.route.js";
import variant from "./variants/variants.route.js";


router.use('/auth', auth);
router.use('/collection', collection);
router.use('/product', product);
router.use('/category', category)
router.use('/variant', variant)

export default router;
