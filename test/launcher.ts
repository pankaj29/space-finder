import { handler } from "../src/services/spaces/handler";


process.env.AWS_REGION = "us-east-1";
process.env.TABLE_NAME = 'SpaceTable-12d85173d603'

handler({
    httpMethod: 'GET',
    queryStringParameters: {
        id: '0dc00cb9-55b8-4bc7-98ae-c81389cf2256'
    }
    // body: JSON.stringify({
    //     location: 'Dublin'
    // })
} as any, {} as any);