import { z } from "zod";

export class ProdukValidator {
    create = z.object({
        nama: z.string().min(1).max(100),
        harga: z.string().regex(/^\d+$/, "Harga harus angka")
            .transform(val => Number(val))  // Convert to Number
    });
}