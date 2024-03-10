import { NextResponse } from "next/server";
import connect from "../../../../libs/db/mongodb";
import Test from "../../../../libs/db/models/test";
import Response from "../../../../libs/db/models/response";
import { verifyJwtToken } from "../../../../libs/auth";
export const dynamic = 'force-dynamic';

connect();

export async function GET(req) {

    try {

        const token = await verifyJwtToken(req.cookies.get('token')?.value);

        if (token) {

            const id = req.nextUrl.searchParams.get("id");

            const response = await Response.findById(id)
                .populate({
                    path: 'test',
                    populate: {
                        path: 'question'
                    }
                }).populate({
                    path: 'executor'
                }).populate({
                    path: 'test',
                    populate: {
                        path: 'author'
                    }
                }).populate({
                    path: 'answers',
                    populate: {
                        path: 'question'
                    }
                });

            
            const result = response.answers.sort((a,b)=>{return (a.orderNumber-b.orderNumber);}).map(i=>{

                var _res;
                if(i.question.type==="radio") {
                    _res = i.question.correctAnswers[0].id === i.answers[0]?1:0;
                } else {
                    const ans = i.question.answer.map(i=>({correct:i.correct,id:i.id}));
                    const ans2 = i.answers;
                    const res = ans.map(i=>i.correct?(ans2.includes(i.id)?1:0):(!ans2.includes(i.id)?1:0));
                    _res = res.reduce((acc,val) => acc + val)/res.length;
                }
                return {...i.toObject(), rating: _res};
            });
    
            return NextResponse.json({
                response: {...response, answers: result},
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

            const id = req.nextUrl.searchParams.get("id");

            const response = await Response.findByIdAndUpdate(id, {
                status: "Completed",
                completed: Date.now()
            },{
                new: true
            }).populate({
                path: 'test',
                populate: {
                    path: 'question'
                }
            }).populate({
                path: 'executor'
            }).populate({
                path: 'test',
                populate: {
                    path: 'author'
                }
            }).populate({
                path: 'answers',
                populate: {
                    path: 'question'
                }
            });

            const result = response.answers.sort((a,b)=>{return (a.orderNumber-b.orderNumber);}).map(i=>{

                var _res;
                if(i.question.type==="radio") {
                    _res = i.question.correctAnswers[0].id === i.answers[0]?1:0;
                } else {
                    const ans = i.question.answer.map(i=>({correct:i.correct,id:i.id}));
                    const ans2 = i.answers;
                    const res = ans.map(i=>i.correct?(ans2.includes(i.id)?1:0):(!ans2.includes(i.id)?1:0));
                    _res = res.reduce((acc,val) => acc + val)/res.length;
                }
                return {...i.toObject(), rating: _res};
            });
    
            return NextResponse.json({
                response: {...response.toObject(), answers: result},
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