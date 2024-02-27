import mongoose, { Schema } from "mongoose";

const testSchema = mongoose.Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    theme: {
        type: String
    },
    sourse: [{
        type: String
    }],
    question: [{
        type: String
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