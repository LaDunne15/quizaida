"use client";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
//import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditTest({params}) {

    
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [test, setTest] = useState({
        _id:"",
        author: {
            id: "",
            firstname: "",
            lastname: ""
        },
        theme: "",
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
        }]
    });
    const [message, setMessage] = useState("");
    const [isOwner, setIsOwner] = useState(false);

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
            <p>Theme: {test.theme}</p>
            <p>Description: {test.description}</p>
            <p>
                Author:
                {test.author.firstname} {test.author.lastname}
            </p>
            <div>
                <p>Sourses</p>
                {
                    test.sourse.map((s,index)=>
                        <a key={s} href={s} target="_blank" rel="noopener noreferrer">[{`Link ${index+1}`}]</a>
                    )
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
        </div>
    )
}