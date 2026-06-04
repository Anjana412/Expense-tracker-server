import express from 'express'
import { createTeam, getAllUsers, getBudget, getTeamMembers, login, makeAdmin, register, removeAdmin, removeUserFromTeam, updateBudget } from '../controller/usercontroller.js';

import authMiddleware from "../middleware/auth.js";

const userrouter = express.Router();

userrouter.post('/register',register);
userrouter.post('/login',login);
userrouter.put('/makeadmin/:id',makeAdmin);
userrouter.delete('/removeadmin/:id',removeAdmin);
userrouter.get('/allusers',getAllUsers);
userrouter.put("/setbudget",authMiddleware,  updateBudget);
userrouter.get("/getbudget",authMiddleware,  getBudget);

userrouter.post("/team/create", authMiddleware, createTeam);
userrouter.get("/team/members", authMiddleware, getTeamMembers);
userrouter.delete("/team/member/:userId", authMiddleware, removeUserFromTeam);


export default userrouter; 