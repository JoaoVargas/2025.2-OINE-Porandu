import { Router } from "express";
import { getUsers } from "../controllers/userController";

const router = Router();

// Define a simple GET route
router.get("/users", getUsers);

export default router;
