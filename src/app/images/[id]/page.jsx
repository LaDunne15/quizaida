"use client";
import Image from "next/image";
import { useState } from "react";
import BetterImage from "../../components/betterImage";
import AltImage from "../../../public/altImage.jpg";

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

    const loaderProp = ({ src }) => {
        return src;
    }

    const sendImage = () => {

        let formData = new FormData();
        
        formData.append('image', image);

        fetch(`/api/images`,{
            method: "POST",
            body: formData
        }).then(res=>{
            if(res.ok) {
                console.log(res.json());
                return res.json();
            } else {
                setMessage(`${res.status} - ${res.statusText}`);
            }
        }).then(data=>{
            setImageURL(data.filename);
            console.log(data.filename);
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
                    unoptimized={true} 
                />:<></>
                //<BetterImage url={imageURL} altImage={AltImage}/> 
            }
        </form>
    )
}