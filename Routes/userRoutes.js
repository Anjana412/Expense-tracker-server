import express from 'express'
import { addUserToTeam, createAdmin, createTeam, deleteAdmin, deleteTeam, getAdmins, getAllTeams, getAllUsers, getBudget, getTeamExpenses, getTeamMembers, getTeams, login, register, removeUserFromTeam, updateBudget } from '../controller/usercontroller.js';

import verifyToken, { requireRole } from '../middleware/auth.js';

const userrouter = express.Router();

userrouter.post('/register',register);
userrouter.post('/login',login);
userrouter. get('/allusers',getAllUsers);
userrouter.put("/setbudget",verifyToken,  updateBudget);
userrouter.get("/getbudget",verifyToken,  getBudget);
userrouter.post("/createteam", verifyToken, createTeam);
userrouter.get("/viewteams", verifyToken, getTeams);
userrouter.get("/viewteammembers/:teamId", verifyToken, getTeamMembers);
userrouter.post("/addteammember/:teamId", verifyToken, addUserToTeam);
userrouter.delete("/removeteammember/:teamId/:userId",verifyToken,removeUserFromTeam);
userrouter.delete("/deleteteam/:teamId", verifyToken, deleteTeam);
userrouter.get("/allteams", verifyToken, requireRole("superadmin"), getAllTeams);
userrouter.post("/admin/create",verifyToken,requireRole("superadmin"),createAdmin);
userrouter.get("/viewadmins",verifyToken,requireRole("superadmin"),getAdmins );
userrouter.delete("/admin/delete/:id",verifyToken,requireRole("superadmin"),deleteAdmin );
export default userrouter; 