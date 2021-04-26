const S3 = new (require('aws-sdk/clients/s3'))();
const Controller = require('../core/class/Controller');

class Bucket extends Controller {
  async index() {
    return this.render({ view: 'bucket' });
  }

  async create(data) {
    return S3.createBucket({
      Bucket: data.name,
      ACL: data.ACL,
      ObjectLockEnabledForBucket: data.Lock || false,
      CreateBucketConfiguration: { LocationConstraint: data.region },
    }).promise();
  }

  async delete(bucket) {
    await this.empty(bucket);
    return S3.deleteBucket({ Bucket: bucket }).promise();
  }

  async deleteAll() {
    return Promise.all((await this.list()).Buckets.map(async (bucket) => this.delete(bucket.Name)));
  }

  async list() {
    return S3.listBuckets().promise();
  }

  async deleteObject(bucket, object) {
    return S3.deleteObject({
      Bucket: bucket,
      Key: object,
    }).promise();
  }

  async deleteObjects(bucket, objects) {
    if (objects.length) {
      return S3.deleteObjects({
        Bucket: bucket,
        Delete: { Objects: objects },
      }).promise();
    }
    return true;
  }

  async listObject(bucket) {
    return S3.listObjects({ Bucket: bucket }).promise();
  }

  async empty(bucket) {
    const objects = (await this.listObject(bucket)).Contents;
    return objects.length
      ? this.deleteObjects(bucket, objects.map(({ Key }) => ({ Key })))
      : true;
  }

  async configs(func, params) {
    return await S3[func](params).promise();
  }
}

module.exports = new Bucket();
