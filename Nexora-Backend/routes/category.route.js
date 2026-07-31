import {Router} from "express"
import categoryController from "../controllers/category.controller.js";

const categoryRouter=Router();

//create
categoryRouter.post('/',categoryController.create)

//get 
categoryRouter.get('/',categoryController.getAllCategory)

//delete category
categoryRouter.delete('/:id',categoryController.deleteCategory)

//update category
categoryRouter.patch('/:id',categoryController.updateCategory)

export default categoryRouter;