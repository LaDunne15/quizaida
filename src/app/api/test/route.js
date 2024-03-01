import { NextResponse } from "next/server"
import connect from "../../../libs/db/mongodb";
import Test from "../../../libs/db/models/test";
import User from "../../../libs/db/models/user";
import { verifyJwtToken } from "../../../libs/auth";
export const dynamic = 'force-dynamic';

connect();

export async function GET(req) {

    const id = req.nextUrl.searchParams.get("id");
    const token = await verifyJwtToken(req.cookies.get('token')?.value);

    try {
        if(token) {
            if (id) {
                const test = await Test.findById(id)
                .populate({
                    path: 'author',
                    model: User
                });
                return NextResponse.json({test},{
                    status: 200,
                    statusText: "OK"
                });
            } else {
                const tests = await Test.find({}).populate({
                    path: 'author',
                    model: User
                });
                return NextResponse.json({tests},{
                    status: 200,
                    statusText: "OK"
                });
            }
            
        } else {
            return NextResponse.json({},{
                status: 401,
                statusText: "Unauthorized"
            })
        }
    } catch (err) {
        return NextResponse.json({},{
            status: 400,
            statusText: `Error ${err}`
        })
    }
}

export async function POST(request) {
    const body = await request.json();

    const newTest = new Test({
        author: body.author,
        theme: body.theme,
        sourse: body.sourses,
        description: body.description
    })

    await newTest.save();

    return NextResponse.json({ newTest },{
        status: 201,
        statusText: "Created"
    });
}

export async function PUT(req) {
    const id = req.nextUrl.searchParams.get("id");
    
    const body = await req.json();

    const token = await verifyJwtToken(req.cookies.get('token')?.value);

    if(token) {
        await Test.findByIdAndUpdate(id, {
            theme: body.test.theme,
            sourse: body.test.sourse,
            description: body.test.description
        });
        return NextResponse.json({},{
            status: 200,
            statusText: "Updated"
        })
    } else {
        return NextResponse.json({},{
            status: 401,
            statusText: "Unauthorized"
        })
    }

}

export async function DELETE(req) {

    const id = req.nextUrl.searchParams.get("id");

    try {
        await Test.findByIdAndDelete(id);
        return NextResponse.json({},{
            status: 200,
            statusText: "Deleted"
        });
    } catch (err) {
        return NextResponse.json({},{
            status: 400,
            statusText: `Error ${err}`
        });
    }
}