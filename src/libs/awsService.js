import AWS from "aws-sdk";
import sharp from "sharp";
import { NextResponse } from "next/server";

class AWSService {

    async uploadFile(file, filename) {

        const buffer = Buffer.from(await file.arrayBuffer());

        const convertedBuffer = await sharp(buffer)
            .toFormat('png') // Перетворюємо на PNG
            .png({ compressionLevel: 9 }) // Стискаємо зображення
            .toBuffer();

        AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
            region: process.env.REGION
        });

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: filename,
            Body: buffer,
            ACL: 'public-read'
        };

        const s3 = new AWS.S3();

        s3.upload(params, (err, data) => {
            if (err) {
                return NextResponse.json({
                    statusText: err.message
                },{
                    status: 400
                });
            } else {
                return this.getFileLink(filename);
            }
        });

        return this.getFileLink(filename);
    }

    getFileLink(filename) {
        return `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${filename}`;
    }

}

const awsService = new AWSService();

export {awsService};