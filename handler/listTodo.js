const AWS = require("aws-sdk");
const e = require("express");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TODO_TABLE 

AWS.config.update({
    region: 'us-east-1'
})


exports.getTodo = async (event,context)=>{
    let response;
    let dataRes;
    const params = {
        TableName: tableName
    }
    try {
        const data = await dynamoDb.scan(params).promise(); // Use get for single item, scan/query for multiple items
        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Items), // Assuming you want to return the item
        };
        return response;
    } catch (error) {
        const response = {
            statusCode: 500,
            body: JSON.stringify('Error fetching data from DynamoDB'),
        };
        return response;
    }
}

exports.getSingleTodo = async (event,context)=>{
    const params = {
        TableName: tableName,
        Key: {
            id: event.pathParameters.id,
        }
    }
    try {
        const data = await dynamoDb.get(params).promise();
        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item), // Assuming you want to return the item
        };
        return response;
    } catch (error) {
        const response = {
            statusCode: 500,
            body: JSON.stringify('Error fetching data from DynamoDB'),
        };
        return response;
    }
}

exports.deleteTodo = async (event,context)=>{
    const params = {
        TableName: tableName,
        Key: {
            id: event.pathParameters.id,
        }
    }
    try {
        const data = await dynamoDb.delete(params).promise();
        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item), // Assuming you want to return the item
        };
        return response;
    } catch (error) {
        const response = {
            statusCode: 500,
            body: JSON.stringify('Error deleting data from DynamoDB'),
        };
        return response;
    }
}

exports.updateTodo = async (event,context)=>{
    const datetime =  new Date().getTime();
    const data =  JSON.parse(event.body);
    console.log("data",data);
    if(typeof data.todo!='string' || typeof data.checked!='boolean'){
        const response = {
            statusCode: 500,
            body: JSON.stringify('typer error'),
        };
        return response;
    }
    const params = {
        TableName: tableName,
        Key: {
            id: event.pathParameters.id,
        },
        ExpressionAttributeNames: {
            "#todo_text":"todo",
        },
        ExpressionAttributeValues: {
            ":todo":data.todo,
            ":checked":data.checked,
            ":updatedAt":datetime
        },
        UpdateExpression:
        "SET #todo_text =:todo,checked=:checked,updatedAt=:updatedAt",
        ReturnValues: "ALL_NEW"
    }
    console.log("params",params)
    try {
        const data = await dynamoDb.update(params).promise();
        const response = {
            statusCode: 200,
            body: JSON.stringify(data), // Assuming you want to return the item
        };
        return response;
    } catch (error) {
        const response = {
            statusCode: 500,
            body: JSON.stringify('Error deleting data from DynamoDB',error),
        };
        return response;
    }
}