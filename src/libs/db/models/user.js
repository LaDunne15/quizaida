import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: { type: String, require: true, unique: true },
    firstname: { type: String, require: true },
    lastname: { type: String, require: true },
    password: { type: String, require: true }
});

export default  mongoose.models.User || mongoose.model("User",userSchema);