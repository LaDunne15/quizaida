import { NextResponse } from "next/server"
import connect from "../../../libs/db/mongodb";
import Test from "../../../libs/db/models/test";
export const dynamic = 'force-dynamic';

connect();

export async function GET(req) {
    const tests = await Test.find({});

    return NextResponse.json({tests},{
        status: 200,
        statusText: "OK"
    })
}

export async function POST(request) {
    const body = await request.json();

    const newTest = new Test({
        author: body.author,
        theme: body.theme,
        sourse: body.sourses
    })

    await newTest.save();
    return NextResponse.json({ newTest },{
        status: 201,
        statusText: "Created"
    });
}