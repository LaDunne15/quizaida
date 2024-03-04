import mongoose, { Schema } from "mongoose";

const responseSchema = mongoose.Schema({
    test: {
        type: Schema.Types.ObjectId,
        ref: "Test"
    },
    executor: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    answers: [{
        question: {
            type: Schema.Types.ObjectId,
            ref: "Question"
        },
        answers: [{
            correct: Boolean,
            text: String,
            photo: String
        }]
    }],
    completed: {
        type: Date
    }
});

export default  mongoose.models.Response || mongoose.model("Response",responseSchema);