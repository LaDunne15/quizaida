import { NextRequest, NextResponse } from "next/server"
import User from "../../../../libs/db/models/user"
import connect from "../../../../libs/db/mongodb";
export const dynamic = 'force-dynamic' // defaults to auto
import bcrypt from "bcrypt";
import { verifyJwtToken } from "../../../../libs/auth";

connect();

export async function GET(req) {

    try {
    
        const email = req.nextUrl.searchParams.get("email");
        const user = await User.findOne({ email });

        if (!user) throw new Error ("User not found");
        
        return NextResponse.json({
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

        const hashPassword = (pass, saltRounds = 10) => {
            try {
                return bcrypt.hashSync(pass, saltRounds);
            } catch (error) {
                console.error('Password hashing failed:', error);
                throw new Error('Password hashing failed');
            }
        };
    
        const hashedPass = hashPassword(body.password2, 10);
    
        if(!bcrypt.compareSync(body.password,hashedPass)) throw new Error ("Passwords do not match");
        
        const user = await User.findOneAndUpdate({ 
            email: body.email
        }, { 
            password: hashPassword(body.password, 10)
        }, {
            new: true 
        });
        await user.save();
    
        return NextResponse.json({
            statusText: "Updated"
        },{
            status: 200
        });
        
    } catch (err) {
        return NextResponse.json({
            statusText: err.message
        }, {
            status: 400
        })
    }

}

export async function PUT(request) {

    try {

        const body = await request.json();
        const token = await verifyJwtToken(request.cookies.get('token')?.value);

        if(token.email != body.email) throw new Error ("Not your account");        
        const hashPassword = (pass, saltRounds = 10) => {
            try {
                return bcrypt.hashSync(pass, saltRounds);
            } catch (error) {
                throw new Error('Password hashing failed');
            }
        };
        const hashedPass2 = hashPassword(body.password2, 10);

        if(!bcrypt.compareSync(body.password,hashedPass2)) throw new Error ("Passwords do not match");
    
        const newPassword = hashPassword(body.password, 10);

        await User.findOneAndUpdate({
            email: body.email 
        }, { 
            password: newPassword 
        });

        return NextResponse.json({
            statusText: "Updated password"
        },{
            status: 201
        });
    }
    catch (err) {
        return NextResponse.json({
            statusText: err.message
        },{
            status: 400
        })
    }
}