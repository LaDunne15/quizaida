import { NextResponse } from "next/server"
import connect from "../../../libs/db/mongodb";
import Test from "../../../libs/db/models/test";
import Response from "../../../libs/db/models/response";
import User from "../../../libs/db/models/user";
import Question from "../../../libs/db/models/question";
import { verifyJwtToken } from "../../../libs/auth";
import { awsService } from "../../../libs/awsService";
export const dynamic = 'force-dynamic';

connect();

export async function GET(req) {

    try {

        const token = await verifyJwtToken(req.cookies.get('token')?.value);


        if(!token) throw new Error("Unauthorized");

        const substring = req.nextUrl.searchParams.get("searchString");

        if (!substring) return NextResponse.json({ tests:[] },{ status: 200 });

        const tests = await Test.find({
            type: "PUBLIC",
            theme: { 
                $regex: substring, 
                $options: "i" 
            }
        }).populate({
            path: 'author',
            model: User
        }).sort({
            created: -1
        });

        return NextResponse.json({
            tests
        },{
            status: 200
        });
            
    } catch (err) {
        return NextResponse.json({
            statusText: err.message
        },{
            status: 400
        })
    }
}