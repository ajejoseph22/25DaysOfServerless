module.exports.storeImages = async event => {
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

  const saveImagesInDB = async () => {
    const params = {
      RequestItems: {
        images: []
      }
    };

    imageLinks.map(item => {
      params.RequestItems["images"].push({
        PutRequest: {
          Item: {
            id: uuid(),
            item
          }
        }
      });
    });

    await dynamoDB.batchWrite(params).promise();
  };

  const body = JSON.parse(event.body);
  const commits = body.commits;
  const extension = ".png";
  const urlPrefix = "https://raw.githubusercontent.com";
  const repo = `${body.repository.full_name}/master`;
  const imageLinks = [];

  //loop through all commits in the push
  commits.map(commit => {
    //if files were added in commit
    if (commit.added) {
      let addedItems = commit.added;
      addedItems.map(item => {
        if (item.toLowerCase().endsWith(extension)) {
          imageLinks.push(`${urlPrefix}/${repo}/${item}`);
        }
      });
    }
  });

  //if there are PNG images
  if (imageLinks.length) {
    try {
      await saveImagesInDB();
      return respond("Successfully saved PNGs", 201);
    } catch (err) {
      console.log("ERROR:", err);
      return respond(err, 500);
    }
  } else {
    // no PNG images
    return respond("No PNG found", 200);
  }
};
