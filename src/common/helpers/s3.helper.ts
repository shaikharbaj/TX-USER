import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class S3Helper {
  private AWS_ACCESS_KEY_ID: string;
  private AWS_SECRET_ACCESS_KEY: string;
  private AWS_DEFAULT_REGION: string;
  private AWS_BUCKET: string;
  constructor(private configService: ConfigService) {
    this.AWS_ACCESS_KEY_ID = this.configService.get('AWS_ACCESS_KEY_ID');
    this.AWS_SECRET_ACCESS_KEY = this.configService.get(
      'AWS_SECRET_ACCESS_KEY',
    );
    this.AWS_DEFAULT_REGION = this.configService.get('AWS_DEFAULT_REGION');
    this.AWS_BUCKET = this.configService.get('AWS_BUCKET');
  }

  /**
   * @description
   * Function to init S3 client
   */
  async initS3Client() {
    return new S3Client({
      region: this.AWS_DEFAULT_REGION,
      credentials: {
        accessKeyId: this.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
      }
    });
  }

  /**
   * @description
   * Function to upload base64 format file
   */
  async uploadBase64File(
    folderPath: string,
    fileName: string,
    mimeType: string,
    file: any,
  ) {
    return this.uploadToBucket(folderPath, fileName, mimeType, file);
  }

  /**
   * @description
   * Function to upload binary format file
   */
  async uploadBinaryFile(
    folderPath: string,
    fileName: string,
    mimeType: string,
    file: any,
  ) {
    return this.uploadToBucket(folderPath, fileName, mimeType, file);
  }

  /**
   * @description
   * Function to handel S3 bucket upload
   */
  async uploadToBucket(
    folderPath: string,
    fileName: string,
    mimeType: string,
    file: any,
  ) {
    try {
      const params = {
        Bucket: this.AWS_BUCKET,
        Key: `${folderPath}${String(fileName)}`,
        Body: Buffer.from(file)
      };
      const s3ClientObj = await this.initS3Client();
      const bucketResponse = await s3ClientObj.send(new PutObjectCommand(params));
      if (bucketResponse['$metadata'] && bucketResponse['$metadata']?.httpStatusCode === 200) {
        return {
          status: true,
          message: 'Image uploaded on S3 bucket successfully',
          bucketResponse: {
            fileName: fileName,
          },
        };
      } else {
        return {
          status: false,
          message: 'Image not uploaded on S3 bucket',
          bucketResponse: bucketResponse,
        };
      }
    } catch (error) {
      return {
        status: false,
        message: 'Error while uploading image on S3',
        bucketResponse: error,
      };
    }
  }

  /**
   * @description
   * Function to read file from s3 bucket
   */
  async readFromBucket(key: string) {
    try {
      const params = {
        Bucket: this.AWS_BUCKET,
        Key: key,
      };
      const s3ClientObj = await this.initS3Client();
      const getObjectCommand = new GetObjectCommand(params);
      const url = await getSignedUrl(s3ClientObj, getObjectCommand, { expiresIn: 3600 });
      console.log('Url ', url);
      //Smaple url format
      //https://autobazaarauction.s3.ap-south-1.amazonaws.com/buyers/local/17/pan_card/e881fb6c6899de16ebbfe872f9963d77.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAW6MMK7UXLQVBTVVN%2F20240115%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240115T122017Z&X-Amz-Expires=3600&X-Amz-Signature=5dc3eb14da88eaed06f302ad2a2b271a48afce0059ac34c028225e90930ecc36&X-Amz-SignedHeaders=host&x-id=GetObject
      ///return await s3ClientObj.send(new GetObjectCommand(params));
    } catch (error) {
      return {
        status: false,
        message: 'Error while reading file from S3',
        bucketResponse: error,
      };
    }
  }

  /**
   * @description
   * Function to delete particular file from s3 bucket
   */
  async deleteFromBucket(key: string) {
    try {
      const params = {
        Bucket: this.AWS_BUCKET,
        Key: key,
      };
      const s3ClientObj = await this.initS3Client();
      return s3ClientObj.send(new DeleteObjectCommand(params));
    } catch (error) {
      return {
        status: false,
        message: 'Error while reading file from S3',
        bucketResponse: error,
      };
    }
  }

  /**
   * Function to get list of objects from bucket 
   */
  async listImagesInBucket(prefix = '') {
    const params = {
      Bucket: this.AWS_BUCKET,
      Prefix: prefix, // Optional: to list objects within a specific folder
    };

    try {
      const s3ClientObj = await this.initS3Client();
      let allFiles = [];
      let continuationToken = null;

      do {
        const response = await s3ClientObj.send(new ListObjectsV2Command({
          ...params,
          ContinuationToken: continuationToken,
        }));

        allFiles = allFiles.concat(response.Contents || []);
        continuationToken = response.IsTruncated ? response.NextContinuationToken : null;
      } while (continuationToken);

      if (allFiles.length > 0) {
        const files = allFiles.map(file => ({
          key: file.Key,
          size: file.Size,
          lastModified: file.LastModified,
        }));

        return {
          status: true,
          message: 'Files retrieved successfully',
          files,
        };
      } else {
        return {
          status: false,
          message: 'No files found in the bucket',
          files: [],
        };
      }
    } catch (error) {
      console.error('Error fetching files from bucket:', error);
      return {
        status: false,
        message: 'Error fetching files from bucket',
        error,
      };
    }
  }

  /**
   * Function to delete all files from a folder
   */
  async deleteAllFilesInFolder(folderPath: string) {
    const params = {
      Bucket: this.AWS_BUCKET,
      Prefix: folderPath, // Specifies the folder path
    };

    try {
      const s3ClientObj = await this.initS3Client();
      let continuationToken = null;
      let filesToDelete = [];

      // List all files in the specified folder
      do {
        const response = await s3ClientObj.send(new ListObjectsV2Command({
          ...params,
          ContinuationToken: continuationToken,
        }));

        if (response.Contents?.length) {
          const objects = response.Contents.map(file => ({ Key: file.Key }));
          filesToDelete = filesToDelete.concat(objects);
        }

        continuationToken = response.IsTruncated ? response.NextContinuationToken : null;
      } while (continuationToken);

      // Delete all files if any were found
      if (filesToDelete.length > 0) {
        const deleteParams = {
          Bucket: this.AWS_BUCKET,
          Delete: {
            Objects: filesToDelete,
            Quiet: false, // Set to true if you want to suppress the output of deleted objects
          },
        };

        const deleteResponse = await s3ClientObj.send(new DeleteObjectsCommand(deleteParams));

        return {
          status: true,
          message: `${filesToDelete.length} files deleted successfully from the folder.`,
          deleteResponse,
        };
      } else {
        return {
          status: false,
          message: 'No files found in the specified folder.',
        };
      }
    } catch (error) {
      console.error('Error deleting files from folder:', error);
      return {
        status: false,
        message: 'Error deleting files from folder',
        error,
      };
    }
  }
}
