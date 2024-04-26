"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import ImageInput from "../../../components/image";
import { validationService } from "../../../libs/validationService.js";
import Question from "../../../components/test/question";
import InputQuestion from "../../../components/test/input-question";

export default () => {
    
    const getId = () => uuidv4();
    const first_id = "92b59cd8-d2f4-49ec-8dbc-f2ee41bf74b8";

    const auth = useAuth();

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
        sourse: "",
        fake_id:first_id
    }

    const [focusQuestion, setFocusQuestion] = useState(null);
    
    const [question, setQuestion] = useState(null);
    const [questions, setQuestions] = useState([]);

    const router = useRouter();

    const createTest = async () => {

        try {

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

            const response = await fetch('/api/test', {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.statusText);

            router.push(`/test/${data.newTest._id}`);


        } catch (err) {
            setMessage(err.message);
        }
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
        if (!question) return;
        if (questions.find(i=>i.fake_id==focusQuestion)) {
            setQuestions(questions.map(i=>i.fake_id==focusQuestion?question:i));
        } else {
            setQuestions([...questions,question]);
        }
        setFocusQuestion(question.fake_id);

    }, [question]);
    
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
                        questions.map((q,index)=>{
                            if(q.fake_id == focusQuestion) {
                                return <InputQuestion key={index} question={question} setQuestion={setQuestion} addQuestion={addQuestion}/>
                            } else {
                                return <Question key={index} question={q} 
                                    setQuestions={()=>{
                                        setQuestions([...questions.filter(el=>el!=q)]);
                                    }}
                                    onClick={()=>{
                                        setFocusQuestion(q.fake_id);
                                        setQuestion(q);
                                    }}
                                />
                            }
                        })
                    }
                </ul>
                <input type="button" value="Add Question" onClick={()=>{
                    const id = getId();
                    setFocusQuestion(id);
                    setQuestion({...clearQuestion, fake_id:id});
                }}/>
            </div>
            <p> {message} </p>
            <input type="submit" value="Complete Question"/>
        </form>
    );
}