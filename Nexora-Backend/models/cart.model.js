import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product'
    },
    qty:1
},
{
    timestamps:true
})

const Cart=mongoose.model('cart',cartSchema)

export default Cart;