"use client";

import Image from "next/image";
import { useEffect, useState } from "react"

export default function Response ({params}) {

    const [isLoading, setIsLoading] = useState(true);
    const [response, setResponse] = useState({
        status: "",
        test: {
            theme: "",
            description: "",
            sourse: "",
            question: [{
                id: "",
                text: "",
                photo: [],
                type: "",
                answer: [{
                    id: "",
                    correct: false,
                    text: "",
                    photo: ""
                }]
            }]
        },
        answers: [{
            question: {
                id: "",
                text: "",
                type: "",
                photo: [],
                answer: [{
                    id: "",
                    correct: false,
                    text: "",
                    photo: ""
                }],
                comment: "",
                sourse: ""
            },
            answers: [],
            orderNumber: 0,
            rating: 0
        }]
    });
    const [message, setMessage] = useState("");

    useEffect(()=>{
        fetch(`/api/response?id=${params.id}`,{
            method: "GET"
        }).then(res=>{
            if(res.ok) {
                return res.json();
            } else {
                setMessage(`${res.status} - ${res.statusText}`);
            }
        }).then(data=>{
            setResponse(data.response);
            setIsLoading(false);
        });
    },[]);

    const sendResult = async () => {

        fetch(`/api/response/complete?id=${params.id}`,{
            method: "POST"
        }).then(res=>{
            if(res.ok) {
                return res.json();
            } else {
                setMessage(`${res.status} - ${res.statusText}`);
            }
        }).then(data=>{
            setResponse(data.response);
        });

    }

    const answerTheQuestion = (q, a, orderNumber) => {

        var answers = response.answers;
        if (q.type=="radio") {
            answers = [...answers.filter(i=>i.question.id!=q.id), {question:q,answers:[a.id],orderNumber}];
        } else {
            var que = answers.filter(i=>i.question.id==q.id)[0];
            var ans = que.answers.filter(i=>i==a.id)[0];
            var ans2 = ans?que.answers.filter(i=>i!=a.id):[...que.answers,a.id];
            answers = [...answers.filter(i=>i.question.id!=q.id), {question:q,answers:[...ans2],orderNumber}];
        }
        setResponse({...response,answers}); 

        
        fetch(`/api/response?id=${params.id}`,{
            method: "PUT",
            body: JSON.stringify({
                question: q.id,
                answer: a.id,
                type: q.type
            })
        }).then(res=>{
            if(res.ok) {
                return res.json();
            } else {
                setMessage(`${res.status} - ${res.statusText}`);
            }
        }).then(data=>{
        });

    }

    const isChecked = (q, a) => {

        return a.includes(q.id);
    }

    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div>
            <h1>{response.test.theme}</h1>
            <h6>{response.status}</h6>
            {
                response.status==="Completed" && <div>
                    <div>
                        <p>{response.test.description}</p>
                    <h2>Total: {(response.answers.map(i=>i.rating).reduce((acc,val) => acc + val)/response.answers.length*100).toFixed(0)} %</h2>
                    <ol>
                    {
                        response.answers.sort((a,b)=>{return (a.orderNumber-b.orderNumber);}).map((i)=><li key={i.orderNumber}>
                            <p>{i.question.text} ({i.rating.toFixed(2)})</p>
                            {
                                i.question.photo.map(j=>
                                    <Image key={j}
                                        style={{
                                            objectFit: "cover"
                                        }}
                                        src={j}
                                        alt="Downloaded"
                                        width={100}
                                        height={100}
                                    />
                                )
                            }
                            <ul style={{listStyleType: "none"}}>
                            {
                                i.question.answer.map(j=><li key={j.id}>
                                    <input type={i.question.type} name={i.question.id} value={j.id} checked={isChecked(j,i.answers)} disabled/>
                                    {
                                        j.photo && <Image src={j.photo} alt="Downloaded" width={100} height={100} style={{objectFit: "cover"}}/>
                                    }
                                    <span>{j.text} { j.correct && 
                                        <b>Correct</b>
                                    }</span>
                                </li>)
                            }
                            </ul>
                            <p><i>{i.question.comment}</i></p>
                            <p>{i.question.sourse}</p>
                        </li>)
                    }
                    </ol>
                    </div>
                </div>
            }
            {
                !isLoading && response.status==="In process" && <form action={sendResult}>
                    <ol>
                    {
                        response.answers.sort((a,b)=>{return (a.orderNumber-b.orderNumber);}).map((i)=><li key={i.orderNumber}>
                            <p>{i.question.text}</p>
                            {
                                i.question.photo.map(j=>
                                    <Image key={j}
                                        style={{
                                            objectFit: "cover"
                                        }}
                                        src={j}
                                        alt="Downloaded"
                                        width={100}
                                        height={100}
                                    />
                                )
                            }
                            <ul style={{listStyleType: "none"}}>
                            {
                                i.question.answer.map(j=><li key={j.id}>
                                    <input type={i.question.type} name={i.question.id} value={j.id} onChange={()=>{answerTheQuestion(i.question,j, i.orderNumber)}} checked={isChecked(j,i.answers)}/>
                                    <span>{j.text}</span>
                                    {
                                        j.photo && <Image src={j.photo} alt="Downloaded" width={100} height={100} style={{objectFit: "cover"}}/>
                                    }
                                </li>)
                            }
                            </ul>
                        </li>)
                    }
                    </ol>
                    {
                        message
                    }
                    <input type="submit" value="Complete"/>
                </form>
            }
            <pre>
                {
                    //JSON.stringify(response, null, 2)
                }
            </pre>
        </div>
    )
}