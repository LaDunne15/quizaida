import { NextResponse } from "next/server";
import connectDB from "../../../../libs/db/mongodb";
import User from "../../../../libs/db/models/user";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { getJwtSecretKey } from "../../../../libs/auth";
export const dynamic = 'force-dynamic' // defaults to auto

connectDB();

export async function POST(request) {

    const body = await request.json();
    const user = await User.findOne({email:body.email});

    if(user) {
        if(bcrypt.compareSync(body.password,user.password)){
            const token = await new SignJWT({
                id: user._id,
                email: body.email
            })
            .setProtectedHeader({alg:"HS256"})
            .setIssuedAt()
            .setExpirationTime("1day")
            .sign(getJwtSecretKey());
            const response = NextResponse.json({
                success: true
            }, {
                status: 200,
                headers: { "content-type": "application/json" }
            })
            response.cookies.set({
                name: "token",
                value: token,
                path: "/",
            });
            return response;

        }   else {
            return NextResponse.json({
                success: false
            },{
                status: 401,
                statusText: "Incorect password"
            });
        }
    } else {
        return NextResponse.json({
            success: false
        },{
            status: 404,
            statusText: "User not Found"
        });
    }
}