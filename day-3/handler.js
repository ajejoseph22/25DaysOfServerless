module.exports.storeImages = (event, context, callback) => {
  const uuid = require("uuid");
  const AWS = require("aws-sdk");

  const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

  const respond = (result, statusCode) => ({
    statusCode,
    body: JSON.stringify(result),
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    }
  });

  const saveImageInDB = item => {
    const params = {
      TableName: "images",
      Item: {
        id: uuid(),
        item
      }
    };

    dynamoDB.put(params, (err, data) => {
      if (err) {
        callback(err, respond(err, 404));
      }
      callback(null, respond(data, 201));
    });
  };

  console.log("EVENT", event);
  const body = JSON.parse(event.body);
  const addedItems = body.head_commit.added;
  const extension = ".png";

  addedItems &&
    addedItems.map(item => {
      if (item.toLowerCase().endsWith(extension)) {
        const link = `https://raw.githubusercontent.com/${body.repository.full_name}/master/${item}`;
        saveImageInDB(link);
      }
    });

  callback(null, respond("No PNG received", 201));
};
