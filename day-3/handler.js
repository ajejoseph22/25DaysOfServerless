module.exports.storeImages = async event => {
  const { saveImageInDB } = require("./dynamodb-actions/index");
  const body = JSON.parse(event.body);
  const addedItems = body.head_commit.added;
  const extension = ".png";

  return addedItems.map(async item => {
    if (item.toLowerCase().endsWith(extension)) {
      console.log("FOUND...now executing");
      try {
        await saveImageInDB(item);
        return "success";
      } catch (err) {
        return "error";
      }
    }
  });
};
