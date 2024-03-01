"use client";

import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { redirect } from "next/navigation";

export default function CreateTest() {

    const auth = useAuth();

    const [theme, setTheme] = useState("");
    const [sourses, setSourses] = useState([]);
    const [sourse, setSourse] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    const createTest = async () => {
        await fetch('/api/test',{
            method: "POST",
            body: JSON.stringify({
                author: auth.id,
                theme,
                sourses,
                description
            })
        }).then(i=>{
            if(i.ok) {
                return i.json();
            } else {
                setMessage(`${i.status} - ${i.statusText}`);
            }
        }).then(res=>{
            redirect(`/test/${res.newTest._id}`);
        });
    }

    const addSourse = () => {
        if (sourse)
        {
            setSourses([...sourses, sourse]);
            setSourse("");
        }
    }

    const removeSourse = (_sourse) => {
        setSourses([...sourses.filter(el=>el!=_sourse)])
    }
    
    return (
        <form action={createTest}>
            <p>Creating Test</p>
            <label>Theme</label>
            <input type="text" onChange={(e)=>setTheme(e.target.value)}/>
            <div>
                <label>Description</label>
                <textarea name="" id="" cols="30" rows="10" onChange={(e)=>setDescription(e.target.value)}/>
            </div>
            <div>
                <label>Sourses</label>
                <div>
                    <p>Add Source</p>
                    <input type="text" name="" id="" value={sourse} onChange={(e)=>setSourse(e.target.value)}/>
                    <input type="button" value="Add"  onClick={addSourse}/>
                    <ul>
                    {
                        sourses.map((s,index)=>
                            <p key={index}>
                                <span>{s}</span>
                                <input type="button" value="X" onClick={() =>removeSourse(s)}/>
                            </p>
                        )
                    }
                    </ul>
                </div>
            </div>
            {
                message
            }
            <input type="submit" value="Create"/>
        </form>
    );
}