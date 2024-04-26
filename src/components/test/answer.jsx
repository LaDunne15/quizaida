import Image from "next/image";

export default ({answer, deleteAnswer, onClick}) => {
    return (
        <li className="answer">
            <input type="checkbox" name="" id="" checked={answer.correct} disabled={true}/>
            <div className="answer-data" onClick={onClick}>
                {
                    answer.photo && <Image
                        style={{
                            objectFit: "cover"
                        }}
                        src={ typeof answer.photo === "string" ? answer.photo : URL.createObjectURL(answer.photo)}
                        alt="Downloaded"
                        width={100}
                        height={100}/>
                }
                <label>{answer.text}</label>
            </div>
            <input type="button" value="X" 
                className="close-btn"
                onClick={deleteAnswer} 
            />
        </li>
    )
}