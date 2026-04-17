import { S3DAO } from "../interfaces/S3DAO";

export class FakeS3DAO implements S3DAO {
  public async putImage(
    fileName: string,
    imageStringBase64Encoded: string,
    fileExtension: string
  ): Promise<string> {
    return "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
  }
}
