"use client";
import Link from "next/link";
import { useEffect, useState } from "react"
import noImage from "../../static/icons/no-image.png";
import rateActive from "../../static/icons/rate-active.png";
import Image from "next/image";
import { validationService } from "../../libs/validationService";

export default function Response () {

    const [responses, setResponses] = useState([{
        _id: "",
        test: {
            theme: ""
        },
        status: "",
        started: "",
        completed: ""
    }]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(()=>{

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("/api/response", { method: "GET" });
                const data = await response.json();
                if (!response.ok) throw new Error(data.statusText);
                setResponses(data.response);
                setIsLoading(false);
            } catch (err) {
                setMessage(err.message);
            }
        }

        fetchData();
    },[]);

    if(isLoading) return <div>Loading...</div>;


    return (
        <div className="my-responses">
            <h1 className="title">My Responses</h1>
            <ul className="response-list">
                {
                    responses.map( i => <li key={i._id}>
                        <Image
                            style={{
                                objectFit: "cover"
                            }}
                            src={ i.test.mainImage?i.test.mainImage:noImage }
                            alt="Downloaded"
                            width={150}
                            height={150}
                        />
                        <div className="data">
                            <span className="theme">{i.test.theme}</span>
                            <ul>
                                <li>{i.test.question.length} questions</li>
                                <li>
                                    <span>{i.test.totalrating}</span>
                                    <Image src={rateActive} style={{
                                        transform: i.test.totalrating<0?"scaleY(-1)":"scaleY(1)"
                                    }} alt="Downloaded" width={20} height={20}/>
                                </li>
                            </ul>
                            <span className="date">Started {validationService.determineTimePassed(i.started)}</span>
                            {
                                i.completed && <span className="date"> Completed {validationService.determineTimePassed(i.completed)}</span>
                            }
                            <Link href={`response/${i._id}`}># Details</Link>
                        </div>    
                    </li>)
                }
            </ul>
            {
                message
            }
        </div>
    )
}