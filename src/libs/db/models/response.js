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
            type: String
        }],
        orderNumber: Number
    }],
    status: {
        type: String,
        enum: [
            'Completed',
            'In process'
        ],
        default: 'In process'
    },
    started: {
        type: Date,
        default: Date.now()
    },
    completed: {
        type: Date
    }
});

export default  mongoose.models.Response || mongoose.model("Response",responseSchema);