export interface S3DAO {
  putImage(
    fileName: string,
    imageStringBase64Encoded: string,
    fileExtension: string
  ): Promise<string>;
}
