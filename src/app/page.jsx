"use client";
import { useAuth } from "./../hooks/useAuth";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  const auth = useAuth();

  return (
    <main>
      {
        auth?
        <>
          Ви зайшли як:
          {
            auth.email
          }
        </>:
        <>
          <Link href="/auth/signup">Реєстрація</Link>
          <Link href="/auth/login">Log In</Link>
        </>
      }
    </main>
  );
}
