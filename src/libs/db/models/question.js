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
        text: String,
        photo: String
    }],
    correctAnswer: {
        type: Number
    },
    comment: {
        type: String
    },
    sourse: {
        type: String
    }
});

export default  mongoose.models.Question || mongoose.model("Question",questionSchema);