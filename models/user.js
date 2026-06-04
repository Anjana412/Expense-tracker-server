import mongoose from 'mongoose'

let userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, "Name is required"],
            trim:true,
        },
        email:{
            type:String,
            required:[true, "Email is required"],
            unique:true,
            trim:true,
        },
        password:{
            type:String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be atleast 6 characters"]
        },
        role:{
            type:String,
            enum:['user','admin','superadmin'],
            default:'user',
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
            },
        monthlyBudget: {
            type: Number,
            default: 0,
            },

    }
)

const User = mongoose.model("User",userSchema);

export default User;