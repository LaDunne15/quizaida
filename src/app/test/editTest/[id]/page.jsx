"use client";
import { redirect, useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from "react";
import ImageInput from "../../../../components/image";
import Question from "../../../../components/test/question";
import InputQuestion from "../../../../components/test/input-question";
import { validationService } from "../../../../libs/validationService";

export default ({params}) => {

    const getId = () => uuidv4();
    const first_id = "92b59cd8-d2f4-49ec-8dbc-f2ee41bf74b8";

    const clearQuestion = {
        _id: null,
        text: "",
        photo: [],
        answer: [],
        comment: "",
        sourse: "",
        fake_id:first_id
    }
    const [focusQuestion, setFocusQuestion] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [test, setTest] = useState({
        _id: null,
        author: {
            id: "",
            firstname: "",
            lastname: ""
        },
        theme: "",
        mainImage: "" || null,
        type: "",
        description: "",
        sourse: [],
        created: "",
        question: [clearQuestion]
    });
    const [message, setMessage] = useState("");
    const [sourse, setSourse] = useState("");

    const [question, setQuestion] = useState(clearQuestion)
    const [questions, setQuestions] = useState([clearQuestion]);

    const router = useRouter();

    const addQuestion = () => {
        if (!validationService.objectsAreEqual(question, clearQuestion)) {
            setQuestions([...questions, question]);
            setQuestion(clearQuestion);
        }
    }

    useEffect(()=>{

        const fetchData = async () => {
            try { 
                const response = await fetch(`/api/test?id=${params.id}`,{ method: "GET" });
                const data = await response.json();
                if (!response.ok) throw new Error(data.statusText);
                setQuestions(data.test.question.map(q=>{
                    return {
                        ...q, 
                        fake_id: getId(),
                        answer: q.answer.map(a=>{
                            return {
                                ...a, 
                                fake_id: getId()
                            }
                        })
                    }
                }));
                
                setIsLoading(false);
                setTest(data.test);
            } catch (err) {
                setMessage(err.message);
            }
        }

        fetchData();
    },[]);

    const updateTest = async () => {

        try {
            let formData = new FormData();

            const _questions = questions.map((i)=>{
                const photo = i.photo.map(j=>{
                    if(typeof j === "string") return j;
                    const idPhoto = uuidv4();
                    formData.append(`${idPhoto}`,j);
                    return idPhoto;
                });
                const answer = i.answer.map(j=>{
                    if(typeof j.photo === "string") return j;
                    const idPhoto = uuidv4();
                    formData.append(`${idPhoto}`,j.photo);
                    return {...j, photo: idPhoto}
                });
                return {...i, photo, answer };
            });
    
            let newImageFilename = null;
    
            if (test.mainImage) {
                if (typeof test.mainImage === "string") {
                    newImageFilename = test.mainImage;
                } else {
                    const idPhoto = uuidv4();
                    formData.append(`${idPhoto}`,test.mainImage);
                    newImageFilename = idPhoto;
                }
            }
    
            formData.append('test', JSON.stringify({
                ...test,
                mainImage: newImageFilename,
                question: [..._questions]
            }));

            const response = await fetch(`/api/test?id=${params.id}`,{
                method: "PUT",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.statusText);

            router.push(`/test/${test._id}`);

        } catch (err) {
            setMessage(err.message);
        }

       
    }

    const addSourse = () => {
        if (sourse)
        {
            setTest({...test,sourse:[...test.sourse, sourse]});
            setSourse("");
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

    if(isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <form action={updateTest} className="edit-test-block">
            <h1 className="title">Editing Test</h1>
            <h2 className="sub-title">ID: {test._id}</h2>
            <div className="main-info">
                <ImageInput image={test.mainImage} setImage={(file) => setTest({...test,mainImage: file})}/>
                <div className="input-data">
                    <p>
                        <label htmlFor="theme">Theme:</label>
                        <input type="text" name="theme" id="" value={test.theme} onChange={(e)=> { setTest({...test,theme:e.target.value}) }}/>
                    </p>
                    <p>
                        <label htmlFor="date">Author:</label>
                        <span>{test.author.firstname} {test.author.lastname}</span>
                    </p>
                    <p>
                        <label htmlFor="date">Created:</label>
                        <span>{ validationService.determineTimePassed(test.created) }</span>
                    </p>
                    <p>
                        <label htmlFor="description">Description:</label>
                        <textarea name="" id="" cols="30" rows="10" value={test.description} onChange={(e)=>{ setTest({...test,description:e.target.value}) }}/>
                    </p>
                </div>
            </div>
            <ul className="type">
                <li className={test.type=="PUBLIC"?"checked":""}>
                    <input type="radio" name="type" value="PUBLIC" checked={test.type=="PUBLIC"} id="" onChange={()=>setTest({...test, type:"PUBLIC"})}/>
                    <span>Public</span>
                </li>
                <li className={test.type=="PRIVATE"?"checked":""}>
                    <input type="radio" name="type" value="PRIVATE" checked={test.type=="PRIVATE"} id="" onChange={()=>setTest({...test, type:"PRIVATE"})}/>
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
                    test.sourse.map((s,index)=>
                        <li key={index}>
                            <label>{s}</label>
                            <input type="button" value="X" className="close-btn" onClick={() =>setTest({...test, sourse:[...test.sourse.filter(el=>el!=s)]})}/>
                        </li>
                    )
                }
                {
                    test.sourse.length == 0 && <li>No sourses</li>
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
                                        setQuestion({...q, _id:null});
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
            {/*
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
                                    src={ typeof i === "string" ? i : URL.createObjectURL(i)}
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
                                        src={  typeof a.photo === "string" ? a.photo : URL.createObjectURL(a.photo)}
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
                */}
            <p>{ message }</p>
            <input type="submit" value="Save Changes"/>
            <pre>
                { JSON.stringify(question, null, 2) }
                { JSON.stringify(test, null, 2) }
            </pre>
        </form>
    )
}