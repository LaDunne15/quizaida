import mongoose, { Schema } from "mongoose";

const questionSchema = mongoose.Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    text: {
        type: String
    },
    photo: [{
        type: String
    }],
    answer: [{
        correct: Boolean,
        text: String,
        photo: String
    }],
    comment: {
        type: String
    },
    sourse: {
        type: String
    }
});

export default  mongoose.models.Question || mongoose.model("Question",questionSchema);