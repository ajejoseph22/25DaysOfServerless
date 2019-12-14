module.exports.storeImages = async event => {
  const { saveImageInDB } = require("./dynamodb-actions/index");
  const body = JSON.parse(event.body);
  const addedItems = body.head_commit.added;
  const extension = ".png";

  return addedItems.map(item => {
    if (item.toLowerCase().endsWith(extension)) {
      console.log("FOUND...now executing");
      saveImageInDB(item)
        .then(res => res)
        .catch(err => err);
    }
  });
};
