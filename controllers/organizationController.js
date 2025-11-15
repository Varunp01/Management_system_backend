import { Members } from "../models/members.js";
import { Organization } from "../models/organizations.js";

export const CreateOrganization = async (req, res) => {
    try {
        const userId = req.user;
        const Name = req.body.name;

        const organizations = await Organization.findOne({
            createdBy: userId,
            name: Name
        });
        if (organizations) {
            return res.status(401).json({
                message: "This Name is Already There",
                success: false
            });
        }

        const newOrganization = await Organization.create({
            name: Name,
            createdBy: userId
        });

        await Members.create({
            organizationId: newOrganization._id,
            userInfo: [
                {
                    userId: userId,
                    role: "owner"
                }
            ]
        });
        return res.status(201).json({
            message: "Organization created successfully",
            success: true
        })
    } catch (error) {
        console.log("CreateOrganization: ", error);
    }
}

export const getUserOrganization = async (req, res) => {
    try {
        const userId = req.user;

        const memberships = await Members.find({
            "userInfo.userId": userId
        }).select("organizationId");

        // console.log(memberships);

        if (memberships.length === 0) {
            return res.status(401).json({
                message: "User is not part of any organizations",
                success: false,
            });
        }

        const organizationIds = memberships.map((m) => m.organizationId);

        const organizations = await Organization.find({
            _id: { $in: organizationIds }
        });

        // console.log(organizations);
        return res.status(201).json({
            success: true,
            message: "All organization details are received",
        });

    } catch (error) {
        console.log("getUserOrganization: ", error);
    }
}

export const getOrganizations = async (req, res) => {
    try {
        const orgId = req.params.orgId;
        const userId = req.user;

        const membership = await Members.findOne({
            organizationId: orgId,
            "userInfo.userId": userId
        });

        if (!membership) {
            return res.status(401).json({
                message: "You do not have access to this organization",
                success: false,
            });
        }
        const organization = await Organization.findById(orgId);

        if (!organization) {
            return res.status(401).json({
                message: "Organization not found",
                success: false,
            });
        }

        return res.status(201).json({
            message: "Perticular Organization details are received",
            success: true,
        });

    } catch (error) {
        console.log("getOrganizations: ", error);
    }
}

