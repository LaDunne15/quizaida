import { NextRequest, NextResponse } from "next/server"
import User from "../../../../libs/db/models/user"
import connect from "../../../../libs/db/mongodb";
import { generationService } from "../../../../libs/generationService";
export const dynamic = 'force-dynamic' // defaults to auto
import bcrypt from "bcrypt";

connect();

export async function GET(req) {

    try {
        const email = req.nextUrl.searchParams.get("email");
        const user = await User.findOne({ email });

        if (user) throw new Error ("This email is already taken");

        return NextResponse.json({
            statusText: "This email is available"        
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

        const userObject = {
            email: body.email,
            firstname: body.firstname,
            lastname: body.lastname,
            password: hashPassword(body.password, 10)
        }

        const newUser = new User(userObject);
        await newUser.save();

        return NextResponse.json({ 
            statusText: "Created" 
        },{ 
            status: 201 
        });
        
    } catch (err) {
        return NextResponse.json({
            statusText: err.message
        }, {
            status: 400
        });    
    }
}