const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uudi = require("uuid");
const tableName = process.env.TODO_TABLE;

AWS.config.update({
  region: "us-east-1",
});

const insert = (todo) => {
    console.log(" item_.todo", todo.todo)
    // console.log(" item_.checked", item_.checked)
  const timestamp = new Date().getTime();
  const params = {
    TableName: tableName,
    Item: {
      id: uudi.v1(),
      todo: todo.todo,
      checked: todo.checked,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  return new Promise((res, rej) => {
    dynamoDb.put(params, (err, data) => {
      if (err) {
        console.log("err inside ", err);
        rej();
      } else {
        console.log("Successfully inserted", todo);
        res(data.Item);
      }
    });
  });
};

exports.createTodo = async (event, context, callBack) => {
  console.log("event", event);
  const data = JSON.parse(event.body);
  console.log("data", data);
  console.log("typeof data.todo", typeof data.todo);
  if (typeof data.todo != "string") {
    console.log("invalid type of todo!!!!");
    return;
  }

  try {
    const response = await insert(data);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify(err),
    };
  }
};
