"use client";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
//import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditTest({params}) {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [test, setTest] = useState({
        _id:"",
        type: "",
        author: {
            id: "",
            firstname: "",
            lastname: ""
        },
        theme: "",
        mainImage: "",
        description: "",
        sourse: [""],
        created: "",
        question: [{
            _id: "",
            text:"",
            photo:[""],
            comment: "",
            source: "",
            answer: [{
                text: "",
                photo: ""
            }]
        }],
        totalrating: 0
    });
    const [message, setMessage] = useState("");
    const [isOwner, setIsOwner] = useState(false);
    const [inProcess, setInProcess] = useState(false);
    const [responseId, setResponseId] = useState("");
    const [liked, setLiked] = useState(0);

    useEffect(()=>{
        fetch(`/api/test?id=${params.id}`,{
            method: "GET"
        }).then(res=>{
            if(res.ok) {
                return res.json();
            } else {
                setMessage(`${res.status} - ${res.statusText}`);
            }
        }).then(data=>{
            setIsLoading(false);
            setTest(data.test);
            setIsOwner(data.isOwner);
            setInProcess(data.inProcess);
            setResponseId(data.responseId);
            setLiked(data.liked);
        }).catch(err=>{
            console.log(err);
        })
    },[]);

    const deleteTest = async () => {
        const isDelete = confirm(`Do you wanna delete test "${test.theme}"?`);
        if(isDelete) {
            await fetch(`/api/test?id=${test._id}`, {
                method: "DELETE"
            }).then(res=>{
                if(res.ok) {
                    return res.json();
                } else {
                    setMessage(`${res.status} - ${res.statusText}`);
                }
            }).then(()=>{
                router.push("/test");
                //redirect("/test");
            });
        }
    }

     const startTest = async () => {
        await fetch(`/api/response?idTest=${test._id}`, {
            method: "POST"
        }).then(res=>{
            if(res.ok) {
                return res.json();
            } else {
                setMessage(`${res.status} - ${res.statusText}`);
            }
        }).then((res)=>{
            router.push(`/response/${res.newResponse._id}`);
        });
     }

    const rate = async (type) => {
        await fetch(`/api/test/rate?id=${test._id}`, {
            method: "PUT",
            body: JSON.stringify({
                type
            })
        }).then(res=>{
            if(res.ok) {
                return res.json();
            } else {
                setMessage(`${res.status} - ${res.statusText}`);
            }
        }).then(data=>{
            //console.log(data);
            setLiked(data.liked);
            setTest({...test, totalrating: data.rating});
        });
    }

    if(isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div>
            <p>ID: {test._id}</p>
            <p>Theme: {test.theme} ({test.type})</p>
            {
                test.mainImage && <Image
                style={{
                    objectFit: "cover"
                }}
                src={test.mainImage}
                alt="Downloaded"
                width={100}
                height={100}
                />
            }
            <p>Description: {test.description}</p>
            <p>
                Author:
                {
                    test.author? `${test.author.firstname} ${test.author.lastname}`:<p>DELETED</p>
                }
            </p>
            <div>
                <p>Sourses</p>
                {
                    test.sourse.map((s,index)=>
                        <a key={s} href={s} target="_blank" rel="noopener noreferrer">[{`Link ${index+1}`}]</a>
                    )
                }
            </div>
            <div>
                Likes: {test.totalrating}
                <button onClick={()=>rate("LIKE")}>Like</button>
                <button onClick={()=>rate("DISLIKE")}>Dislike</button>
                {
                    liked
                }
            </div>
            <p>
                Created: {test.created}
            </p>
            {
            /*
            <ul>
                <p>Questions: </p>
                {
                    test.question.map((q)=><li key={q._id}>
                        <p>{q.text}</p>
                        <ol>
                            {
                                q.answer.map((a,index2)=><li key={index2}>
                                    <p>{a.text}</p>
                                    <p>{a.photo}</p>
                                </li>)
                            }
                        </ol>
                        <a href={q.source}>{q.source}</a>
                        <i>{q.comment}</i>
                    </li>)
                }
            </ul>
            */
            }
            {
                message
            }
            {
                isOwner && <div>
                    <Link href={`/test/editTest/${test._id}`}>Edit</Link>
                    <button onClick={deleteTest}>Delete</button>
                </div>
            }
            <div>
            {
                inProcess? <>
                    <p>In process <Link href={`/response/${responseId}`}>Continue</Link></p>
                </>:
                <button onClick={startTest}>Start Test</button>
            }
            </div>
            <pre>
                {
                    JSON.stringify(test, null, 2)
                }
            </pre>
        </div>
    )
}