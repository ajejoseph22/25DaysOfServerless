const uuid = require("uuid");
const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

/** put a png image in the db table */
module.exports.saveImageInDB = item => {
  const params = {
    TableName: "images",
    Item: {
      id: uuid(),
      item
    }
  };

  return dynamoDB
    .put(params)
    .promise()
    .then(res => res)
    .catch(err => err);
};
