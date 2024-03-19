import adminRoutes from  './admin/index.route.js';
import userRoutes from './user/index.route.js';
import express from "express";
const router = express.Router();

/** Admin Routes **/
router.use('/admin', adminRoutes);

/** User Routes **/
router.use('/user', userRoutes);


export default router;
