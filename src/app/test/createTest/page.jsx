"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { redirect } from "next/navigation";
import SingleImage from "../../../components/images/singleImage";
import Image from "next/image";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid';

export default function CreateTest() {

    const auth = useAuth();

    const [theme, setTheme] = useState("");
    const [sourses, setSourses] = useState([]);
    const [sourse, setSourse] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    const clearQuestion = {
        text: "",
        photo: [],
        answer: [],
        comment: "",
        sourse: ""
    }

    const [question, setQuestion] = useState(clearQuestion)
    const [questions, setQuestions] = useState([]);

    const [photo, setPhoto] = useState("");
    const [images, setImages] = useState([]);
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

        let formData = new FormData();

        const _questions = questions.map((i)=>{
            const photo = i.photo.map(j=>{
                const idPhoto = uuidv4();
                formData.append(`${idPhoto}`,j);
                return idPhoto;
            });
            const answer = i.answer.map(j=>{
                const idPhoto = uuidv4();
                formData.append(`${idPhoto}`,j.photo);
                return {...j, photo: idPhoto}
            });
            return {...i, photo, answer };
        });

        formData.append('test', JSON.stringify({
            author: auth.id,
            theme,
            sourses,
            description,
            questions: _questions
        }));
        
        await fetch('/api/test',{
            method: "POST",
            body: formData
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

    useEffect(()=>{
        setQuestion({...question,photo:[...images]});
    },[images]);
    
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
                        <input type="file" name="" id="" onChange={(e) => setImages([...images, e.target.files[0]])}/>
                        <div>
                            {
                                
                                question.photo.map((i,index)=><div key={index}>
                                    <Image
                                    style={{
                                        objectFit: "cover"
                                    }}
                                    src={URL.createObjectURL(i)}
                                    alt="Downloaded"
                                    width={100}
                                    height={100}
                                    />
                                    <input type="button" value="X" onClick={() =>{setImages([...question.photo.filter(el=>el!=i)])}}/>
                                </div>)
                            }
                        </div>
                    </div>
                    <div>
                        <label>Answers:</label>
                        <div>
                            <p>Text:</p>
                            <input type="text" name="" id="" onChange={(e)=>setAnswer({...answer,text:e.target.value})}/>
                        </div>
                        <div>
                            <p>Photo:</p>
                            <input type="file" name="" id="" onChange={(e) => setAnswer({...answer, photo:e.target.files[0]})}/>
                            {
                                answer.photo && <Image
                                    style={{
                                        objectFit: "cover"
                                    }}
                                    src={URL.createObjectURL(answer.photo)}
                                    alt="Downloaded"
                                    width={100}
                                    height={100}
                                />
                            }
                        </div>
                        <div>
                            <p>Correct:
                            <input type="checkbox" name="" id="" onChange={(e)=>setAnswer({...answer,correct:e.target.checked})}/>
                            </p>
                        </div>
                        <input type="button" value="Add Answer" onClick={(e)=>setQuestion({...question,answer:[...question.answer,answer]})}/>                        
                        <div>
                            {
                                question.answer.map((a, index) => <li key={index}>
                                    <h5>{a.text}</h5>
                                    <input type="checkbox" name="" id="" checked={a.correct} disabled={true}/>
                                    {
                                        a.photo && <Image
                                        style={{
                                            objectFit: "cover"
                                        }}
                                        src={URL.createObjectURL(a.photo)}
                                        alt="Downloaded"
                                        width={100}
                                        height={100}
                                    />
                                    }
                                    <input type="button" value="X" 
                                        onClick={() =>{
                                            setQuestion({...question,answer:[...question.answer.filter(el=>el!==a)]})
                                        }} 
                                    />
                                </li>)
                                /*
                                question.answer.map((s,index)=>
                                <p key={index}>
                                    <span>{s.correct.toString()} {s.text} {s.photo}</span>
                                    <input type="button" value="X" onClick={() =>{setQuestion({...question,answer:[...question.answer.filter(el=>el!==s)]})}} />
                                </p>)
                                */
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
                    <ul>
                    {
                        questions.map((s,index)=>
                            <li key={index}>
                                <h5>{s.text}</h5>
                                {
                                    s.photo.map((i,index2)=><Image
                                    key={index2}
                                    style={{
                                        objectFit: "cover"
                                    }}
                                    src={URL.createObjectURL(i)}
                                    alt="Downloaded"
                                    width={100}
                                    height={100}
                                    />)
                                }
                                <ul>
                                    {
                                        s.answer.map((a,index3)=><li key={index3}>
                                            <h5>{a.text}</h5>
                                            <input type="checkbox" name="" id="" checked={a.correct} disabled={true}/>
                                            {
                                                a.photo && <Image
                                                style={{
                                                objectFit: "cover"
                                                }}
                                                src={URL.createObjectURL(a.photo)}
                                                alt="Downloaded"
                                                width={100}
                                                height={100}
                                                />
                                            }
                                        </li>)
                                    }
                                </ul>
                                <p><i>{s.comment}</i></p>
                                <Link href={s.sourse}>{s.sourse}</Link>
                                <input type="button" value="X" onClick={() =>{setQuestions([...questions.filter(el=>el!=s)])}}/>
                            </li>)
                    }
                    </ul>
                </div>
            </div>
            {
                message
            }
            <input type="submit" value="Create"/>
        </form>
    );
}