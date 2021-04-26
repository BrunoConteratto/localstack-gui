const cli = require('./cli');

module.exports = {
  listBuckets: async () => await cli.exec('s3api list-buckets', true),
  createBucket: async ({ bucket }) => await cli.exec(`s3 mb s3://${bucket}`),
  deleteBucket: async ({ bucket }) => await cli.exec(`s3api delete-bucket --bucket ${bucket}`),
  deleteBucketAll: async () => await cli.exec(await Promise.all(
    (await this.listBuckets()).Buckets.map(async (a) => await this.deleteBucket(a.Name))
  )),
};

// module.exports = (() => { 
//   new S3()
// })();
// exports.cli = {};
// exports.cli.deleteBucketForce = async (Bucket) => {
//   cli.exec(`s3api delete-bucket --bucket ${Bucket}`);
// };
// exports.cli.deleteAllBuckets = async () => {
//   await Promise.all((
//     await this.listBuckets().promise()).Buckets.map(async (a) =>
//       await this.deleteBucketForce(a.Name)
//     )
//   );
// };
