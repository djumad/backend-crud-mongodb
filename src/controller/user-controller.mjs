import { Router } from "express";
import { UserService } from "../service/user-service.mjs";
import authMddleware from "../middleware/auth-middleware.mjs";

const userController = Router();
const service = new UserService();

// Registrasi user
userController.post("/api/v1/registrasi", async (req, res) => {
  try {
    const user = await service.registrasi(req);
    res.status(201).json({
      message: "Registrasi berhasil",
      data: user,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || "Terjadi kesalahan",
      errors: error.errors || null,
    });
  }
});

userController.post('/api/v1/login' , async(req , res)=>{
    const user = await service.login(req);
    res.status(200).json({
      data : user
    });
});

userController.get('/api/v1/me', authMddleware , async(req , res)=>{
    return res.status(200).json({
      data : req.user
    });
});

// Get semua user
userController.get("/api/v1/users", async (req, res) => {
  const users = await service.getAll();
  res.json(users);
});

// Get user by ID
userController.get("/api/v1/users/:id", async (req, res) => {
  try {
    const user = await service.getById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

// Update user
userController.put("/api/v1/users/:id", async (req, res) => {
  try {
    const user = await service.update(req.params.id, req);
    res.json(user);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

// Hapus user
userController.delete("/api/v1/users/:id", async (req, res) => {
  try {
    const result = await service.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

export default userController;
