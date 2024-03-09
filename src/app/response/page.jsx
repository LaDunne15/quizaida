"use client";

import Link from "next/link";
import { useEffect, useState } from "react"

export default function Response () {

    const [responses, setResponses] = useState([{
        _id: "",
        test: {
            theme: ""
        }
    }]);

    useEffect(()=>{
        fetch(`/api/response`,{
            method: "GET"
        }).then(res=>{
            if(res.ok) {
                return res.json();
            } else {
                //setMessage(`${res.status} - ${res.statusText}`);
            }
        }).then(data=>{
            setResponses(data.response);
        });
    },[]);


    return (
        <div>
            {   
                responses.map((i)=><div key={i._id}>
                    <Link href={`response/${i._id}`}>{i.test.theme}</Link>
                </div>)
            }
            
        </div>
    )
}