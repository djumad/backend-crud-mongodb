import { Router } from "express";
import { UserService } from "../service/user-service.mjs";

const authMddleware = Router();

const userService = new UserService();

authMddleware.use(async (req, res, next) => {
    try {
        const token = req.get('Authorization');

        console.log(token);

        if (!token) {
            throw res.status(401).send({ message: "Unauthorize" });
        }

        const user = await userService.get(token);

        if (!user) {
            throw res.status(401).send({ message: "Unauthorize" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        if (error) {
            throw res.status(401).send({ message: "Unauthorize" });
        }
    }
});

export default authMddleware;