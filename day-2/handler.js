module.exports.alert = async event => {
  const { ACCOUNT_SID, AUTH_TOKEN, FROM_PHONE, TO_PHONE } = process.env;
  const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

  const minuteToTaskMap = {
    0: "Start the coffee, set out 4 cups",
    25: "Pour two cups",
    30: "Light the candles",
    35: "Deliver the coffee to Mom and Dad",
    39: "Return to kitchen, fill two more cups",
    40: "Relight the candles",
    45: "Deliver the coffee to Sister and Brother",
    49: "Return to kitchen, take a break! :)",
  };

  const minute = new Date(event.time).getMinutes();

  const sendMessage = message =>
    client.messages
      .create({
        body: message,
        from: FROM_PHONE,
        to: TO_PHONE,
      })
      .then(result => console.log(result.sid));

  const message =
    minuteToTaskMap[minute] || "Hey hey, nothing to see here; keep moving :)";

  return sendMessage(message);
};
