"use client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditTest({params}) {

    const [isLoading, setIsLoading] = useState(true);
    const [test, setTest] = useState({
        _id:"",
        author: {
            id: "",
            firstname: "",
            lastname: ""
        },
        theme: "",
        description: "",
        sourse: [""],
        created: ""
    });
    const [message, setMessage] = useState("");
    const [sourse, setSourse] = useState("");

    useEffect(()=>{
        fetch(`/api/test?id=${params.id}`,{
            method: "GET"
        }).then(res=>{
            if(res.ok) {
                return res.json();
            } else {
                setMessage(`${res.status} - ${res.statusText}`);
            }
        }).then(data=>{
            setIsLoading(false);
            setTest(data.test);
        })
    },[]);

    const updateTest = async () => {
        await fetch(`/api/test?id=${params.id}`,{
            method: "PUT",
            body: JSON.stringify({
                test
            })
        }).then(res=>{
            if(res.ok) {
                redirect(`/test/${test._id}`);
            } else {
                setMessage(`${res.status} - ${res.statusText}`);
            }
        });
    }

    const addSourse = () => {
        if (sourse)
        {
            setTest({...test,sourse:[...test.sourse, sourse]});
            setSourse("");
        }
    }

    const removeSourse = (_sourse) => {
        setTest({...test,sourse:[...test.sourse.filter(el=>el!=_sourse)]});
    }

    if(isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <form action={updateTest}>
            <p>ID: {test._id}</p>
            <p>
                Theme:
                <input type="text" name="" id="" value={test.theme} onChange={(e)=>{setTest({...test,theme:e.target.value})}}/>
            </p>
            <p>
                Description:
                <textarea name="" id="" cols="30" value={test.description} rows="10" onChange={(e)=>{setTest({...test,description:e.target.value})}}></textarea>
            </p>
            <p>
                Author:
                {test.author.firstname} {test.author.lastname}
            </p>
            <div>
                <p>Sourses</p>
                <input type="text" name="" id="" value={sourse} onChange={(e)=>setSourse(e.target.value)}/>
                <input type="button" value="Add"  onClick={addSourse}/>
                {
                    test.sourse.map((s,index)=>
                        <p key={index}>
                            <span>{s}</span>
                            <input type="button" value="X" onClick={() =>removeSourse(s)}/>
                        </p>
                    )
                }
            </div>
            <p>
                Created: {test.created}
            </p>
            {
                message
            }
            <input type="submit" value="Save Changes"/>
        </form>
    )
}