import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postSpaces } from "./PostSpaces";
 import { getSpaces } from "./GetSpaces";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./DeleteSpace";
import { JsonError, MissingFieldError } from "../shared/Validator";


const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    let message: string;

    try {
        switch (event.httpMethod) {
             case 'GET':
                 const getResponse = await getSpaces(event, ddbClient);
                 console.log(getResponse)
                 return getResponse;
            case 'POST':
                const postResponse = await postSpaces(event, ddbClient);
                return postResponse;
            case 'PUT':
                const putResponse = await updateSpace(event, ddbClient);
                console.log(putResponse)
                return putResponse;
            case 'DELETE':
                const deleteResponse = await deleteSpace(event, ddbClient);
                console.log(deleteResponse)
                return deleteResponse;

            default:
                message = "Method not allowed";
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

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify(message)
    }

    return response;
}

export { handler }