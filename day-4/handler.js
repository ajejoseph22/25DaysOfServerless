const AWS = require("aws-sdk");
const uuid = require("uuid");

const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
const baseParams = {
  TableName: "dishes"
};

const respond = (result, statusCode) => ({
  statusCode,
  body: JSON.stringify(result)
});

module.exports.listDishes = async () => {
  try {
    const response = await dynamoDB.scan(baseParams).promise();

    return respond(response.Items, 200);
  } catch (err) {
    console.log("ERROR", err);

    return respond(err, 500);
  }
};

module.exports.addUpdateDish = async event => {
  const body = JSON.parse(event.body);
  const { id, dish } = body;
  const adding = !id;

  const addOrUpdate = async (dish, id) => {
    const params = {
      ...baseParams,
      Item: {
        id: adding ? uuid() : id,
        dish
      }
    };

    await dynamoDB.put(params).promise();
  };

  try {
    await addOrUpdate(dish, id);

    return respond(
      `Successfuly ${adding ? "Added!" : "Updated!"}`,
      adding ? 201 : 200
    );
  } catch (err) {
    console.log("ERROR", err);

    return respond(err, 500);
  }
};

module.exports.deleteDish = async event => {
  const body = JSON.parse(event.body);
  const { id } = body;

  const remove = async id => {
    const params = {
      ...baseParams,
      Key: {
        id
      }
    };

    await dynamoDB.delete(params).promise();
  };

  try {
    await remove(id);

    return respond("Successfully deleted!", 200);
  } catch (err) {
    console.log("ERROR", err);

    return respond(err, 500);
  }
};
