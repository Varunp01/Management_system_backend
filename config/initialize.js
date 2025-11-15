import mongoose from "mongoose";
import { User } from "../models/user.js";
import { Organization } from "../models/organizations.js";
import { Members } from "../models/members.js";
import { Tasks } from "../models/tasks.js";


async function initializeData() {
  try {
    console.log("✅ Connected to MongoDB");

    // Predefined IDs (so relationships remain connected)
const userA = new mongoose.Types.ObjectId("6740a1a1a1a1a1a1a1a1a1a1");
const userB = new mongoose.Types.ObjectId("6740b2b2b2b2b2b2b2b2b2b2");
const userC = new mongoose.Types.ObjectId("6740c3c3c3c3c3c3c3c3c3c3");
const organization = new mongoose.Types.ObjectId("6750d4d4d4d4d4d4d4d4d4d4");
const membersDoc = new mongoose.Types.ObjectId("6760e5e5e5e5e5e5e5e5e5e5");
const task1 = new mongoose.Types.ObjectId("6770f6f6f6f6f6f6f6f6f6f6");
// FIX: Replaced 'g' with 'a' or another valid hex character
const task2 = new mongoose.Types.ObjectId("6780a7a7a7a7a7a7a7a7a7a7");

    // USERS (Upsert to avoid duplicates)
    await User.updateOne(
      { _id: userA },
      { name: "Aarav Sharma", email: "aarav@example.com", password: "hashed_password_1" },
      { upsert: true }
    );

    await User.updateOne(
      { _id: userB },
      { name: "Sara Khan", email: "sara@example.com", password: "hashed_password_2" },
      { upsert: true }
    );

    await User.updateOne(
      { _id: userC },
      { name: "Rohan Mehta", email: "rohan@example.com", password: "hashed_password_3" },
      { upsert: true }
    );

    console.log("✅ Users seeded/updated");

    // ORGANIZATION
    await Organization.updateOne(
      { _id: organization },
      { name: "PixelForge Studios", createdBy: userA },
      { upsert: true }
    );

    console.log("✅ Organization seeded/updated");

    // MEMBERS
    await Members.updateOne(
      { _id: membersDoc },
      {
        organizationId: organization,
        userInfo: [
          { userId: userA, role: "owner" },
          { userId: userB, role: "member" },
          { userId: userC, role: "member" },
        ],
      },
      { upsert: true }
    );

    console.log("✅ Members list seeded/updated");

    // TASK 1
    await Tasks.updateOne(
      { _id: task1 },
      {
        organizationId: organization,
        taskTitle: "Design Homepage Layout",
        taskDescription: "Create homepage wireframe and UI elements",
        assignedTo: userB,
        createdBy: userA,
        viewers: [{ userId: userC }],
        status: "in-progress",
      },
      { upsert: true }
    );

    // TASK 2
    await Tasks.updateOne(
      { _id: task2 },
      {
        organizationId: organization,
        taskTitle: "Write API Documentation",
        taskDescription: "Document authentication and task assignment APIs",
        assignedTo: userC,
        createdBy: userA,
        viewers: [{ userId: userB }],
        status: "todo",
      },
      { upsert: true }
    );

    console.log("✅ Tasks seeded/updated");
    console.log("🎉 Initialization complete");

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Initialization failed:", err);
    process.exit(1);
  }
}
export default initializeData;