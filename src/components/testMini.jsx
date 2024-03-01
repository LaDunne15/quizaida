import Link from "next/link";

export default function TestMini({data}) {
    return (
        <div>
            <p>{data.theme}</p>
            <p>{data.created}</p>
            <Link href={`/test/${data._id}`}>Details</Link>
        </div>
    )
}