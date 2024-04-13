import ImageInput from "../image";
export default ({answer, setAnswer}) => {

    return (
        <div className="add-answer">
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
}