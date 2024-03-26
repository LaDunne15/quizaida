import { NextResponse } from "next/server";
import connectDB from "../../../../libs/db/mongodb";
import User from "../../../../libs/db/models/user";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { getJwtSecretKey, verifyJwtToken } from "../../../../libs/auth";
export const dynamic = 'force-dynamic' // defaults to auto

connectDB();

export async function GET(req) {

    try {

        const token = await verifyJwtToken(req.cookies.get('token')?.value);

        if (token) {

            const user = await User.findById(token.id);

            return NextResponse.json({
                user
            }, {
                status: 200,
                headers: { "content-type": "application/json" }
            });

        } else {

            return NextResponse.json({
                success: "Є контанк"
            }, {
                status: 200,
                headers: { "content-type": "application/json" }
            });

        }
    } catch (err) {

        return NextResponse.json({}, {
            status: 400,
            statusText: `Error ${err}`
        });

    }
}

export async function POST(request) {

    try {
        const body = await request.json();
        const user = await User.findOne({email:body.email});

        if (!user) throw new Error("User not found");
        if (!bcrypt.compareSync(body.password, user.password)) throw new Error("Wrong password");

        const token = await new SignJWT({
            id: user._id,
            email: body.email
        })
        .setProtectedHeader({alg:"HS256"})
        .setIssuedAt()
        .setExpirationTime("1day")
        .sign(getJwtSecretKey());

        const response = NextResponse.json({}, {
            status: 200
        })
        
        response.cookies.set({
            name: "token",
            value: token,
            path: "/",
        });

        return response;
            
    } catch (err) {
        return NextResponse.json({},{
            status: 400,
            statusText: `${err.message}`
        });
    }
}

export async function PUT(req) {
    try {

        const body = await req.json();
        const token = await verifyJwtToken(req.cookies.get('token')?.value);
        if (token.id == body.user._id) {
            await User.findByIdAndUpdate(token.id, {
                firstname: body.user.firstname,
                lastname: body.user.lastname
            });
            return NextResponse.json({ success: true }, { status: 200, statusText: "Updated" });
        } else {
            throw new Error("Unauthorized");
        }

    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400, statusText: `Error ${error}` });       
    }
}

export async function DELETE(req) {
    try {
        const body = await req.json();
        const token = await verifyJwtToken(req.cookies.get('token')?.value);

        const user = await User.findById(token.id);

        if(bcrypt.compareSync(body.passwordToCorfirm,user.password)) {
            await User.findByIdAndDelete(token.id);
            return NextResponse.json({ success: true }, { status: 200, statusText: "Deleted" });
        } else {
            throw new Error("Wrong password");
        }

    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400, statusText: `Error ${error}` });       
    }
}

