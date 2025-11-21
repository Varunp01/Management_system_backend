import { User } from "../models/user.js";
import { Members } from "../models/members.js";
import { Organization } from "../models/organizations.js";

export const addMemberToOrganization = async (req, res) => {
    try {
        const { orgId } = req.params;
        const { userIdToInviteMail, role = "member" } = req.body;
        const requestingUserId = req.user;

        const organization = await Organization.findById(orgId);
        if (!organization) {
            return res.status(401).json({
                message: "Organization not found",
                status: false
            });
        }

        const membersRecord = await Members.findOne({ organizationId: orgId });
        if (!membersRecord) {
            return res.status(403).json({
                message: "Member record missing. Owner should have one.",
                status: false
            });
        }
        const requesterRole = membersRecord.userInfo.find(
            m => m.userId.toString() === requestingUserId.toString()
        );
        if (!requesterRole || requesterRole.role !== "owner") {
            return res.status(403).json({
                message: "Only owner can invite users",
                status: false
            });
        }

        const userToInvite = await User.findOne({ email: userIdToInviteMail });
        if (!userToInvite) {
            return res.status(404).json({
                message: "User to invite not found",
                status: false
            });
        }

        const alreadyMember = membersRecord.userInfo.some(
            m => m.userId.toString() === userToInvite._id.toString()
        );
        if (alreadyMember) {
            return res.status(400).json({
                message: "User already a member of this organization",
                status: false
            });
        }

        membersRecord.userInfo.push({
            userId: userToInvite._id,
            role
        });
        await membersRecord.save();

        return res.status(201).json({
            message: "Member Added successfully",
            status: true
        });
    } catch (error) {
        console.log("addMemberToOrganization: ", error);
    }
}

export const deleteMemberToOrganization = async (req, res) => {
    try {
        const { orgId } = req.params;
        const { userIdToDeleteMail } = req.body;
        const requestingUserId = req.user;

        const organization = await Organization.findById(orgId);
        if (!organization) {
            return res.status(401).json({
                message: "Organization not found",
                status: false
            });
        }

        const membersRecord = await Members.findOne({ organizationId: orgId });
        if (!membersRecord) {
            return res.status(401).json({
                message: "Member record missing. Owner should have one.",
                status: false
            });
        }
        const requesterRole = membersRecord.userInfo.find(
            m => m.userId.toString() === requestingUserId.toString()
        );
        const userToDelete = await User.findOne({ email: userIdToDeleteMail });
        if (!userToDelete) {
            return res.status(401).json({
                message: "User to delete not found.",
                status: false
            });
        }

        const alreadyMember = membersRecord.userInfo.some(
            m => m.userId.toString() === userToDelete._id.toString()
        );
        if (!alreadyMember) {
            return res.status(401).json({
                message: "User not a member of this organization",
                status: false
            });
        }
        // console.log(userToDelete._id);
        // console.log(requesterRole.userId);
        if (!requesterRole) {
            return res.status(401).json({
                message: "Not authorized to delete",
                status: false
            });
        }

        const memberToDelete = membersRecord.userInfo.find(
            m => m.userId.toString() === userToDelete._id.toString()
        );

        if (memberToDelete.role === "owner") {
            return res.status(401).json({
                message: "Owner cannot be removed from organization",
                status: false
            });
        }
        if (requesterRole.role !== "owner") {
            return res.status(401).json({
                message: "Only owner can remove members",
                status: false
            });
        }

        membersRecord.userInfo = membersRecord.userInfo.filter(
            m => m.userId.toString() !== userToDelete._id.toString()
        );

        await membersRecord.save();

        return res.status(200).json({
            message: "User removed from organization successfully",
            status: true,
        });

    } catch (error) {
        console.log("deleteMemberToOrganization: ", error);
    }
}

export const getOrganizationMembers = async (req, res) => {
    try {
        const { orgId } = req.params;
        const requestingUserId = req.user;
        const organization = await Organization.findById(orgId);
        if (!organization) {
            return res.status(401).json({
                message: "Organization not found",
                status: false
            });
        }

        const membersRecord = await Members.findOne({ organizationId: orgId });
        if (!membersRecord) {
            return res.status(403).json({
                message: "Member record missing. Owner should have one.",
                status: false
            });
        }

        const userIds = membersRecord.userInfo.map(member => member.userId);

        const users = await User.find({ _id: { $in: userIds } })
            .select("_id name email");

        const formattedMembers = membersRecord.userInfo.map(member => {
            const userData = users.find(u => u._id.toString() === member.userId.toString());

            return {
                userId: member.userId,
                name: userData?.name,
                email: userData?.email,
                role: member.role
            };
        });

        console.log(formattedMembers);

        return res.status(200).json({
            message: "Members fetched successfully",
            status: true,
            data: formattedMembers
        });
    } catch (error) {
        console.log("getOrganizationMembers: ", error);
    }
}