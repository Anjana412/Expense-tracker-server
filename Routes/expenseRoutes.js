import express from "express";
import {addExpense,getExpenses,updateExpense,deleteExpense,getSingleExpense, getTeamExpenses, getAllExpenses, updateExpenseStatus, getExpenseSummary, getMonthlyTrend } from "../controller/expensecontroller.js";
import verifyToken from "../middleware/auth.js";
import authMiddleware from "../middleware/auth.js";

const expenserouter = express.Router();

expenserouter.post("/addexpense", verifyToken, addExpense);
expenserouter.get("/getexpense", verifyToken, getExpenses);
expenserouter.get("/summary", verifyToken, getExpenseSummary);
expenserouter.get("/monthly-trend", verifyToken, getMonthlyTrend);
expenserouter.put("/updateexpense/:id", verifyToken, updateExpense);
expenserouter.delete("/delete/:id", verifyToken, deleteExpense);
expenserouter.get("/expense/:id",verifyToken,getSingleExpense);
expenserouter.get("/team/expenses", verifyToken, getTeamExpenses);
expenserouter.get("/global/expenses", verifyToken, getAllExpenses);
expenserouter.get("/team/:teamId", verifyToken, getTeamExpenses);

expenserouter.patch("/expense/:id/status", authMiddleware, updateExpenseStatus);

export default expenserouter;