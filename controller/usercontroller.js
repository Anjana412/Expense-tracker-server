import User from "../models/user.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";

export const register = async (req,res)=>{
    try{
        const {name,email,password,role}=req.body;

        if(!name || !email ||!password){
            return res.status(400).json({message:"All fields needs to be filled"});
        }

        if(password.length <6){
            return res.status(400).json({message:"Password must be atleast 6 charachters"});
        }

        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already exists"});
        }

        const hashedPassword=await bcrypt.hash(password,10); 
        const newUser=new User({name,email,password:hashedPassword,role});
        const savedUser=await newUser.save();

        const token =jwt.sign({
            userId:savedUser._id,
            email:savedUser.email,
            role:savedUser.role
        },
        
        process.env.JWT_SECRET,
        {expiresIn : "1h"}
        );
    

      return res.status(201).json({message:"Registered Successfully",token,user:{_id:savedUser._id,name:savedUser.name,email:savedUser.email,role:savedUser.role}})

    }
    catch(e){
        console.error("Register error:",e);
        return res.status(500).json({message:"Error durig registration"})

    }
};

export const login = async(req,res)=>{
    try{
        const {email,password} = req.body;

        if(!email ||!password){
        return res.status(400).json({message:"please fill email and password "});
        }

        const user=await User.findOne({email});

        if(!user){
        return res.status(401).json({message:"Invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
        return res.status(401).json({message:"Invalid password"});
        }

        const token = jwt.sign({
            userId:user._id,
            email:user.email,
            role:user.role
        },
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
    );

    return res.status(200).json({message:"Login successful",token,user:{_id:user._id,name:user.name,email:user.email,role:user.role}});

    }
    catch(e){
        console.error("Login error:",e);
        return res.status(500).json({message:"Login failed"});
        
    }
}




export const getAllUsers = async (req,res)=>{
    const users = await User.find().select("-password");

    res.status(200).json(users);
}





export const updateBudget = async (req, res) => {
  try {
    const { monthlyBudget } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { monthlyBudget },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Budget updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update budget",
    });
  }
};

export const getBudget = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("monthlyBudget");

    res.status(200).json({
      monthlyBudget: user.monthlyBudget || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch budget",
    });
  }
}; 


export const createTeam = async (req, res) => {
  try {
    const adminId = new mongoose.Types.ObjectId(req.user.userId);
    const { userIds } = req.body;

    await User.updateMany(
      { _id: { $in: userIds } },
      { adminId }
    );

    res.json({ message: "Team created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTeamMembers = async (req, res) => {
  try {
    const adminId = new mongoose.Types.ObjectId(req.user.userId);

    const users = await User.find({ adminId }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const removeUserFromTeam = async (req, res) => {
  try {
    const { userId } = req.params;

    await User.findByIdAndUpdate(userId, {
      adminId: null,
    });

    res.json({ message: "User removed from team" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
 
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
 
        const hashedPassword = await bcrypt.hash(password, 10);
        // role is hardcoded "admin" — no way to create superadmin from UI
        const newAdmin = new User({ name, email, password: hashedPassword, role: "admin" });
        const savedAdmin = await newAdmin.save();
 
        return res.status(201).json({
            message: "Admin account created successfully",
            user: { _id: savedAdmin._id, name: savedAdmin.name, email: savedAdmin.email, role: savedAdmin.role }
        });
    } catch (e) {
        console.error("createAdmin error:", e);
        return res.status(500).json({ message: "Failed to create admin" });
    }
};
 
export const getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: "admin" }).select("-password");
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
export const deleteAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role === "superadmin") {
            return res.status(403).json({ message: "Cannot delete a Super Admin account" });
        }
        if (user.role !== "admin") {
            return res.status(400).json({ message: "User is not an admin" });
        }
 
        await User.findByIdAndDelete(req.params.id);
 
        res.status(200).json({ message: "Admin account deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};