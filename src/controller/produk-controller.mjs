import { Router } from "express";
import authMddleware from "../middleware/auth-middleware.mjs";
import upload from "../middleware/upload-middleware.mjs";
import { ProdukService } from "../service/produk-service.mjs";

const produkController = Router();
const produkService = new ProdukService();

produkController.post('/api/v1/produk/create' , upload.single('foto') , authMddleware , async(req , res)=>{
    const produk = await produkService.create(req);

    return res.status(200).json({
        ...produk.toObject(),
        harga : produk.harga.toString(),
    });
});

export default produkController;