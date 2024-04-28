import { NextResponse } from "next/server";
import connect from "../../../../libs/db/mongodb";
import Test from "../../../../libs/db/models/test";
import { verifyJwtToken } from "../../../../libs/auth";
export const dynamic = 'force-dynamic';

connect();

export async function GET(req) {

    try {

        const token = await verifyJwtToken(req.cookies.get('token')?.value);

        if (!token) throw new Error("Unauthorized");

        const tests = await Test.find({
            author: token.id
        }).sort({ created: -1 });

        return NextResponse.json({ tests },{
            status: 200,
            statusText: "OK"
        })

    } catch (err) {

        return NextResponse.json({
            statusText: err.message
        }, {
            status: 400
        });
    }
}