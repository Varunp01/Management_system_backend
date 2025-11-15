import express from "express";
import { CreateOrganization, getUserOrganization, getOrganizations } from "../controllers/organizationController.js";
import { isAuthenticated } from "../config/isAuthenticated.js";
const router=express.Router();
router.route("/createorganization").post(isAuthenticated,CreateOrganization);
router.route("/organizationdetails").get(isAuthenticated,getUserOrganization);
router.route("/organizations/:orgId").get(isAuthenticated,getOrganizations);
export default router;