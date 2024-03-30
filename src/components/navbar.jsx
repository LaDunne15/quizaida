"use client";
import Link from "next/link";
import { useAuth } from "./../hooks/useAuth";
import { redirect, useRouter } from "next/navigation";
import Image from "next/image";

import questionIcon from "../static/icons/question.png";
import QIcon from "../static/icons/Q.png";

export default function NavBar() {

    const auth = useAuth();
    const router = useRouter();

    

    return (
        <nav>
            <span className="logo">
                <Link href="/">
                    <div>
                        <Image priority src={QIcon} width={30} height={30} alt="Quizaida"/>
                    </div>
                    <span>uizaida</span>
                </Link>
            </span>
            
                
                <ul>
                    <li>
                        <Link href="/test">
                            <div>
                                <Image priority src={questionIcon} width={25} height={25} alt="Tests"/>
                            </div>
                            <span>Tests</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/response">
                            <div>
                                <Image priority src={questionIcon} width={25} height={25} alt="Response"/>
                            </div>
                            <span>Response</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/user">
                            <div>
                                <Image priority src={questionIcon} width={25} height={25} alt="Account"/>
                            </div>
                            <span>Account</span>
                        </Link>
                    </li>
                </ul>
            
        </nav>
    )
}