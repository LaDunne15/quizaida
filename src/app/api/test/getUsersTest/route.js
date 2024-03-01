import { NextResponse } from "next/server";
import connect from "../../../../libs/db/mongodb";
import Test from "../../../../libs/db/models/test";
import { verifyJwtToken } from "../../../../libs/auth";
export const dynamic = 'force-dynamic';

connect();

export async function GET(req) {

    const token = await verifyJwtToken(req.cookies.get('token')?.value);

    if(token) {
        const tests = await Test.find({
            author: token.id
        });
        return NextResponse.json({tests},{
            status: 200,
            statusText: "OK"
        })
    } else {
        return NextResponse.json({},{
            status: 401,
            statusText: "Unauthorized"
        })
    }
}