import Image from "next/image";
import { memo } from "react";

export default ({image, setImage}) => {
    
    if (!image) return (
        <div className="add-image">
            <input type="file" name="" id="" onChange={(e)=> {if (e.target.files.length) setImage(e.target.files[0])}}/>
        </div>
    )

    return (
        <div className="image">
            <Image
                style={{objectFit: "cover"}}
                src={ typeof image === "string" ? image : URL.createObjectURL(image) }
                alt="Main image"
                width={100}
                height={100}/>
            <input type="button" className="close-btn" value="X" onClick={()=>setImage(null)}/> 
        </div>
    );

};