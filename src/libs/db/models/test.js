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
        user:{
        type: Schema.Types.ObjectId,
        ref: "User"
        },
        kind: {
            type: String,
            enum: ["LIKE","DISLIKE"]
        }
    }],
    type: {
        default: "PUBLIC",
        enum: ["PRIVATE","PUBLIC"],
        type: String
    },
    created: {
        type: Date,
        default: Date.now()
    }, 
    endTime: {
        type: Date
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    virtuals: {
        totalrating: {
            get() {
                return this.rating.filter(i=>i.kind==="LIKE").length - this.rating.filter(i=>i.kind==="DISLIKE").length;
            }
        }
    }
}
);


export default  mongoose.models.Test || mongoose.model("Test",testSchema);