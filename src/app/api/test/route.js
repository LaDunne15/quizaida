import { NextResponse } from "next/server"
import connect from "../../../libs/db/mongodb";
import Test from "../../../libs/db/models/test";
import Response from "../../../libs/db/models/response";
import User from "../../../libs/db/models/user";
import Question from "../../../libs/db/models/question";
import { verifyJwtToken } from "../../../libs/auth";
import { awsService } from "../../../libs/awsService";
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

                console.log(test);

                const filter =test.rating.filter(i=>i.user.toString() === token.id);

                let liked = 0;

                if( filter.length != 0 ) {
                    liked = filter[0].kind === "LIKE" ? 1 : -1;
                }

                const response = await Response.findOne({
                    status: "In process",
                    executor: token.id,
                    test: id
                });

                return NextResponse.json({
                    test,
                    isOwner: test.autor?test.author._id.toString() === token.id: false, 
                    inProcess: !!response,
                    responseId: response? response._id: null,
                    liked
                },{
                    status: 200,
                    statusText: "OK"
                });
            } else {
                const tests = await Test.find({
                    type: "PUBLIC" 
                }).populate({
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

    try {
        
        const formData = await request.formData();
        const file = JSON.parse(formData.get('test'));

        console.log(file);

        const questions = file.questions.map((i)=>{

            const photo = i.photo.map((p)=>{
                const _file = formData.get(p);
                if (!_file) return "";

                const filename = `${p}.${_file.name.split('.').pop()}` 
                awsService.uploadFile(_file, filename);
                return awsService.getFileLink(filename);
            });

            const answer = i.answer.map(j=>{
                const _file = formData.get(j.photo);
                if (!_file) return {...j, photo: ""};
                const filename = `${j.photo}.${_file.name.split('.').pop()}`
                awsService.uploadFile(_file, filename);
                return {...j, photo: awsService.getFileLink(filename)}
            });

            return {...i, photo, answer };
        });

        if (file.mainImage!=="") {
            const _file = formData.get(file.mainImage);
            const filename = `${file.mainImage}.${_file.name.split('.').pop()}`;
            file.mainImage = awsService.getFileLink(filename);
            awsService.uploadFile(_file, filename);
        }

        const createdQuestions = await Question.insertMany(questions);
        const ids = createdQuestions.map(doc => doc._id);

        const newTest = new Test({
            author: file.author,
            theme: file.theme,
            sourse: file.sourses,
            mainImage: file.mainImage,
            description: file.description,
            type: file.type,
            question: ids
        });

        const result = await newTest.save();
    
        return NextResponse.json({ newTest: result },{
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
        
        const token = await verifyJwtToken(req.cookies.get('token')?.value);

        if(token) {

            const id = req.nextUrl.searchParams.get("id");
            const test = await Test.findById(id);

            if (test.author.toString() === token.id) {

                const formData = await req.formData();
                const test = JSON.parse(formData.get('test'));

                
                const newQuestions = test.question.filter(q=>q._id==="")
                    .map((doc)=>{ 
                        const { _id, ...obj } = doc; 
                        const photo = obj.photo.map((p)=>{
                            const _file = formData.get(p);
                            if (!_file) return "";
            
                            const filename = `${p}.${_file.name.split('.').pop()}` 
                            awsService.uploadFile(_file, filename);
                            return awsService.getFileLink(filename);
                        });
            
                        const answer = obj.answer.map(j=>{
                            const _file = formData.get(j.photo);
                            if (!_file) return {...j, photo: ""};
                            const filename = `${j.photo}.${_file.name.split('.').pop()}`
                            awsService.uploadFile(_file, filename);
                            return {...j, photo: awsService.getFileLink(filename)}
                        });
            
                        return {...obj, photo, answer };
                    });
                    
                const createdQuestions = await Question.insertMany(newQuestions);

                const oldQuestionsIds = test.question.filter(q=>q._id!="").map(doc => doc._id);
                const newQuestionsIds = createdQuestions.map(doc => doc._id);



                if(!test.mainImage.includes(".") && test.mainImage!=="") {
                    const _file = formData.get(test.mainImage);
                    const filename = `${test.mainImage}.${_file.name.split('.').pop()}`;
                    test.mainImage = awsService.getFileLink(filename);
                    awsService.uploadFile(_file, filename);
                }
                
                await Test.findByIdAndUpdate(id, {
                    type: test.type,
                    theme: test.theme,
                    sourse: test.sourse,
                    mainImage: test.mainImage,
                    description: test.description,
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
        const token = await verifyJwtToken(req.cookies.get('token')?.value);

        if(token) {

            const test = await Test.findById(id);

            if (test.author.toString() === token.id) {

                await Test.findByIdAndDelete( id );
                await Response.deleteMany({ test:id });

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