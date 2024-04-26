import Image from "next/image";

export default ({images, setImages}) => {

    return (
        <ul className="images">
            {        
                images.map((i,index)=><li key={index} className="image">
                    <Image
                        style={{
                            objectFit: "cover"
                        }}
                        src={ typeof i === "string" ? i : URL.createObjectURL(i)}
                        alt="Downloaded"
                        width={100}
                        height={100}
                    />
                    <input type="button" className="close-btn" value="X" onClick={() =>{setImages([...images.filter(el=>el!=i)])}}/>
                </li>)
            }
            <li className="add-image">
                <input type="file" name="" id="" onChange={(e) => {
                    if (e.target.files.length) setImages([...images, e.target.files[0]])
                }}/>
            </li>
        </ul>
    );
}