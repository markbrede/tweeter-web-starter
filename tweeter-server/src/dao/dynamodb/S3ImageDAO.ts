import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { S3DAO } from "../interfaces/S3DAO";

export class S3ImageDAO implements S3DAO {
  private readonly bucket = process.env.S3_BUCKET || "my-cs340-bucket-markbrede";
  private readonly region = process.env.AWS_REGION || "us-east-1";

  public async putImage(
    fileName: string,
    imageStringBase64Encoded: string,
    fileExtension: string
  ): Promise<string> {
    const decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64"
    );

    const normalizedExtension =
      fileExtension.toLowerCase() === "jpg" ? "jpeg" : fileExtension.toLowerCase();

    const s3Params = {
      Bucket: this.bucket,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/" + normalizedExtension,
      ACL: ObjectCannedACL.public_read,
    };

    const command = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: this.region });

    try {
      await client.send(command);
      return `https://${this.bucket}.s3.${this.region}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw new Error("internal-server-error: s3 put image failed with: " + error);
    }
  }
}
