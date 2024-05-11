"use client";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { validationService } from "../../../libs/validationService.js";
//import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import noImage from "../../../static/icons/no-image.png";
import rateActive from "../../../static/icons/rate-active.png";
import rateInactive from "../../../static/icons/rate-inactive.png";
import { responseService } from "../../../libs/responseService.js";

export default ({params}) => {

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
    const [responses, setResponses] = useState([]);

    useEffect(()=>{

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/test?id=${params.id}`, { 
                    method: "GET" 
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.statusText);
                
                setIsLoading(false);
                setTest(data.test);
                setIsOwner(data.isOwner);
                setInProcess(data.inProcess);
                setResponseId(data.responseId);
                setLiked(data.liked);
                setResponses(data.responses);

            } catch (err) {
                setMessage(err.message);
            }
        }

        fetchData();

    },[]);

    const deleteTest = async () => {

        const isDelete = confirm(`Do you wanna delete test "${test.theme}"?`);
        
        if(!isDelete) return;

        try {
            const response = await fetch(`/api/test?id=${test.id}`, { 
                method: "DELETE" 
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.statusText);            
            router.push("/test");
        } catch (err) {
            setMessage(err.message);
        }
    }

     const startTest = async () => {
        try {
            const response = await fetch(`/api/response?idTest=${test._id}`, { 
                method: "POST" 
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.statusText);  
            
            router.push(`/response/${data.newResponse._id}`);

        } catch (err) {
            setMessage(err.message);
        }
     }

    const rate = async (type) => {
        try {
            const response = await fetch(`/api/test/rate?id=${test._id}`, {
                method: "PUT",
                body: JSON.stringify({
                    type
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.statusText);
            setLiked(data.liked);
            setTest({...test, totalrating: data.rating});
        } catch (err) {
            setMessage(err.message);
        }
    }

    if(isLoading) {
        return (
            <div>
                { message? `Error: ${message}`:"Loading..." }
            </div>
        )
    }

    return (
        <div className="test-preview">
            <Link href="/" className="link">Back to all tests</Link>
            <div className="test-header">
                <div className="image">
                    <Image
                        style={{
                            objectFit: "cover"
                        }}
                        src={test.mainImage?test.mainImage:noImage}
                        alt="Downloaded"
                        width={200}
                        height={200}
                    />
                </div>
                <div className="main-data">
                    <h1 className="title">{test.theme}</h1>
                    <div className="visibility-time">
                         <label>{ test.type }</label>
                         <label>{ test.question.length } questions</label>
                         <label>{ validationService.determineTimePassed(test.created) }</label>
                    </div>
                    <div className="rating">
                        <p className="total">{test.totalrating}</p>
                        <Image src={liked==1?rateActive:rateInactive} onClick={()=>rate("LIKE")}  alt="star" width={25} height={25}/>
                        <Image src={liked==-1?rateActive:rateInactive} onClick={()=>rate("DISLIKE")}  alt="star" width={25} height={25}/>
                    </div>
                    <p className="author">
                        {
                            test.author? `${test.author.firstname} ${test.author.lastname}`:`Deleted author`
                        }
                    </p>
                    {
                        test.description && <p className="description">{test.description}</p>
                    }
                </div>
            </div>
            {
                test.sourse.length>0 && <div className="sources">
                    <h2 className="sub-title">Sources</h2>
                    <ul>
                        {
                            test.sourse.map(s=><li key={s}><Link href={s} className="link" target="_blank" rel="noopener noreferrer">{s}</Link></li>)
                        }
                    </ul>
                </div>
            }
            {
                isOwner && <div className="manage-test">
                    <Link href={`/test/editTest/${test._id}`}>Edit</Link>
                    <input type="button" value="Delete" onClick={deleteTest}/>
                </div>
            }
            <div className="start-test">
                {
                    inProcess? <p>In process <Link href={`/response/${responseId}`}>Continue</Link></p>:
                    <input type="button" value="Start test" onClick={startTest}/>
                }
            </div>
            <h3 className="sub-title">Completed responses</h3>
            <ul className="completed-responses">
                {
                    responses.map(i=><li key={i._id}>
                        <span className="result">{ responseService.getTotalResult(i).total } %</span>
                        <div>
                            <div className="time">
                                <span> Time spend: { validationService.determineTimeBetween(i.started, i.completed) }</span>
                                <span> Started { validationService.determineTimePassed(i.started) }</span>
                                <span> Completed { validationService.determineTimePassed(i.completed) }</span>
                            </div>
                            <Link href={`/response/${i._id}`} className="link">Details</Link>
                        </div>
                    </li>)
                }
            </ul>
            {
                message
            }
        </div>
    )
}