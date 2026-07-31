import {Router} from "express"
import adminRouter from "./admin.route.js";
import userRouter from "./user.route.js";
import productRouter from "./product.route.js";
import categoryRouter from "./category.route.js";
import cartRouter from "./cart.route.js";

const router =Router();

router.use('/admin',adminRouter)
router.use('/user',userRouter)
router.use('/product',productRouter)
router.use('/category',categoryRouter)
router.use('/cart',cartRouter)

export default router;
