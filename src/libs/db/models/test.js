import mongoose, { Schema } from "mongoose";

const testSchema = mongoose.Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    theme: {
        type: String
    },
    description: {
        type: String
    },
    sourse: [{
        type: String
    }],
    question: [{
        type: Schema.Types.ObjectId,
        ref: "Question"
    }],
    rating: [{
        qwewqe:{
        type: Schema.Types.ObjectId,
        ref: "User"
        },
        kind: {
            type: String,
            enum: ["LIKE","DISLIKE"]
        }
    }],
    created: {
        type: Date,
        default: Date.now()
    }, 
    endTime: {
        type: Date
    }
});

export default  mongoose.models.Test || mongoose.model("Test",testSchema);