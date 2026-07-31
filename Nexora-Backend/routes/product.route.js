import {Router} from "express"
import productController from "../controllers/product.controller.js";

const productRouter=Router();

//create product
productRouter.post('/create',productController.create)

//get all product
productRouter.get('/getallproducts',productController.getAllProduct)

//get product
productRouter.get('/getoneproduct/:id',productController.getProduct)

//delete product
productRouter.delete('/delete-product/:id',productController.deleteProduct)

//update product
productRouter.patch('/update-product/:id',productController.updateProduct)


export default productRouter;