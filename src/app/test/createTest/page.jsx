"use client";

import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { redirect } from "next/navigation";

export default function CreateTest() {

    const auth = useAuth();

    const [theme, setTheme] = useState("");
    const [sourses, setSourses] = useState([]);
    const [sourse, setSourse] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    const clearQuestion = {
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

    const createTest = async () => {
        
        await fetch('/api/test',{
            method: "POST",
            body: JSON.stringify({
                author: auth.id,
                theme,
                sourses,
                description,
                questions
            })
        }).then(i=>{
            if(i.ok) {
                return i.json();
            } else {
                setMessage(`${i.status} - ${i.statusText}`);
            }
        }).then(res=>{
            redirect(`/test/${res.newTest._id}`);
        });
    }

    const addSourse = () => {
        if (sourse)
        {
            setSourses([...sourses, sourse]);
            setSourse("");
        }
    }

    const addQuestion = () => {
        if (!objectsAreEqual(question, clearQuestion)) {
            setQuestions([...questions, question]);
            setQuestion(clearQuestion);
        }
    }

    const removeSourse = (_sourse) => {
        setSourses([...sourses.filter(el=>el!=_sourse)])
    }
    
    return (
        <form action={createTest}>
            <p>Creating Test</p>
            <label>Theme</label>
            <input type="text" onChange={(e)=>setTheme(e.target.value)}/>
            <div>
                <label>Description</label>
                <textarea name="" id="" cols="30" rows="10" onChange={(e)=>setDescription(e.target.value)}/>
            </div>
            <div>
                <label>Sourses</label>
                <div>
                    <p>Add Source</p>
                    <input type="text" name="" id="" value={sourse} onChange={(e)=>setSourse(e.target.value)}/>
                    <input type="button" value="Add"  onClick={addSourse}/>
                    <ul>
                    {
                        sourses.map((s,index)=>
                            <p key={index}>
                                <span>{s}</span>
                                <input type="button" value="X" onClick={() =>removeSourse(s)}/>
                            </p>
                        )
                    }
                    </ul>
                </div>
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
                    {
                        questions.map((s,index)=>
                            <p key={index}>
                                <span>{s.text}</span>
                                <input type="button" value="X" onClick={() =>{setQuestions([...questions.filter(el=>el!=s)])}}/>
                            </p>)
                    }
                </div>
            </div>
            {
                message
            }
            <input type="submit" value="Create"/>
        </form>
    );
}