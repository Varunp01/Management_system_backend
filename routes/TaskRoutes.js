import express from "express";
import { isAuthenticated } from "../config/isAuthenticated.js";
import { changeTaskStatus, createTask, getTaskById, getTasksByOrganization } from "../controllers/taskController.js";
const router = express.Router();
router.route("/organizations/:orgId/createtasks").post(isAuthenticated, createTask);
router.route("/organizations/:orgId/tasks").get(isAuthenticated, getTasksByOrganization);
router.route("/organizations/:orgId/tasks/:taskId").get(isAuthenticated, getTaskById);
router.route("/organizations/:orgId/tasks/:taskId/status").patch(isAuthenticated, changeTaskStatus);

export default router;