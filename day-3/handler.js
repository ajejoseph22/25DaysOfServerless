module.exports.storeImages = async event => {
  const { saveImageInDB } = require("./dynamodb-actions/index");
  console.log("EVENT", event);
  const addedItems = event.body.added;
  const extension = ".png";

  return addedItems.map(item => {
    if (item.toLowerCase().endsWith(extension)) {
      saveImageInDB(item)
        .then(res => res)
        .catch(err => err);
    }
  });
};
