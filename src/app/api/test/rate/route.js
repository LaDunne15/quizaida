import { NextResponse } from "next/server";
import connect from "../../../../libs/db/mongodb";
import Test from "../../../../libs/db/models/test";
import { verifyJwtToken } from "../../../../libs/auth";
export const dynamic = 'force-dynamic';

connect();

export async function GET(req) {

    const token = await verifyJwtToken(req.cookies.get('token')?.value);

    if(token) {
        const tests = await Test.find({
            author: token.id
        });
        return NextResponse.json({tests},{
            status: 200,
            statusText: "OK"
        })
    } else {
        return NextResponse.json({},{
            status: 401,
            statusText: "Unauthorized"
        })
    }
}

export async function PUT(req) {

    try{
        
        const token = await verifyJwtToken(req.cookies.get('token')?.value);
        if(token) {
            const test = await Test.findById(req.nextUrl.searchParams.get("id")).populate({
                path: 'author'
            }).populate({
                path: 'question'
            });
            const body = await req.json();

            let rating = test.rating;
            
            const filter =rating.filter(i=>i.user.toString() === token.id);

            let liked = 0;
            
            if (filter.length === 0) {
                if(body.type === "LIKE") {
                    liked = 1;
                    rating.push({
                        kind: "LIKE",
                        user: token.id
                    });
                } else if(body.type === "DISLIKE") {
                    liked = -1;
                    rating.push({
                        kind: "DISLIKE",
                        user: token.id
                    });
                }
            } else {
                if(filter[0].kind === body.type) {
                    liked = 0;
                    rating = rating.filter(i=>i.user.toString() !== token.id);
                } else {
                    liked = body.type === "LIKE" ? 1 : -1;
                    filter[0].kind = body.type;
                    rating = [...rating.filter(i=>i.user.toString() !== token.id), filter[0]];
                }
            }

            await test.updateOne({rating}, {new: true});
            console.log(test);

            return NextResponse.json({liked, rating: test.totalrating},{
                status: 200,
                statusText: "OK"
            });

        } else {
            return NextResponse.json({},{
                status: 401,
                statusText: "Unauthorized"
            });
        } 
    } catch (err) {
        console.log(err);
        return NextResponse.json({},{
            status: 400,
            statusText: `Error ${err}`
        })
    }
}