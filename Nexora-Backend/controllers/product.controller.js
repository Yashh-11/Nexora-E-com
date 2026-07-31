import Product from "../models/product.model.js"
const productController = {
    create: async (req, res) => {
        try {
            const product = await Product.create(req.body);
            return res.status(200).json({ message: "Product Added Successfully", id: product.id, product })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getAllProduct: async (req, res) => {
        try {
            const search = req.query.search || '';
            const page = req.query.page || 1;
            const limit = req.query.limit || 5;
            const sort = req.query.sort || '';
            const skip = (page - 1) * limit;

            let sortValue = 1;
            if (sort === "D" || sort === "d") {
                sortValue = -1;
            }
            const products = await Product.find({ title: { $regex: search, $options: 'i' } })
                .skip(skip)
                .limit(limit)
                .sort({ title: sortValue });
            return res.status(200).json({ message: "success", products })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Product.findById(id);
            return res.status(200).json({ message: "success", product })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(200).json({ message: "Product Update Successfully", product })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Product.findByIdAndDelete(id, req.body, { new: true });
            return res.status(200).json({ message: "Product Delete Successfully", product })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

export default productController;
