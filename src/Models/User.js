import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, minlength: 2, maxlength: 10},
    email: { type: String, required: true, unique: true },
    socialOnly: {type: Boolean, default: false},
    password: { type: String, minlength: 8, maxlength: 16 },
    postings: [{type: String}],
});

userSchema.pre("save", async function () {
    if (this.socialOnly === true) return;
    this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);
export default User;