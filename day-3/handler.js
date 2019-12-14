module.exports.storeImages = async event => {
  const respond = (result, statusCode) => {
    return {
      statusCode,
      body: JSON.stringify(result),
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    };
  };

  const { saveImageInDB } = require("./dynamodb-actions/index");
  const body = JSON.parse(event.body);
  console.log("BODY", body);
  const addedItems = body.added;
  const extension = ".png";

  return addedItems.map(item => {
    if (item.toLowerCase().endsWith(extension)) {
      saveImageInDB(item)
        .then(res => respond(res, 200))
        .catch(err => respond(err, 404));
    }
  });
};
