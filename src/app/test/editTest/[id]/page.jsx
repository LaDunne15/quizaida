"use client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from "react";

export default function EditTest({params}) {

    const [isLoading, setIsLoading] = useState(true);

    const clearQuestion = {
        _id: "",
        text: "",
        photo: [],
        answer: [],
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
        mainImage: "",
        type: "",
        description: "",
        sourse: [],
        created: "",
        question: [clearQuestion]
    });
    const [message, setMessage] = useState("");
    const [sourse, setSourse] = useState("");

    
    const [images, setImages] = useState([]);

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
            //setImages(data.test);
            setQuestions(data.test.question);
        })
    },[]);

    const updateTest = async () => {

        let formData = new FormData();

        const _questions = questions.filter(q=>!q._id).map((i)=>{
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

        if(typeof test.mainImage!="string") {
            const idPhoto = uuidv4();
            formData.append(`${idPhoto}`,test.mainImage);
            newImageFilename = idPhoto;
        }

        formData.append('test', JSON.stringify({
            ...test,
            mainImage: typeof test.mainImage==="string"?test.mainImage:newImageFilename,
            question: [ ...test.question , ..._questions]
        }));

        
        await fetch(`/api/test?id=${params.id}`,{
            method: "PUT",
            body: formData
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

    useEffect(()=>{
        setQuestion({...question,photo:[...images]});
    },[images]);

    if(isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <form action={updateTest} className="edit-test-block">
            <p>ID: {test._id}</p>
            <p>
                Theme:
                <input type="text" name="" id="" value={test.theme} onChange={(e)=>{setTest({...test,theme:e.target.value})}}/>
            </p>
            <div>
                <label>Main image</label>
                <input type="file" name="" id="" onChange={(e)=> {if (e.target.files.length) setTest({...test,mainImage: e.target.files[0]})}}/>
                { 
                
                    test.mainImage && <Image
                    priority
                    style={{
                        objectFit: "cover"
                    }}
                    src={typeof test.mainImage==="string"?test.mainImage:URL.createObjectURL(test.mainImage)}
                    alt="Downloaded"
                    width={100}
                    height={100}
                    />
                }
                <button type="button" onClick={()=>setTest({...test, mainImage:""})}>Remove</button>
            </div>
            <p>
                Description:
                <textarea name="" id="" cols="30" value={test.description} rows="10" onChange={(e)=>{setTest({...test,description:e.target.value})}}></textarea>
            </p>
            <p>
                Author:
                {test.author.firstname} {test.author.lastname}
            </p>
            <div>
                <ul>
                    <li>
                        <input type="radio" name="type" id="" checked={test.type==="PUBLIC"} onChange={()=>setTest({...test,type:"PUBLIC"})}/>
                        <span>Public</span>
                    </li>
                    <li>
                        <input type="radio" name="type" id="" checked={test.type==="PRIVATE"} onChange={()=>setTest({...test,type:"PRIVATE"})}/>
                        <span>Private</span>
                    </li>
                </ul>
            </div>
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
                        <input type="file" name="" id="" onChange={(e) => {
                            if (e.target.files.length) setImages([...images,e.target.files[0]])
                        }}/>
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
                            <input type="file" name="" id="" onChange={(e) => {
                                if(e.target.files.length) setAnswer({...answer, photo:e.target.files[0]});
                            }
                            }/>
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
                            Correct:
                            <input type="checkbox" name="" id="" onChange={(e)=>setAnswer({...answer,correct:e.target.checked})}/>
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
                {
                        questions.map((s,index)=>
                            <li key={index}>
                                <h5>{s.text}</h5>
                                <h5>{s._id?s._id:"NEW"}</h5>
                                {
                                    s.photo.map((i,index2)=><Image
                                    key={index2}
                                    style={{
                                        objectFit: "cover"
                                    }}
                                    src={s._id?i:URL.createObjectURL(i)}
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
                                                src={s._id?a.photo:URL.createObjectURL(a.photo)}
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
            <p>
                Created: {test.created}
            </p>
            <pre>
                {
                    JSON.stringify(test, null, 2)
                }
            </pre>
            {
                message
            }
            <input type="submit" value="Save Changes"/>
        </form>
    )
}