import ImagesInput from "../images";
import Answer from "../test/answer";
import { v4 as uuidv4 } from 'uuid';
import InputAnswer from "../test/input-answer";
import { useEffect, useState } from "react";
export default ({question, setQuestion}) => {

    const getId = () => uuidv4();
    const first_id = "92b59cd8-d2f4-49ec-8dbc-f2ee41bf74b8";

    const clearAnswer = {
        correct: false,
        text: "",
        photo: "",
        fake_id:first_id
    }
    
    const [focusAnswer, setFocusAnswer] = useState(null);
    const [answer, setAnswer] = useState(clearAnswer);


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
                                    return <InputAnswer key={index} answer={a} setAnswer={setAnswer}/>
                                } else {
                                    return <Answer key={index} answer={a} 
                                        deleteAnswer={()=>
                                            setQuestion({...question,answer:[...question.answer.filter(el=>el!==a)]})
                                        }
                                        onClick={() => {
                                            setFocusAnswer(a.fake_id);
                                            setAnswer(a);
                                        }}
                                    />
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
        </div>
    )
}