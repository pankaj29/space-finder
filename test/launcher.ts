import { MultipartBody } from "aws-cdk-lib/aws-ec2";
import { handler } from "../src/services/spaces/handler";


process.env.AWS_REGION = "us-east-1";
process.env.TABLE_NAME = 'SpaceTable-12d85173d603'

handler({
    httpMethod: 'POST',
    body: JSON.stringify({
        name: 'Delhi'
    }),
} as any, {} as any);


// handler({
//     httpMethod: 'DELETE',
//     queryStringParameters: {
//         id: '0dc00cb9-55b8-4bc7-98ae-c81389cf2256'
//     }
// } as any, {} as any);

// handler({
//     httpMethod: 'PUT',
//     queryStringParameters: {
//         id: '0dc00cb9-55b8-4bc7-98ae-c81389cf2256'
//     },
//     body: JSON.stringify({
//         location: 'DublinUpdated'
//     })
// } as any, {} as any);


//If you need to test the Delete api on the AWS Lambda online page , use this json syntax-
// {
//     "httpMethod": "DELETE",
//     "queryStringParameters": {
//         "id": "0dc00cb9-55b8-4bc7-98ae-c81389cf2256"
//     },
//     "body": null,
//     "headers": {},
//     "pathParameters": null,
//     "stageVariables": null,
//     "requestContext": {},
//     "resource": "/spaces",
//     "path": "/spaces",
//     "isBase64Encoded": false
// }