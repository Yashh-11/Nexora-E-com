import Category from "../models/category.model.js"

const categoryController = {
    create: async (req, res) => {
        try {
            const data = await Category.create(req.body);
            return res.status(200).json({ message: "success", data })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: error.message })
        }
    },
    getAllCategory: async (req, res) => {
        try {
            const data = await Category.find({});
            return res.status(200).json({ message: "success", data })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: error.message })
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params
            const data = await Category.findByIdAndDelete(id);
            return res.status(200).json({ message: "Category Deleted Successfully", id })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: error.message })
        }
    },
    updateCategory: async (req, res) => {
        try {
            const { id } = req.params
            const data = await Category.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(200).json({ message: "Category Updated Successfully", id })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: error.message })
        }
    }
}

export default categoryController;