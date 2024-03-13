"use client";
import Image from "next/image";
import { useState } from "react";

export const config = { unstable_runtimeJS: false, };

export default function Images() {

    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState("");
    const [message, setMessage] = useState("");

    const addImage = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            return; // User canceled file selection
        }
        setImage(e.target.files[0]);
        setImageURL(URL.createObjectURL(e.target.files[0]));
    }

    const sendImage = () => {

        let formData = new FormData();
        
        formData.append('image', image);

        fetch(`/api/images`,{
            method: "POST",
            body: formData
        }).then(res=>{
            if(res.ok) {
                return res.json();
            } else {
                setMessage(`${res.status} - ${res.statusText}`);
            }
        }).then(data=>{
            setImageURL(data.filename);
            //setImageURL("https://quizaida.s3.eu-north-1.amazonaws.com/93778187-1d2a-4e78-a5ac-134309f51ff3.png");
            //setImageURL("https://upload.wikimedia.org/wikipedia/commons/5/5d/ShakespeareCandidates1.jpg");
        });
    }

    return (
        <form action={sendImage}>
            <p>Images</p>
            <input type="file" name="" id="" onChange={addImage}/>
            <input type="submit" value="Send image" disabled={image==null}/>
            <p>{message}</p>
            {
                imageURL?<Image
                    src={imageURL}
                    alt="Downloaded"
                    width={300}
                    height={150}
                    //unoptimized={true} 
                    //loader={imageLoader}
                />:<></>
                //<BetterImage url={imageURL} altImage={AltImage}/> 
            }
        </form>
    )
}