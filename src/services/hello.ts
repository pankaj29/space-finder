import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { randomUUID } from 'crypto'



async function handler(event: APIGatewayProxyEvent, context: Context) {
    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify('Hello from lambda, this is the id:' + randomUUID())
    }
    console.log(event);

    return response;
}

export { handler }