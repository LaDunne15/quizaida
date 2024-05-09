import ImagesInput from "../images";
import Answer from "../test/answer";
import { v4 as uuidv4 } from 'uuid';
import InputAnswer from "../test/input-answer";
import { useEffect, useState } from "react";
export default ({question, setQuestion}) => {

    const getId = () => uuidv4();

    const clearAnswer = () => {
        return {
            correct: false,
            text: "",
            photo: "",
            fake_id: getId()
        }
    }
    
    const [focusAnswer, setFocusAnswer] = useState(null);
    const [answer, setAnswer] = useState(null);

    useEffect(()=>{
        if (!answer) return;
        if(question.answer.find(i=>i.fake_id==focusAnswer)) {
            setQuestion({...question,answer:question.answer.map(i=>i.fake_id==focusAnswer?answer:i)});
            setFocusAnswer(answer.fake_id);
        } else {
            setQuestion({...question,answer:[...question.answer,answer]});
            setFocusAnswer(answer.fake_id);
        }   
    }, [answer]);

    return (
        <div className="add-question">
            <div className="question-block">
                <label>Add Question</label>
                <div className="input-data">
                    <p>
                        <label>Text:</label>
                        <textarea type="text" placeholder="Input text..." defaultValue={question.text} name="" id="" onChange={(e)=>setQuestion({...question,text:e.target.value})}/>
                    </p>
                </div>
                <ImagesInput images={question.photo} setImages={(files) => setQuestion({...question,photo:[...files]})}/>
                <div className="input-data">
                    <p>
                        <label>Comment:</label>
                        <input type="text" name="" id="" defaultValue={question.comment} onChange={(e)=>setQuestion({...question,comment:e.target.value})}/>
                    </p>
                    <p>
                        <label>Source:</label>
                        <input type="text" name="" id="" defaultValue={question.sourse} onChange={(e)=>setQuestion({...question,sourse:e.target.value})}/>
                    </p>
                </div>
            </div>
            <div className="answers-block">
                <div className="answers">
                    <label className="sub-sub-title">Answers:</label>
                    <ul>
                        {
                            question.answer.map((a, index) => 
                                <div key={index}>
                                    <ol className="warnings">
                                        {
                                            (!a.text && !a.photo) && <li>No photo or image</li>
                                        }
                                    </ol>
                                    {
                                        a.fake_id == focusAnswer && <InputAnswer answer={answer} setAnswer={setAnswer}/>
                                    }
                                    {
                                        a.fake_id != focusAnswer && <Answer answer={a}
                                        deleteAnswer={()=>
                                            setQuestion({...question,answer:[...question.answer.filter(el=>el!==a)]})
                                        }
                                        onClick={() => {
                                            setFocusAnswer(a.fake_id);
                                            setAnswer(a);
                                        }}
                                    />
                                    }
                                </div>
                            )
                        }
                        <input type="button" value="+" onClick={() => {
                            const newAnswer = clearAnswer();
                            setFocusAnswer(newAnswer.fake_id);
                            setAnswer(newAnswer);
                        }}/>
                    </ul>
                </div>
            </div>
        </div>
    )
}