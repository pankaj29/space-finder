import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postSpaces } from "./PostSpaces";
 import { getSpaces } from "./GetSpaces";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./DeleteSpace";
import { JsonError, MissingFieldError } from "../shared/Validator";
import { addCorsHeader } from "../shared/Utils";
import { get } from "node:http";


const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    let response: APIGatewayProxyResult;

    try {
        switch (event.httpMethod) {
             case 'GET':
                 response = await getSpaces(event, ddbClient);
                 break;
            case 'POST':
                response = await postSpaces(event, ddbClient);
                break;
            case 'PUT':
                response = await updateSpace(event, ddbClient);
                break;
            case 'DELETE':
                response = await deleteSpace(event, ddbClient);
                break;

            default:
                response = {
                    statusCode: 405,
                    body: JSON.stringify({ message: 'Method not allowed' })
                };
                break;
        }
    } catch (error) {
        console.error(error);
        if (error instanceof MissingFieldError) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: error.message })
            }
        }
        if (error instanceof JsonError) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: error.message })
            }
        }

        return {
            statusCode: 500,
            body: JSON.stringify({ message: error instanceof Error ? error.message : 'Unknown error' })
        }
    }
    addCorsHeader(response);
    return response;
}

export { handler }