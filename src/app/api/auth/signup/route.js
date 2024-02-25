import { NextRequest, NextResponse } from "next/server"
import User from "../../../../libs/db/models/user"
import connect from "../../../../libs/db/mongodb";
export const dynamic = 'force-dynamic' // defaults to auto
import bcrypt from "bcrypt";

connect();

export async function GET(req) {
    const email = req.nextUrl.searchParams.get("email");


    try {
        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json({
                message: null
            }, {
                status: 409,
                statusText: "This email is already in use by another user."
            });
        } else {
            return NextResponse.json({
                message: null
            }, {
                status: 201,
                statusText: "This email is free"
            });
        }
    } catch (error) {
        console.error("Помилка", error);
        return NextResponse.json({
            message: "Internal Server Error"
        }, {
            status: 500,
            statusText: "Internal Server Error"
        });
    }
}

export async function POST(request) {
    const body = await request.json();

    const hashPassword = (pass, saltRounds = 10) => {
        try {
            return bcrypt.hashSync(pass, saltRounds);
        } catch (error) {
            console.error('Password hashing failed:', error);
            throw new Error('Password hashing failed');
        }
    };

    const hashedPass = hashPassword(body.password, 10);
    const hashedPass2 = hashPassword(body.password2, 10);

    if(bcrypt.compareSync(body.password,hashedPass2)) {
        const userObject = {
            email: body.email,
            firstname: body.firstname,
            lastname: body.lastname,
            password: hashPassword(body.password, 10)
        }
        const newUser = new User(userObject);
        await newUser.save();
        return NextResponse.json({ newUser },{
            status: 201,
            statusText: "Created"
        });
    } else {
        return NextResponse.json({},{
            status: 401,
            statusText: "Passwords do not match"
        })
    }
}