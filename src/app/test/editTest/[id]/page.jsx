"use client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditTest({params}) {

    const [isLoading, setIsLoading] = useState(true);
    const clearQuestion = {
        _id: "",
        text: "",
        photo: [""],
        answer: [{
            correct: false,
            text: "",
            photo: ""
        }],
        comment: "",
        sourse: ""
    }
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
        question: [clearQuestion]
    });
    const [message, setMessage] = useState("");
    const [sourse, setSourse] = useState("");

    
    const [question, setQuestion] = useState(clearQuestion)
    const [questions, setQuestions] = useState([clearQuestion]);

    const [photo, setPhoto] = useState("");
    const [answer, setAnswer] = useState({
        correct: false,
        text: "",
        photo: ""
    });

    function objectsAreEqual(obj1, obj2) {
        // Перевіряємо, чи обидва аргументи є об'єктами
        if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
            return false;
        }
    
        // Перевіряємо кількість властивостей
        if (Object.keys(obj1).length !== Object.keys(obj2).length) {
            return false;
        }
    
        for (let key in obj1) {
            // Рекурсивно перевіряємо кожне поле
            if (!objectsAreEqual(obj1[key], obj2[key])) {
                return false;
            }
        }
    
        return true;
    }

    const addQuestion = () => {
        if (!objectsAreEqual(question, clearQuestion)) {
            setQuestions([...questions, question]);
            setQuestion(clearQuestion);
        }
    }

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
            setQuestions(data.test.question);
        })
    },[]);

    const updateTest = async () => {
        await fetch(`/api/test?id=${params.id}`,{
            method: "PUT",
            body: JSON.stringify({
                ...test,
                question:questions
            })
        }).then(res=>{
            if(res.ok) {
                redirect(`/test/${test._id}`);
            } else {
                setMessage(`${res.status} - ${res.statusText}`);
            }
        });
    }

    const addSourse = () => {
        if (sourse)
        {
            setTest({...test,sourse:[...test.sourse, sourse]});
            setSourse("");
        }
    }

    const removeSourse = (_sourse) => {
        setTest({...test,sourse:[...test.sourse.filter(el=>el!=_sourse)]});
    }

    if(isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <form action={updateTest}>
            <p>ID: {test._id}</p>
            <p>
                Theme:
                <input type="text" name="" id="" value={test.theme} onChange={(e)=>{setTest({...test,theme:e.target.value})}}/>
            </p>
            <p>
                Description:
                <textarea name="" id="" cols="30" value={test.description} rows="10" onChange={(e)=>{setTest({...test,description:e.target.value})}}></textarea>
            </p>
            <p>
                Author:
                {test.author.firstname} {test.author.lastname}
            </p>
            <div>
                <p>Sourses</p>
                <input type="text" name="" id="" value={sourse} onChange={(e)=>setSourse(e.target.value)}/>
                <input type="button" value="Add"  onClick={addSourse}/>
                {
                    test.sourse.map((s,index)=>
                        <p key={index}>
                            <span>{s}</span>
                            <input type="button" value="X" onClick={() =>removeSourse(s)}/>
                        </p>
                    )
                }
            </div>
            <div>
                <label>Questions</label>
                <div>
                    <label>Add Question</label>
                    <div>
                        <label>Text:</label>
                        <input type="text" name="" id="" onChange={(e)=>setQuestion({...question,text:e.target.value})}/>
                    </div>
                    <div>
                        <label>Photos:</label>
                        <input type="text" name="" id="" onChange={(e)=>setPhoto(e.target.value)}/>
                        <input type="button" value="Add Photo" onClick={(e)=>setQuestion({...question,photo:[...question.photo,photo]})}/>
                        <div>
                            {
                                question.photo.map((s,index)=>
                                <p key={index}>
                                    <span>{s}</span>
                                    <input type="button" value="X" onClick={() =>{setQuestion({...question,photo:[...question.photo.filter(el=>el!=s)]})}}/>
                                </p>)
                            }
                        </div>
                    </div>
                    <div>
                        <label>Answers:</label>
                        <div>
                            Text:
                            <input type="text" name="" id="" onChange={(e)=>setAnswer({...answer,text:e.target.value})}/>
                        </div>
                        <div>
                            Photo:
                            <input type="text" name="" id="" onChange={(e)=>setAnswer({...answer,photo:e.target.value})}/>
                        </div>
                        <div>
                            Correct:
                            <input type="checkbox" name="" id="" onChange={(e)=>setAnswer({...answer,correct:e.target.checked})}/>
                        </div>
                        <input type="button" value="Add Answer" onClick={(e)=>setQuestion({...question,answer:[...question.answer,answer]})}/>                        
                        <div>
                            {
                                question.answer.map((s,index)=>
                                <p key={index}>
                                    <span>{s.correct.toString()} {s.text} {s.photo}</span>
                                    <input type="button" value="X" onClick={() =>{setQuestion({...question,answer:[...question.answer.filter(el=>el!==s)]})}} />
                                </p>)
                            }
                        </div>
                    </div>
                    <div>
                        <label>Comment:</label>
                        <input type="text" name="" id="" onChange={(e)=>setQuestion({...question,comment:e.target.value})}/>
                    </div>
                    <div>
                        <label>Source:</label>
                        <input type="text" name="" id="" onChange={(e)=>setQuestion({...question,sourse:e.target.value})}/>
                    </div>
                    <input type="button" value="Add Question" onClick={addQuestion}/>
                </div>
                <ul>
                <p>Questions: </p>
                {
                    questions.map((q)=><li key={q._id}>
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
                        <input type="button" value="X" onClick={() =>{setQuestions([...questions.filter(el=>el!=q)])}}/>
                    </li>)
                }
            </ul>
            </div>
            <p>
                Created: {test.created}
            </p>
            {
                message
            }
            <input type="submit" value="Save Changes"/>
        </form>
    )
}