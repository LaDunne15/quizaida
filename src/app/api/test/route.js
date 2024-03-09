import { NextResponse } from "next/server"
import connect from "../../../libs/db/mongodb";
import Test from "../../../libs/db/models/test";
import Response from "../../../libs/db/models/response";
import User from "../../../libs/db/models/user";
import Question from "../../../libs/db/models/question";
import { verifyJwtToken } from "../../../libs/auth";
export const dynamic = 'force-dynamic';

connect();

export async function GET(req) {

    const id = req.nextUrl.searchParams.get("id");
    const token = await verifyJwtToken(req.cookies.get('token')?.value);

    try {
        if(token) {
            if (id) {
                const test = await Test.findById(id)
                .populate({
                    path: 'author',
                    model: User
                }).populate({
                    path: 'question',
                    model: Question
                });

                const response = await Response.findOne({
                    status: "In process",
                    executor: token.id,
                    test: id
                });

                return NextResponse.json({
                    test,
                    isOwner: test.author._id.toString() === token.id, 
                    inProcess: !!response,
                    responseId: response? response._id: null

                },{
                    status: 200,
                    statusText: "OK"
                });
            } else {
                const tests = await Test.find({}).populate({
                    path: 'author',
                    model: User
                });
                return NextResponse.json({tests},{
                    status: 200,
                    statusText: "OK"
                });
            }
            
        } else {
            return NextResponse.json({},{
                status: 401,
                statusText: "Unauthorized"
            })
        }
    } catch (err) {
        return NextResponse.json({},{
            status: 400,
            statusText: `Error ${err}`
        })
    }
}

export async function POST(request) {

    const body = await request.json();

    try {
        const createdQuestions = await Question.insertMany(body.questions);
        const ids = createdQuestions.map(doc => doc._id);
        const newTest = new Test({
            author: body.author,
            theme: body.theme,
            sourse: body.sourses,
            description: body.description,
            question: ids
        })

        await newTest.save();
    
        return NextResponse.json({ newTest },{
            status: 201,
            statusText: "Created"
        });

    } catch (err) {
        return NextResponse.json({},{
            status: 400,
            statusText: `Error ${err}`
        });
    }
}

export async function PUT(req) {

    try {
        
        const id = req.nextUrl.searchParams.get("id");
        const body = await req.json();    
        const token = await verifyJwtToken(req.cookies.get('token')?.value);

        if(token) {

            const test = await Test.findById(id);

            if (test.author.toString() === token.id) {

                const newQuestions = body.question.filter(q=>q._id==="").map((doc)=>{ const { _id, ...obj } = doc; return obj; });
                const createdQuestions = await Question.insertMany(newQuestions);

                const oldQuestionsIds = body.question.filter(q=>q._id!="").map(doc => doc._id);
                const newQuestionsIds = createdQuestions.map(doc => doc._id);

                await Test.findByIdAndUpdate(id, {
                    theme: body.theme,
                    sourse: body.sourse,
                    description: body.description,
                    question: [...oldQuestionsIds,...newQuestionsIds]
                });
                return NextResponse.json({},{
                    status: 200,
                    statusText: "Updated"
                });

            } else {
                return NextResponse.json({},{
                    status: 403,
                    statusText: "Forbidden"
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

export async function DELETE(req) {

    try {
        const id = req.nextUrl.searchParams.get("id");
        const body = await req.json();    
        const token = await verifyJwtToken(req.cookies.get('token')?.value);

        if(token) {

            const test = await Test.findById(id);

            if (test.author.toString() === token.id) {
                await Test.findByIdAndDelete(id);
                return NextResponse.json({},{
                    status: 200,
                    statusText: "Deleted"
                });
            } else {
                return NextResponse.json({},{
                    status: 403,
                    statusText: "Forbidden"
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