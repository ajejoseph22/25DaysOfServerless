module.exports.spin = async () => {
  const driedelFaces = ["Nun", "Gimmel", "Hay", "Shin"];

  return {
    statusCode: 200,
    body: JSON.stringify({
      result: driedelFaces[Math.floor(Math.random() * 4)]
    })
  };
};
