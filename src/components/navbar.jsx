"use client";
import Link from "next/link";
import { useAuth } from "./../hooks/useAuth";
import { redirect, useRouter } from "next/navigation";
import Cookies from "universal-cookie";
import Image from "next/image";

import questionIcon from "../static/icons/question.png";
import QIcon from "../static/icons/Q.png";

export default function NavBar() {

    const auth = useAuth();
    const router = useRouter();

    const Logout = () => {
        
        const cookies = new Cookies();
        cookies.remove('token');

        router.push("/");
    }

    return (
        <nav>
            <span className="logo">
                <Link href="/">
                    <div>
                        <Image priority src={QIcon} width={30} height={30}/>
                    </div>
                    <span>uizaida</span>
                </Link>
            </span>
            {
                auth &&
                <ul>
                    <li>
                        <Link href="/test">
                            <div>
                                <Image priority src={questionIcon} width={30} height={30}/>
                            </div>
                            <span>Tests</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/response">
                            <div>
                                <Image priority src={questionIcon} width={30} height={30}/>
                            </div>
                            <span>Response</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/user">
                            <div>
                                <Image priority src={questionIcon} width={30} height={30}/>
                            </div>
                            <span>Account</span>
                        </Link>
                    </li>
                    <li>
                        <button onClick={Logout}>
                            <div>
                                <Image priority src={questionIcon} width={30} height={30}/>
                            </div>
                            <span>Log Out</span>
                        </button>
                    </li>
                </ul>
            }
        </nav>
    )
}