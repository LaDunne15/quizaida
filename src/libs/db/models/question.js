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
}, {
    toJSON: {
        virtuals: true
    },
    virtuals: {
        type: {
            get() {
                return this.answer.filter(i=>i.correct===true).length===1?"radio":"checkbox";
            }
        }
    }
}
);

export default  mongoose.models.Question || mongoose.model("Question",questionSchema);