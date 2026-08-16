const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
{
    userId:{
        // Firebase UIDs are strings, not MongoDB ObjectIds.
        type:String,
        required:true,
        unique:true,
        index:true
    },

    fullName:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        lowercase:true
    },

    phone:{
        type:String,
        default:""
    },

    gender:{
        type:String,
        enum:["Male","Female","Other"],
        default:"Other"
    },

    dob:{
        type:Date
    },

    photo:{
        type:String,
        default:""
    },

    bloodGroup:{
        type:String,
        default:""
    },

    height:{
        type:Number,
        default:0
    },

    weight:{
        type:Number,
        default:0
    },

    allergies:{
        type:[String],
        default:[]
    },

    diseases:{
        type:[String],
        default:[]
    },

    medications:{
        type:[String],
        default:[]
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("UserProfile",userProfileSchema);
