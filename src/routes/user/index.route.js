import auth from "../user/auth/auth.route.js";
import categories from "./categories/categories.route.js";
import express from "express";
import product from "./products/product.route.js";
import review from "./review/review.route.js";
import cart from "./cart/cart.route.js";
import recently_view from "./cart/recently_views.route.js";
import banner from "./banner/banner.route.js";
const router = express.Router();

router.use('/auth', auth);
router.use('/categories', categories);
router.use('/product', product);
router.use('/review', review);
router.use('/cart', cart);
router.use('/recently/view', recently_view);
router.use('/banners', banner);

export default router;
