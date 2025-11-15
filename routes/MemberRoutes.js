import express from "express";
import { isAuthenticated } from "../config/isAuthenticated.js";
import { addMemberToOrganization, deleteMemberToOrganization, getOrganizationMembers } from "../controllers/memberController.js";
const router = express.Router();
router.route("/organizations/:orgId/members").post(isAuthenticated, addMemberToOrganization);
router.route("/organizations/:orgId/deletemembers").post(isAuthenticated, deleteMemberToOrganization);
router.route("/organizations/:orgId/getmembers").get(isAuthenticated, getOrganizationMembers);
export default router;