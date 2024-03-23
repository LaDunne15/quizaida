import Image from "next/image";
import Link from "next/link";

export default function TestMini({data}) {

    return (
        <div>
            <p>{data.theme}</p>
            <p>{data.created}</p>
            <Link href={`/test/${data._id}`}>Details</Link>
            {
                data.mainImage && <Image
                style={{
                    objectFit: "cover"
                }}
                src={data.mainImage}
                alt="Downloaded"
                width={100}
                height={100}
                />
            }
        </div>
    )
}