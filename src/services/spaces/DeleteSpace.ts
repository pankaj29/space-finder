import { DeleteItemCommand, DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";



export async function deleteSpace(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {


    const spaceId = event.queryStringParameters?.id;
    if (typeof spaceId === 'string' && spaceId.length > 0) {
        await ddbClient.send(new DeleteItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                'id': { S: spaceId }
            }
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(`Deleted space with id ${spaceId}`)
        };
    }
    return {
        statusCode: 400,
        body: JSON.stringify('Please provide right args!!')
    }

}