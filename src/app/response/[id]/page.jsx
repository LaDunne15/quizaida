"use client";

import { useEffect, useState } from "react"

export default function Response ({params}) {

    const [isLoading, setIsLoading] = useState(true);
    const [response, setResponse] = useState({
        status: "",
        test: {
            theme: "",
            question: [{
                id: "",
                text: "",
                type: "",
                answer: [{
                    id: "",
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
                answer: [{
                    id: "",
                    text: "",
                    photo: ""
                }]
            },
            answers: [],
            orderNumber: 0
        }]
    });

    useEffect(()=>{
        fetch(`/api/response?id=${params.id}`,{
            method: "GET"
        }).then(res=>{
            if(res.ok) {
                return res.json();
            } else {
                //setMessage(`${res.status} - ${res.statusText}`);
            }
        }).then(data=>{
            setResponse(data.response);
            setIsLoading(false);
        });
    },[]);

    const sendResult = () => {
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
                //setMessage(`${res.status} - ${res.statusText}`);
            }
        }).then(data=>{
            console.log(data);
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
            {
                response.status==="Completed" && <div>
                    <h1>{response.test.theme}</h1>
                    Completed
                </div>
            }
            {
                !isLoading && response.status==="In process" && <form action={sendResult}>
                    <h1>{response.test.theme}</h1>
                    <ol>
                    {
                        response.answers.sort((a,b)=>{return (a.orderNumber-b.orderNumber);}).map((i)=><li key={i.orderNumber}>
                            <p>{i.question.text}</p>
                            <ul style={{listStyleType: "none"}}>
                            {
                                i.question.answer.map(j=><li key={j.id}>
                                    <input type={i.question.type} name={i.question.id} value={j.id} onChange={()=>{answerTheQuestion(i.question,j, i.orderNumber)}} checked={isChecked(j,i.answers)}/>
                                    <span>{j.text}</span>
                                </li>)
                            }
                            </ul>
                        </li>)
                    }
                    </ol>
                    
                    <ol>
                    {
                        /*
                        response.test.question.map((i)=><li key={i._id}>
                            <p>{i.text}</p>
                            <ul style={{listStyleType: "none"}}>
                            {
                                i.answer.map(j=><li key={j.id}>
                                    <input type={i.type} name={i.id} value={j.id} onChange={()=>{answerTheQuestion(i,j)}}/>
                                    <span>{j.text}</span>
                                </li>)
                            }
                            </ul>
                        </li>)*/
                    }
                    </ol>
                    <input type="submit" value="Send Result"/>
                </form>
            }
        </div>
    )
}