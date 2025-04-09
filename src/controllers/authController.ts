import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user"; // Giả sử đây là module User

class authController {
  // static #instance: AuthController | null = null;

  // static getInstance(): AuthController {
  //   if (!AuthController.#instance) {
  //     AuthController.#instance = new AuthController();
  //   }
  //   return AuthController.#instance;
  // }

  public async register(req: any, res: any) {
    const { username, password, role } = req.body;

    try {
      const userRole = role && ["admin", "user"].includes(role) ? role : "user";
      const result = await User.createUser(username, password, userRole);
      res.status(201).json({
        message: "User registered",
        username: result.username,
        role: result.role,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error registering user: " + (err as Error).message });
    }
  }

  public async login(req: any, res: any) {
    const { username, password } = req.body;

    try {
      const user = await User.findByUsername(username);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (password !== user.password) {
        res.status(401).json({ message: "Invalid password" });
        return;
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "2h" }
      );
      res.status(200).json({ auth: true, token, role: user.role });
    } catch (err) {
      if ((err as Error).message === "Username is required") {
        res.status(400).json({ message: "Username is required" });
        return;
      }
      res
        .status(500)
        .json({ message: "Error logging in: " + (err as Error).message });
    }
  }
}

export default new authController();
