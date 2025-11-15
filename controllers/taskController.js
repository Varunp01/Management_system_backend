import { User } from "../models/user.js";
import { Members } from "../models/members.js";
import { Organization } from "../models/organizations.js";
import { Tasks } from "../models/tasks.js";

export const createTask = async (req, res) => {
    try {
        const { orgId } = req.params;
        const { taskTitle, taskDescription, assignedTo } = req.body;
        const createdBy = req.user;

        // Verify organization exists
        const organization = await Organization.findById(orgId);
        if (!organization) {
            return res.status(401).json({
                message: "Organization not found",
                status: false
            });
        }

        // Fetch organization members
        const membersRecord = await Members.findOne({ organizationId: orgId });
        if (!membersRecord) {
            return res.status(401).json({
                message: "Member record not found",
                status: false
            });
        }

        // Check if creator is a member
        const isCreatorMember = membersRecord.userInfo.some(
            m => m.userId.toString() === createdBy.toString()
        );
        if (!isCreatorMember) {
            return res.status(401).json({
                message: "You are not a member of this organization",
                status: false
            });
        }

        // Check if assignedTo user exists and is part of organization
        const isAssignedMember = membersRecord.userInfo.some(
            m => m.userId.toString() === assignedTo.toString()
        );
        if (!isAssignedMember) {
            return res.status(403).json({
                message: "Assigned user is not a member of this organization",
                status: false
            });
        }

        // Set viewers = all other members except assigned user
        const viewers = membersRecord.userInfo
            .filter(m => m.userId.toString() !== assignedTo.toString())
            .map(m => ({ userId: m.userId }));

        // Create Task
        const newTask = await Tasks.create({
            organizationId: orgId,
            taskTitle,
            taskDescription,
            assignedTo,
            createdBy,
            viewers,
            status: "todo"
        });

        return res.status(201).json({
            message: "Task created successfully",
            status: true,
        });

    } catch (error) {
        console.log("createTask: ", error);
    }
}

export const getTasksByOrganization = async (req, res) => {
    try {
        const { orgId } = req.params;

        // 1. Verify organization exists
        const organization = await Organization.findById(orgId);
        if (!organization) {
            return res.status(404).json({
                message: "Organization not found",
                status: false
            });
        }

        // 2. Fetch all tasks for the organization
        const tasks = await Tasks.find({ organizationId: orgId })
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 }); // newest first

        return res.status(200).json({
            message: "Tasks fetched successfully",
            status: true,
        });

    } catch (error) {
        console.log("getTasksByOrganization Error:", error);
    }
};

export const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;

        // 1. Fetch task with required populated fields
        const task = await Tasks.findById(taskId)
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email")
            .populate("viewers.userId", "name email");

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
                status: false
            });
        }

        return res.status(200).json({
            message: "Task details fetched successfully",
            status: true,
        });

    } catch (error) {
        console.log("getTaskById Error:", error);
    }
};

export const changeTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const requestingUserId = req.user; // from auth middleware

    // Validate status
    const validStatus = ["todo", "in-progress", "done"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
        status: false
      });
    }

    // Fetch task
    const task = await Tasks.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        status: false
      });
    }

    // Check if requesting user is the assigned user
    if (task.assignedTo.toString() !== requestingUserId.toString()) {
      return res.status(403).json({
        message: "Only the assigned user can change the task status",
        status: false
      });
    }

    // Update status
    task.status = status;
    await task.save();

    return res.status(200).json({
      message: "Task status updated successfully",
      status: true,
    });

  } catch (error) {
    console.log("changeTaskStatus Error:", error);
  }
};
