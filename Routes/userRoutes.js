import express from 'express'
import { createAdmin, createTeam, deleteAdmin, getAdmins, getAllUsers, getBudget, getTeamMembers, login, register, removeUserFromTeam, updateBudget } from '../controller/usercontroller.js';

import verifyToken, { requireRole } from '../middleware/auth.js';

const userrouter = express.Router();

userrouter.post('/register',register);
userrouter.post('/login',login);
userrouter. get('/allusers',getAllUsers);
userrouter.put("/setbudget",verifyToken,  updateBudget);
userrouter.get("/getbudget",verifyToken,  getBudget);

userrouter.post("/team/create", verifyToken, createTeam);
userrouter.get("/team/members", verifyToken, getTeamMembers);
userrouter.delete("/team/member/:userId", verifyToken, removeUserFromTeam);
userrouter.post('/admin/create', verifyToken, requireRole('superadmin'), createAdmin);
userrouter.get('/admins', verifyToken, requireRole('superadmin'), getAdmins);
userrouter.delete('/admin/:id', verifyToken, requireRole('superadmin'), deleteAdmin);

export default userrouter; 