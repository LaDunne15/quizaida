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
                message: "User found"
            }, {
                status: 200
            });
        } else {
            return NextResponse.json({
                message: "User not found"
            }, {
                status: 404
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

    const hashedPass = hashPassword(body.password2, 10);

    if(bcrypt.compareSync(body.password,hashedPass)) {

        const newPassword = hashPassword(body.password, 10);

        const user = await User.findOneAndUpdate(
            { email: body.email }, 
            { password: newPassword },
            { new: true }
        );

        return NextResponse.json({ },{
            status: 200,
            statusText: "Updated"
        });
    } else {
        return NextResponse.json({},{
            status: 401,
            statusText: "Passwords do not match"
        })
    }
}