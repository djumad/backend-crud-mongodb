import { z } from "zod";

export class UserValidator {
  // Validasi untuk registrasi user (semua field wajib)
  registrasi = z.object({
    nama: z.string().min(1).max(100),
    email: z.string().email().min(10).max(100),
    role: z.string().min(1).max(100),
    password: z.string().min(6).max(100),
  });

  login = z.object({
    email : z.string().min(10).max(100),
    password : z.string().min(6).max(100)
  })

  userToken = z.string()

  // Validasi untuk update user (field boleh kosong atau sebagian saja)
  update = z.object({
    nama: z.string().min(1).max(100).optional(),
    email: z.string().email().min(10).max(100).optional(),
    role: z.string().min(1).max(100).optional(),
    password: z.string().min(6).max(100).optional(),
  });
}
