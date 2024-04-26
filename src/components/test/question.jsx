import Link from "next/link";
import Image from "next/image";

export default ({question, setQuestions, onClick}) => {

    return (
        <li className="question" onClick={onClick}>
            <div className="question-header">
                <div className="question-text">
                    <span>{question.text}</span>
                    <input type="button" value="X" className="close-btn" onClick={setQuestions}/>
                </div>
                <div className="question-image">
                {   
                    question.photo.map((i,index2)=><Image
                        key={index2}
                        src={  typeof i === "string" ? i : URL.createObjectURL(i)}
                        alt="Downloaded"
                        width={200}
                        height={200}
                    />)
                }
                </div>
            </div>
            <ul className="answers">
                {
                    question.answer.map((a,index3)=><li key={index3} className={`answer ${a.correct?"correct":""}`}>
                        <h5>{a.text}</h5>
                            {
                                a.photo && <Image
                                    style={{
                                        objectFit: "cover"
                                    }}
                                    src={  typeof a.photo === "string" ? a.photo : URL.createObjectURL(a.photo) }
                                    alt="Downloaded"
                                    width={200}
                                    height={200}
                                />
                            }
                    </li>)
                }
            </ul>
            <div className="comment-sourse">
                { question.comment && <p>Comment: <i>{question.comment}</i></p>}
                { question.sourse && <Link href={question.sourse}>[Source]</Link> }
            </div>
        </li>
    )
}