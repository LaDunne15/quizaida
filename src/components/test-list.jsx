import Image from "next/image"

import noImage from "../static/icons/no-image.png";
import rateActive from "../static/icons/rate-active.png";
import Link from "next/link";
import { validationService } from "../libs/validationService";

export default ({tests}) => {
    return (
        <ul className="test-list">
            {
                tests.map(i =>
                    <li key={i._id}>
                        <Image
                            style={{
                                objectFit: "cover"
                            }}
                            src={ i.mainImage?i.mainImage:noImage }
                            alt="Downloaded"
                            width={150}
                            height={150}
                        />
                        <div className="data">
                            <span className="theme">{i.theme}</span>
                            <ul>
                                <li>{i.question.length} questions</li>
                                <li>
                                    <span>{i.totalrating}</span>
                                    <Image src={rateActive} style={{
                                        transform: i.totalrating<0?"scaleY(-1)":"scaleY(1)"
                                    }} alt="Downloaded" width={20} height={20}/>
                                </li>
                            </ul>
                            <span className="date">Created {validationService.determineTimePassed(i.created)}</span>
                            <Link href={`/test/${i._id}`}># Details</Link>
                        </div>
                    </li>
                )
            }
        </ul>
    )
}