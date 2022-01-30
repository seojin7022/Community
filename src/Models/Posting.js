import mongoose from "mongoose";

const postingSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 2 },
    content: { type: String, required: true, minlength: 2 },
    author: {type: String, required: true},
    date: { type: Date, default: Date.now }, 
    meta: {
        view: {type: Number, default: 0}
    }
});

const Posting = mongoose.model("Posting", postingSchema);
export default Posting;