import mongoose from "mongoose";

const produkModel = new mongoose.Schema({
    nama : {
        type : String,
        require : true
    },
    foto :{
        type : String,
        require : true
    },
    harga : {
        type : Number,
        require : true,
        get: v => Math.round(v),  // Ensure integer values
        set: v => Math.round(Number(v))
    },
    userId : {
        type : String,
        require : true
    }
});

const ProdukModel = mongoose.model('produks' , produkModel);

export default ProdukModel;