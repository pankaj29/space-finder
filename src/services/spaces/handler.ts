import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";


const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    let message = '';

    try {
        switch (event.httpMethod) {
            case 'GET':
                return getSpaces(event, ddbClient);
            case 'POST':
                return postSpaces(event, ddbClient);
            default:
                return {
                    statusCode: 405,
                    body: JSON.stringify('Method Not Allowed')
                };
        }
    } catch (error: unknown) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify(
                error instanceof Error ? error.message : 'Internal server error'
            )
        }
    }




    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify(message)
    }

    return response;
}

export { handler }