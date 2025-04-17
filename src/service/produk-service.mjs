import { saveFile } from "../config/upload.mjs";
import ProdukModel from "../model/produk-mode.mjs";
import { ProdukValidator } from "../validators/produk-validator.mjs";

const produkValidator = new ProdukValidator();
export class ProdukService{
    async create(dto){
        const body = dto.body;
        const foto = dto.file;
        console.log(body);
        console.log(dto.user.id);
        console.log(foto);

        const produkInput = produkValidator.create.safeParse({...body});
        if(!produkInput.success) throw {status : 401 , message : "data tidak valid"}

        if(!foto) throw {status : 401 , message : "foto tidak valid"}

        const saved = await saveFile(foto , "produk");

        const harga = BigInt(produkInput.data.harga);

        return await ProdukModel.create({
            nama : produkInput.data.nama,
            harga : harga,
            foto : saved.path,
            userId : dto.user.id
        });
    }
}