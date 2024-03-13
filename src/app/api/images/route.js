import { NextResponse } from "next/server";
import { verifyJwtToken } from "../../../libs/auth";
import {awsService}  from "../../../libs/awsService";

export const dynamic = 'force-dynamic';

export async function GET(req) {

    try {

        const token = await verifyJwtToken(req.cookies.get('token')?.value);

        if (token) {

            return NextResponse.json({
                response: "Image",
                isCompleted: false
            });

        } else {

            return NextResponse.json({},{
                status: 401,
                statusText: "Unauthorized"
            });
        }
        
    } catch (err) {
        return NextResponse.json({},{
            status: 400,
            statusText: `Error ${err}`
        });
    }
}

export async function POST(req) {

    try {

        const token = await verifyJwtToken(req.cookies.get('token')?.value);

        if (token) {

            const formData = await req.formData();
            const file = formData.get('image');
            
            const filename = await awsService.uploadFile(file);

            return NextResponse.json({
                filename,
                isCompleted: false
            });

        } else {

            return NextResponse.json({},{
                status: 401,
                statusText: "Unauthorized"
            });
        }
        
    } catch (err) {
        return NextResponse.json({},{
            status: 400,
            statusText: `Error ${err}`
        });
    }
}