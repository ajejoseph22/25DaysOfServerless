module.exports.storeImages = async (event, context, callback) => {
  const uuid = require("uuid");
  const AWS = require("aws-sdk");

  const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

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
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  };

  const body = JSON.parse(event.body);
  const addedItems = body.head_commit.added;
  const extension = ".png";

  addedItems.map(item => {
    if (item.toLowerCase().endsWith(extension)) {
      console.log("FOUND...now executing");
      saveImageInDB(item);
    }

    callback(null, "No PNG received");
  });
};
