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

        if (!token) throw new Error("Unauthorized");
        const user = await User.findById(token.id);
        if (!user) throw new Error("User not found");

        return NextResponse.json({
            user,
            statusText: "User found"
        }, {
            status: 200
        });

    } catch (err) {

        return NextResponse.json({
            statusText: err.message
        }, {
            status: 400
        });

    }
}

export async function POST(req) {

    try {

        const body = await req.json();
        const user = await User.findOne({ email:body.email });
    
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
        });
            
        response.cookies.set({
            name: "token",
            value: token,
            path: "/",
        });
    
        return response;

    } catch (err) {
        return NextResponse.json({
            statusText: err.message
        }, { 
            status: 400
        });
    }
}

export async function PUT(req) {
    try {

        const body = await req.json();
        const token = await verifyJwtToken(req.cookies.get('token')?.value);

        if (token.id != body.user._id) throw new Error("Not permitted to update this user");

        await User.findByIdAndUpdate(token.id, {
            firstname: body.user.firstname,
            lastname: body.user.lastname
        });
        return NextResponse.json({ 
            statusText: "Updated"
        }, { 
            status: 200
        });

    } catch (err) {
        return NextResponse.json({
            statusText: err.message
        }, { 
            status: 400
        });       
    }
}

export async function DELETE(req) {
    try {
        const body = await req.json();
        const token = await verifyJwtToken(req.cookies.get('token')?.value);

        const user = await User.findById(token.id);

        if(!bcrypt.compareSync(body.passwordToCorfirm,user.password)) throw new Error("Wrong password");

        await User.findByIdAndDelete(token.id);
        return NextResponse.json({
            statusText: "Deleted"
        }, {
            status: 200
        });

    } catch (err) {
        return NextResponse.json({ 
            statusText: err.message
        }, {
            status: 400
        });       
    }
}

