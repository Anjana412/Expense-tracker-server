import Expense from "../models/expense.js";
import User from "../models/user.js";
import mongoose from "mongoose";

export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      description,
      userId: req.user.userId,
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add expense",
    });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.user.userId,
    }).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch expenses",
    });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      req.body,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json({
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({
      message: "Update failed",
    });
  }
};


export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
    });
  }
};




export const getSingleExpense = async (req,res)=>{
  try{
    const expense = await Expense.findOne({
      _id:req.params.id,
      userId:req.user.userId
    });

    if(!expense){
      return res.status(404).json({
        message:"Expense not found"
      });
    }

    res.status(200).json(expense);

  }catch(error){
    res.status(500).json({
      message:"Failed to fetch expense"
    });
  }
}



export const getAllExpenses = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const expenses = await Expense.find()
      .populate("userId", "name email role")
      .sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all expenses" });
  }
};


export const createExpense = async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      userId: req.user.userId,
      status: "pending",
    });

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTeamExpenses = async (req, res) => {
  try {
    const adminId = new mongoose.Types.ObjectId(req.user.userId);

    const users = await User.find({ adminId }).select("_id");

    const userIds = users.map(u => u._id);

    if (userIds.length === 0) {
      return res.json([]);
    }

    const expenses = await Expense.find({
      userId: { $in: userIds },
    }).populate("userId", "name email role").sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateExpenseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const expense = await Expense.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMonthlyTrend = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const year   = parseInt(req.query.year) || new Date().getFullYear();

    const trend = await Expense.aggregate([
      {
        $match: {
          userId,
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      {
        $group: {
          _id:         { month: { $month: "$date" } },
          totalAmount: { $sum: "$amount" },
          count:       { $sum: 1 },
          avgAmount:   { $avg: "$amount" },
        },
      },

      {
        $project: {
          _id:         0,
          month:       "$_id.month",  
          totalAmount: { $round: ["$totalAmount", 2] },
          count:       1,
          avgAmount:   { $round: ["$avgAmount", 2] },
        },
      },

      { $sort: { month: 1 } },
    ]);

    const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const full = MONTH_NAMES.map((name, i) => {
      const found = trend.find((t) => t.month === i + 1);
      return {
        month:       name,
        monthNumber: i + 1,
        totalAmount: found?.totalAmount ?? 0,
        count:       found?.count       ?? 0,
        avgAmount:   found?.avgAmount   ?? 0,
      };
    });

    res.status(200).json({ year, trend: full });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getExpenseSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const summary = await Expense.aggregate([
      { $match: { userId } },

      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count:       { $sum: 1 },
          avgAmount:   { $avg: "$amount" },
          maxAmount:   { $max: "$amount" },
        },
      },

      {
        $project: {
          _id: 0,
          category:    "$_id",
          totalAmount: { $round: ["$totalAmount", 2] },
          count:       1,
          avgAmount:   { $round: ["$avgAmount", 2] },
          maxAmount:   { $round: ["$maxAmount", 2] },
        },
      },

      { $sort: { totalAmount: -1 } },
    ]);

    const [overall] = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id:         null,
          totalAmount: { $sum: "$amount" },
          totalCount:  { $sum: 1 },
          avgAmount:   { $avg: "$amount" },
          maxAmount:   { $max: "$amount" },
        },
      },
      {
        $project: {
          _id:         0,
          totalAmount: { $round: ["$totalAmount", 2] },
          totalCount:  1,
          avgAmount:   { $round: ["$avgAmount", 2] },
          maxAmount:   { $round: ["$maxAmount", 2] },
        },
      },
    ]);

    res.status(200).json({
      byCategory: summary,
      overall: overall ?? {
        totalAmount: 0,
        totalCount: 0,
        avgAmount: 0,
        maxAmount: 0,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};