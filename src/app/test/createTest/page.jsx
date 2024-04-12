"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid';
import ImageInput from "../../../components/image";
import { validationService } from "../../../libs/validationService.js";
import ImagesInput from "../../../components/images";
import Answer from "../../../components/answer";

export default function CreateTest() {

    const auth = useAuth();

    const first_id = "92b59cd8-d2f4-49ec-8dbc-f2ee41bf74b8";

    const [theme, setTheme] = useState("");
    const [sourses, setSourses] = useState([]);
    const [sourse, setSourse] = useState("");
    const [description, setDescription] = useState("");
    const [mainImage, setMainImage] = useState(null);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("PUBLIC");

    const clearQuestion = {
        text: "",
        photo: [],
        answer: [],
        comment: "",
        sourse: ""
    }
    const getId = () => uuidv4();


    const clearAnswer = {
        correct: false,
        text: "",
        photo: "",
        fake_id:first_id
    }

    const [question, setQuestion] = useState(clearQuestion);

    const [focusAnswer, setFocusAnswer] = useState(null);
    
    const [questions, setQuestions] = useState([]);

    const [answer, setAnswer] = useState(clearAnswer);

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
        
        let newImageFilename = "";

        if (mainImage != null) {
            const idPhoto = uuidv4();
            formData.append(`${idPhoto}`,mainImage);
            newImageFilename = idPhoto;
        }

        formData.append('test', JSON.stringify({
            author: auth.id,
            mainImage: newImageFilename,
            theme,
            sourses,
            description,
            type,
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
        if (!validationService.objectsAreEqual(question, clearQuestion)) {
            setQuestions([...questions, question]);
            setQuestion(clearQuestion);
        }
    }

    useEffect(()=>{
        if (answer.text || answer.photo) {
            if (question.answer.find(i=>i.fake_id==focusAnswer)) {
                setQuestion({...question,answer:question.answer.map(i=>i.fake_id==focusAnswer?answer:i)});
            } else {
                setQuestion({...question,answer:[...question.answer,answer]});
            }
        } else {
            if (!question.answer.find(i=>i.fake_id==focusAnswer)) {
                setQuestion({...question,answer:[...question.answer,answer]});
            }
        }
        setFocusAnswer(answer.fake_id);

    }, [answer]);
    
    return (
        <form action={createTest} className="create-test-block">
            <h1 className="title">Creating Test</h1>
            <div className="main-info">
                <ImageInput image={mainImage} setImage={(file) => setMainImage(file)}/>
                <div className="input-data">
                    <p>
                        <label htmlFor="theme">Theme:</label>
                        <input type="text" name="theme" id="" onChange={(e)=>setTheme(e.target.value)}/>
                    </p>
                    <p>
                        <label htmlFor="description">Description:</label>
                        <textarea name="" id="" cols="30" rows="10" onChange={(e)=>setDescription(e.target.value)}/>
                    </p>
                </div>
            </div>
            <ul className="type">
                <li className={type=="PUBLIC"?"checked":""}>
                    <input type="radio" name="type" value="PUBLIC" id="" onChange={()=>setType("PUBLIC")} defaultChecked/>
                    <span>Public</span>
                </li>
                <li className={type=="PRIVATE"?"checked":""}>
                    <input type="radio" name="type" value="PRIVATE" id="" onChange={()=>setType("PRIVATE")}/>
                    <span>Private</span>
                </li>
            </ul>
            <div className="sources">
                <h2 className="sub-title">Sourses</h2>
                <div>
                    <input type="text" name="" id="" placeholder="Input link" value={sourse} onChange={(e)=>setSourse(e.target.value)}/>
                    <input type="button" value="Add"  onClick={addSourse} disabled={sourse==""}/>
                </div>
                <ul>
                {
                    sourses.map((s,index)=>
                        <li key={index}>
                            <label>{s}</label>
                            <input type="button" value="X" className="close-btn" onClick={() =>setSourses([...sourses.filter(el=>el!=s)])}/>
                        </li>
                    )
                }
                {
                    sourses.length == 0 && <li>No sourses</li>
                }
                </ul>
            </div>
            <div className="questions">
                <h2 className="sub-title">Questions</h2>
                <ul className="questions-list">
                    {
                        questions.map((s,index)=>
                            <li key={index} className="question">
                                <div className="question-header">
                                    <div className="question-text">
                                        <span>{s.text}</span>
                                        <input type="button" value="X" className="close-btn" onClick={() =>{setQuestions([...questions.filter(el=>el!=s)])}}/>
                                    </div>
                                    <div className="question-image">
                                        {   
                                            s.photo.map((i,index2)=><Image
                                                key={index2}
                                                src={URL.createObjectURL(i)}
                                                alt="Downloaded"
                                                width={100}
                                                height={100}
                                            />)
                                        }
                                    </div>
                                </div>
                                <ul className="answers">
                                    {
                                        s.answer.map((a,index3)=><li key={index3} className={`answer ${a.correct?"correct":""}`}>
                                            <h5>{a.text}</h5>
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
                                <div className="comment-sourse">
                                    { s.comment && <p>Comment: <i>{s.comment}</i></p>}
                                    { s.sourse && <Link href={s.sourse}>[Source]</Link> }
                                </div>
                            </li>)
                    }
                </ul>
                <div className="add-question">
                    <div className="question-block">
                        <label>Add Question</label>
                        <div className="input-data">
                            <p>
                                <label>Text:</label>
                                <textarea type="text" placeholder="Input text..." value={question.text || ""} name="" id="" onChange={(e)=>setQuestion({...question,text:e.target.value})}/>
                            </p>
                        </div>
                        <ImagesInput images={question.photo} setImages={(files) => setQuestion({...question,photo:[...files]})}/>
                        <div className="input-data">
                            <p>
                                <label>Comment:</label>
                                <input type="text" name="" id="" onChange={(e)=>setQuestion({...question,comment:e.target.value})}/>
                            </p>
                            <p>
                                <label>Source:</label>
                                <input type="text" name="" id="" onChange={(e)=>setQuestion({...question,sourse:e.target.value})}/>
                            </p>
                        </div>
                    </div>
                    <div className="answers-block">
                        <div className="answers">
                            <label className="sub-sub-title">Answers:</label>
                            <ul>
                            {
                                question.answer.map((a, index) => {
                                    if (a.fake_id == focusAnswer) {
                                        return (
                                            <div className="add-answer" key={index}>
                                                <div>
                                                    <ImageInput image={answer.photo} setImage={(file)=>{setAnswer({...answer,photo:file})}} />
                                                    <div className="input-data">
                                                        <p>
                                                            <label>Text:</label> 
                                                            <textarea type="text" name="" id="" value={answer.text||""} onChange={(e)=>setAnswer({...answer,text:e.target.value})}/>
                                                        </p>
                                                        <p>
                                                            <label>Correct:</label>
                                                            <input type="checkbox" name="" id="" checked={answer.correct||""} onChange={(e)=>setAnswer({...answer,correct:e.target.checked})}/>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return (<Answer key={index} answer={a} 
                                            deleteAnswer={()=>
                                                setQuestion({...question,answer:[...question.answer.filter(el=>el!==a)]})
                                            }
                                            onClick={() => {
                                                setFocusAnswer(a.fake_id);
                                                setAnswer(a);
                                            }}/>
                                        );
                                    }
                                })
                            }
                                <input type="button" value="+" onClick={() => {
                                    const id = getId();
                                    setFocusAnswer(id);
                                    setAnswer({correct:false,text:"",photo:"",fake_id:id});
                                }}/>
                            </ul>
                        </div>
                    </div>
                    <input type="button" value="Add Question" onClick={addQuestion}/>
                </div>
            </div>
            {
                message
            }
            <input type="submit" value="Complete Question"/>
        </form>
    );
}