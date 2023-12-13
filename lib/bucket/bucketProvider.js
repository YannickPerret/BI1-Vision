const AWS = require('aws-sdk');

class BucketProvider {
  constructor(bucketName, region, accessKeyId, secretAccessKey) {
    this.bucketName = bucketName;
    this.s3 = null;

    this.init();
  }

    async init() {
        try {
            this.s3 = new AWS.S3({
                region: this.region,
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey
            });

            await this.checkBucket();
        } catch (err) {
            if (err.code === 'NotFound') {
                await this.createBucket();
            } else {
                throw err;
            }
        }
    }

    async createBucket() {
        const params = {Bucket: this.bucketName, ACL: 'public-read'};
        try {
            await this.s3.createBucket(params).promise();
            console.log(`Bucket created successfully. ${this.bucketName}`);
        } catch (err) {
            console.error("Error creating bucket:", err);
            throw err;
        }
    }

    async checkBucket() {
        try {
            await this.s3.headBucket({Bucket: this.bucketName}).promise();
            console.log(`Bucket exists. ${this.bucketName}`);
        } catch (err) {
            console.error("Error checking bucket:", err);
            throw err;
        }
    }

  async uploadFile(fileContent, fileName) {
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: fileContent
    };

    try {
      const data = await this.s3.upload(params).promise();
      console.log(`File uploaded successfully. ${data.Location}`);
      return data;
    } catch (err) {
      console.error("Error uploading file:", err);
      throw err;
    }
  }

  async downloadFile(fileName) {
    const params = {
      Bucket: this.bucketName,
      Key: fileName
    };

    try {
      const data = await this.s3.getObject(params).promise();
      console.log("File downloaded successfully");
      return data.Body;
    } catch (err) {
      console.error("Error downloading file:", err);
      throw err;
    }
  }
}

module.exports = BucketProvider;