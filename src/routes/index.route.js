import { router } from '../middleware/app.middleware.js';
import adminRoutes from  './admin/index.route.js';
import userRoutes from './user/index.route.js';

/** Admin Routes **/
router.use('/admin', adminRoutes);

/** User Routes **/
router.use('/user', userRoutes);


export default router;
