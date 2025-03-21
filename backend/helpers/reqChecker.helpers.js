const reqChecker = (req, expected) => {
  try {
    let message = [];
    expected.forEach((item) => {
      // if(!req.body.hasOwnProperty(item)){
      //     message.push(`${item} is required`)
      //     console.log("Expected");

      // }

      if (req.body[item] === "" || req.body[item] === null) {
        message.push(`${item} cannot be empty`);
        console.log(`Empty : ${req.body[item]}`);
      }
    });
    console.log("Message : " + message);

    return message;
  } catch (error) {
    return `Error processing request: ${error.message}`;
  }
};

module.exports = { reqChecker };
