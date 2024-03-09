import { NextResponse } from "next/server"
import connect from "../../../libs/db/mongodb";
import Test from "../../../libs/db/models/test";
import User from "../../../libs/db/models/user";
import Response from "../../../libs/db/models/response";
import Question from "../../../libs/db/models/question";
import { verifyJwtToken } from "../../../libs/auth";
export const dynamic = 'force-dynamic';

connect();

export async function GET(req) {

    try {
        const token = await verifyJwtToken(req.cookies.get('token')?.value);

        if (token) {

            const id = req.nextUrl.searchParams.get("id");

            if(id) {

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
    
                return NextResponse.json({
                    response,
                    isCompleted: false
                });
    
            } else {
                const response = await Response.find({
                    executor: token.id
                })
                .populate({
                    path: 'test'
                }).populate({
                    path: 'executor'
                }).sort({
                    started: 1
                });
                
                return NextResponse.json({
                    response
                });
            }

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

        const idTest = req.nextUrl.searchParams.get("idTest");
        const token = await verifyJwtToken(req.cookies.get('token')?.value);
        
        if(token) {

            const test = await Test.findById(idTest);

            const newResponse = new Response({
                test: idTest,
                executor: token.id,
                answers: test.question.map((i,index)=>({
                    question: i,
                    answers: [],
                    orderNumber: index
                }))
            });
            
            await newResponse.save();

            return NextResponse.json({ newResponse },{
                status: 201,
                statusText: "Created"
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

export async function PUT(req) {
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
                });

            var { question, answer, type } = await req.json();

            answer = answer.toString();
            question = question.toString();
            
            var answers = response.answers;
            var que = answers.filter(i=>i.question==question)[0]; 
            if (que) {
                const orderNumber = que.orderNumber;
                if (type=="radio") {
                    answers = [...answers.filter(i=>i.question!=question), {question,answers:[answer],orderNumber}];
                } else {
                    var ans = que.answers.filter(i=>i==answer)[0];
                    var ans2 = ans?que.answers.filter(i=>i!=answer):[...que.answers,answer];
                    answers = [...answers.filter(i=>i.question!=question), {question,answers:[...ans2],orderNumber}];
                } 
            } else {
                answers = [...answers, {question,answers:[answer],orderNumber:answers.length}];
            }


            response.answers = answers;

            response.save();
    
            return NextResponse.json({
                response,
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