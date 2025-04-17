import UserModel from "../model/user-model.mjs";
import { UserValidator } from "../validators/user-validator.mjs";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const userValidator = new UserValidator();

export class UserService {
  async registrasi(req) {
    console.log(req);
    const body = req.body;
    console.log(body);
    const input = userValidator.registrasi.safeParse(body);

    if (!input.success) {
      throw {
        status: 400,
        message: "Data tidak valid",
        errors: input.error.flatten()
      };
    }

    const exist = await UserModel.findOne({ email: input.data.email });
    if (exist) {
      throw {
        status: 400,
        message: "Email sudah terdaftar",
      };
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(input.data.password, 10);

    // Buat user baru dengan password yang sudah dienkripsi
    const user = await UserModel.create({
      ...input.data,
      password: hashedPassword
    });

    return {
      nama: user.nama,
      email: user.email,
      token: user.token
    };
  }

  async login(req) {
    const body = req.body;
    const input = userValidator.login.safeParse(body);

    if (!input.success) {
      throw {
        status: 400,
        message: "Data tidak valid",
        errors: input.error.flatten()
      };
    }

    const user = await UserModel.findOne({ email: input.data.email });
    if (!user) {
      throw {
        status: 400,
        message: "Email atau password salah"
      };
    }

    const isPasswordValid = await bcrypt.compare(input.data.password, user.password);
    if (!isPasswordValid) {
      throw {
        status: 400,
        message: "Email atau password salah"
      };
    }

    const token = uuid().toString();
    await UserModel.updateOne({
      email : user.email, 
    } , {
      $set : {
        token : token
      }
    });


    // Jika berhasil, bisa return user atau token, misalnya:
    return {
      message: "Login berhasil",
      user: {
        id: user._id,
        email: user.email,
        token : token

      }
    };
  }


  async get(token){
    
    const userToken = userValidator.userToken.safeParse(token);

    if(!userToken.success){
      throw {
        error : "data tidak valid"
      }
    }

    const user = await UserModel.findOne({token : userToken.data});


    if(!user){
      throw {
        status : 200,
        error : "Unauthorize",
      }
    }

    return {
      id : user.id,
      nama : user.nama,
      email : user.email,
      role : user.role,
      foto : user.foto,
    };
  }




  async getAll() {
    return await UserModel.find();
  }

  async getById(id) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw { status: 404, message: "User tidak ditemukan" };
    }
    return user;
  }

  async update(id, req) {
    const body = req.body;
    const input = userValidator.registrasi.safeParse(body);
    if (!input.success) {
      throw { status: 400, message: "Data tidak valid", errors: input.error.flatten() };
    }
    const updated = await UserModel.findByIdAndUpdate(id, input.data, { new: true });
    if (!updated) throw { status: 404, message: "User tidak ditemukan" };
    return updated;
  }

  async delete(id) {
    const deleted = await UserModel.findByIdAndDelete(id);
    if (!deleted) throw { status: 404, message: "User tidak ditemukan" };
    return { message: "User berhasil dihapus" };
  }
}
