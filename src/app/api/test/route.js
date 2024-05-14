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

    try {

        const token = await verifyJwtToken(req.cookies.get('token')?.value);

        if(!token) throw new Error("Unauthorized");
        
        const id = req.nextUrl.searchParams.get("id");

        if (id) {

            if (!id.match(/^[0-9a-fA-F]{24}$/)) throw new Error("Invalid ID");

            const test = await Test.findById(id).populate({
                path: 'author'
            }).populate({
                path: 'question'
            });

            if (!test) throw new Error("Test not found");

            const filter = test.rating.filter(i=>i.user.toString() === token.id);

            let liked = 0;

            if( filter.length != 0 ) {
                liked = filter[0].kind === "LIKE" ? 1 : -1;
            }

            const response = await Response.findOne({
                status: "In process",
                executor: token.id,
                test: id
            });

            
            const responses = await Response.find({
                executor: token.id,
                test: id,
                status: "Completed"
            }).populate({
                path: 'test'
            }).populate({
                path: 'executor'
            }).populate({
                path: 'answers',
                populate: {
                    path: 'question'
                }
            }).sort({
                started: -1
            });

            

            return NextResponse.json({
                test,
                isOwner: test.author?test.author._id.toString() === token.id: false, 
                inProcess: !!response,
                responseId: response? response._id: null,
                liked,
                responses,
                statusText: "OK"
            },{
                status: 200
            });
            
        } else {

            const tests = await Test.find({
                type: "PUBLIC" 
            }).populate({
                path: 'author',
                model: User
            }).sort({
                created: -1
            });

            const top10Completed = await Test.find({
                type: "PUBLIC",
            }).populate({
                path: 'author',
                model: User
            }).sort({
                completedTimes: -1
            }).limit(10);

            const top10Rated = await Test.find({
                type: "PUBLIC",
            }).populate({
                path: 'author',
                model: User
            }).sort({
                totalRating: -1
            }).limit(10);


            return NextResponse.json({
                tests,
                top10Completed,
                top10Rated,
                statusText: "OK"
            },{
                status: 200
            });

        }
    } catch (err) {
        return NextResponse.json({
            statusText: err.message
        },{
            status: 400
        })
    }
}

export async function POST(request) {

    try {
        
        const formData = await request.formData();
        const file = JSON.parse(formData.get('test'));

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
    
        return NextResponse.json({ 
            newTest: result
         },{
            status: 201
        });

    } catch (err) {
        return NextResponse.json({
            statusText: err.message
        },{
            status: 400
        });
    }
}

export async function PUT(req) {

    try {
        
        const token = await verifyJwtToken(req.cookies.get('token')?.value);

        if(!token) throw new Error("Unauthorized");

        const id = req.nextUrl.searchParams.get("id");
        const _test = await Test.findById(id);

        if (_test.author.toString() !== token.id) throw new Error("Forbidden");

        const formData = await req.formData();
        const test = JSON.parse(formData.get('test'));

        const questions = await Promise.all(test.question.map( async (q)=>{

            if (q._id) {

                return q;

            } else {

                const { _id, ...obj } = q; 

                const photo = obj.photo.map((p)=>{
                    if(p.startsWith("https")) return p;
                    const _file = formData.get(p);
                    if (!_file) return "";
                    const filename = `${p}.${_file.name.split('.').pop()}` 
                    awsService.uploadFile(_file, filename);
                    return awsService.getFileLink(filename);
                });
            
                const answer = obj.answer.map(j=>{
                    if(j.photo.startsWith("https")) return j;
                    const _file = formData.get(j.photo);
                    if (!_file) return {...j, photo: ""};
                    const filename = `${j.photo}.${_file.name.split('.').pop()}`
                    awsService.uploadFile(_file, filename);
                    return {...j, photo: awsService.getFileLink(filename)}
                });

                const newQuestion = new Question({
                    ...obj,
                    photo,
                    answer
                });
                
                const result = await newQuestion.save();
            
                return {
                    ...obj,
                    photo,
                    answer,
                    _id: result._id.toString()
                }
            }
        }));

       if (test.mainImage) {
            if(!test.mainImage.startsWith("https")) {
                const _file = formData.get(test.mainImage);
                const filename = `${test.mainImage}.${_file.name.split('.').pop()}`;
                test.mainImage = awsService.getFileLink(filename);
                awsService.uploadFile(_file, filename);
            }
       }
        
                
        await Test.findByIdAndUpdate(id, {
            type: test.type,
            theme: test.theme,
            sourse: test.sourse,
            mainImage: test.mainImage,
            description: test.description,
            question: questions
        });

        return NextResponse.json({},{
            status: 200,
            statusText: "Updated"
        }); 

    } catch (err) {

        return NextResponse.json({
            statusText: err.message
        },{
            status: 400
        });
    }
}

export async function DELETE(req) {
    try {

        const id = req.nextUrl.searchParams.get("id");
        const token = await verifyJwtToken(req.cookies.get('token')?.value);

        if(!token) throw new Error("Unauthorized");
        
        const test = await Test.findById(id);

        if(test.author.toString() !== token.id) throw new Error("Forbidden");

        await Test.findByIdAndDelete( id );
        await Response.deleteMany({ test:id });

        return NextResponse.json({
            statusText: "Deleted"
        },{
            status: 200
        });    

    } catch (err) {
        return NextResponse.json({
            statusText: err.message
        },{
            status: 400
        });
    }
}