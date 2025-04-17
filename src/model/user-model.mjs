import mongoose, { STATES } from "mongoose";

// mode/user-model.mjs

const userModel = new mongoose.Schema({
    nama : {
        type : String,
        require : true
    },
    email  : {
        type : String,
        require : true
    },
    foto : {
        type : String,
    },
    role : {
        type : String,
        require : true
    },
    token : {
        type : String,
    },
    password : {
        type : String,
        require : true
    },
});

const UserModel = mongoose.model('users' , userModel);
export default UserModel