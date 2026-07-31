import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.Mixed
    },
    stock: {
        type: Number,
        default: 10
    },
    rating: {
        type: Number,
        default: 4.6
    }

},
    {
        timestamps: true
    })

const Product = mongoose.model('product', productSchema)

export default Product;
