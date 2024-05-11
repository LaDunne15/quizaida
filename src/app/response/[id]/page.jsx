"use client";

import Image from "next/image";
import { useEffect, useState } from "react"


import { responseService } from "../../../libs/responseService";
import { validationService } from "../../../libs/validationService";
import noImage from "../../../static/icons/no-image.png";
import rateActive from "../../../static/icons/rate-active.png";
import Link from "next/link";

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
    const [focusQuestion, setFocusQuestion] = useState(0);

    useEffect(()=>{

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/response?id=${params.id}`,{ method: "GET" });
                const data = await response.json();

                if (!response.ok) throw new Error(data.statusText);

                setIsLoading(false);
                const startOrderNumber = data.response.answers.filter(i=>i.answers.length==0)[0]?.orderNumber;
                if (startOrderNumber) {
                    setFocusQuestion(startOrderNumber);
                } else {
                    setFocusQuestion(0);
                }

                if (data.response.status=="Completed") {
                    setResponse(responseService.getTotalResult(data.response));
                } else {
                    setResponse(data.response);
                }

            } catch (err) {
                setMessage(err.message);
            }
        }

        fetchData();
    },[]);

    const sendResult = async () => {

        try {

            const response = await fetch(`/api/response/complete?id=${params.id}`, {
                method: "POST",
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.statusText);

            setResponse(data.response);

        } catch (err) {
            setMessage(err.message);
        }

    }

    const answerTheQuestion = async (q, a, orderNumber) => {
        try {
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

            const _response = await fetch(`/api/response?id=${params.id}`,{
                method: "PUT",
                body: JSON.stringify({
                    question: q.id,
                    answer: a.id,
                    type: q.type
                })
            });
            const data = await _response.json();

            if (!_response.ok) throw new Error(data.statusText);

            console.log("Data changed");

        } catch (err) {
            console.log(err);
            setMessage(err.message);
        }
    }

    const isChecked = (q, a) => {
        return a.includes(q.id);
    }

    if (isLoading) {
        return (
            <div>
                {  message?`Error ${message}`:"Loading..." }
            </div>
        )
    }

    return (
        <div className="response">
            <Link href="/response" className="link">Back to responses</Link>
            <div className="test-preview">
                <div className="test-header">
                    <div className="image">
                        <Image
                            style={{
                                objectFit: "cover"
                            }}
                            src={response.test.mainImage?response.test.mainImage:noImage}
                            alt="Downloaded"
                            width={200}
                            height={200}
                        />
                    </div>
                    <div className="main-data">
                        <h1 className="title">{ response.test.theme }</h1>
                        <div className="visibility-time">
                            <label>{ response.test.type }</label>
                            <label>{ response.test.question.length } questions</label>
                            <label>{ validationService.determineTimePassed(response.test.created) }</label>
                        </div>
                        <div className="rating">
                            <p className="total">{ response.test.totalrating}</p>
                            <Image src={rateActive} style={{
                                transform: response.test.totalrating<0?"scaleY(-1)":"scaleY(1)"
                            }} alt="Downloaded" width={20} height={20}/>
                        </div>
                        <p className="author">
                            {
                                response.test.author? `${response.test.author.firstname} ${response.test.author.lastname}`:`Deleted author`
                            }
                        </p>
                        {
                            response.test.description && <p className="description">{ response.test.description }</p>
                        }
                    </div>
                </div>
            </div>
            <h2 className="sub-title">{ response.status }</h2>
            {
                response.status==="Completed" && <div className="completed">
                    <div className="total-result">
                        <div className="total">
                            <span>{ response.total } %</span>
                            <span>total</span>
                        </div>
                        <div className="time-spend">
                            <h2>Started { validationService.determineTimePassed(response.started) }</h2>
                            <h2>Completed { validationService.determineTimePassed(response.completed) }</h2>
                            <h2>Time spend { validationService.determineTimeBetween(response.started, response.completed) }</h2>
                        </div>
                    </div>
                    <ul className="question-answers">
                        <h3 className="sub-title">Answers</h3>
                    {
                        response.answers
                            .sort( (a,b) => { return (a.orderNumber-b.orderNumber); } )
                            .map( (i) => <li key={i.orderNumber}>
                                <div className="question-block">
                                    <span> { i.rating.toFixed(2) } </span>
                                    <div className="question">
                                        <span> { i.question.text } </span>
                                        <ul>
                                            {
                                                i.question.photo.map(j=>
                                                    <Image key={j}
                                                        style={{
                                                            objectFit: "cover"
                                                        }}
                                                        src={j}
                                                        alt="Downloaded"
                                                        width={200}
                                                        height={200}
                                                    />
                                                )
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <ul>
                                {
                                    i.question.answer.map(j=><li key={j.id}
                                        className={`${
                                            isChecked(j,i.answers)?"selected":""
                                        }`}
                                    >
                                        <div className="answer-block">
                                            {
                                                j.photo && <Image src={j.photo} alt="Downloaded" width={150} height={150} style={{objectFit: "cover"}}/>
                                            }
                                            <span>{j.text}</span>
                                        </div>
                                        { j.correct && <span className="correct">Correct</span> }
                                    </li>)
                                }
                                </ul>
                                {
                                    i.question.comment && <>
                                        <span className="comment-title">Comment:</span>
                                        <span className="comment">{i.question.comment}</span>
                                    </>
                                }
                                {
                                    i.question.sourse && 
                                    <Link href={i.question.sourse} target="_blank" rel="noopener noreferrer">{i.question.sourse}</Link>
                                }
                            </li>)
                    }
                    </ul>
                    
                </div>
            }
            {
                response.status==="In process" && <form action={sendResult} className="in-process">
                    <ul className="questionsPoints">{
                        response.answers.sort((a,b)=>{return (a.orderNumber-b.orderNumber);}).map((i)=><li 
                                key={i.orderNumber}
                                onClick={()=>{
                                    setFocusQuestion(i.orderNumber);
                                }}
                                className={ `
                                    ${ i.answers.length>0? "answered":"" }
                                    ${ focusQuestion==i.orderNumber? "focus": "" }
                                `}
                            >
                                <span>{ i.orderNumber + 1 }</span>
                            </li>)
                    }</ul>
                    {
                        response.answers.filter(i=>i.orderNumber==focusQuestion).map(i=>
                            <div key={i.orderNumber} className="current-question">
                                <div className="question">
                                    <p>{i.question.text}</p>
                                    <div className="images">
                                    {
                                        i.question.photo.map(j=>
                                            <Image key={j}
                                                style={{
                                                    objectFit: "cover"
                                                }}
                                            src={j}
                                            alt="Downloaded"
                                            width={300}
                                            height={300}
                                        />)
                                    }
                                    </div>
                                </div>
                                <span>Choose { i.question.type=="checkbox" && "ALL" } correct answer:</span>
                                <ul style={{listStyleType: "none"}} className="answers">
                                {
                                    i.question.answer.map(j=><li key={j.id}
                                        onClick={()=>{
                                            answerTheQuestion(i.question,j, i.orderNumber);
                                        }}
                                        className={`${isChecked(j,i.answers)?"checked": ""}`}
                                    >
                                        {
                                            j.photo && <Image src={j.photo} 
                                                alt="Downloaded" 
                                                width={200} 
                                                height={200} 
                                                style={{objectFit: "cover"}}/>
                                        }
                                        <span>{j.text}</span>
                                    </li>)
                                }
                                </ul>
                                <input type="button" value=">"
                                    onClick={
                                        ()=>{
                                            const next = response.answers
                                            .filter(i=>i.answers.length==0)
                                            .filter(i=>i.orderNumber>focusQuestion)[0]?.orderNumber;
                                            if (next) {
                                                setFocusQuestion(next);
                                            } else {
                                                const start = response.answers
                                                .filter(i=>i.answers.length==0)[0]?.orderNumber;
                                                setFocusQuestion(start);
                                            }
                                        }
                                    }
                                />
                            </div>
                        )
                    }
                    {
                        message
                    }
                    <input type="submit" value="Complete"/>
                </form>
            }
        </div>
    )
}