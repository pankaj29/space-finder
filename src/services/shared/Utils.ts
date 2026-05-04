import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { JsonError } from "./Validator";
import { randomUUID } from "crypto";

export function createRandomId(){
    return randomUUID();
}

export function addCorsHeader(arg: APIGatewayProxyResult){
    if (!arg.headers) {
        arg.headers = {};
    }
    arg.headers['Access-Control-Allow-Origin'] = '*';
    arg.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
}


export function parseJSON(arg: string){
    try {
        return JSON.parse(arg);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new JsonError(message);
    }
}

export function hasAdminGroup(event: APIGatewayProxyEvent){
    const groups = event.requestContext.authorizer?.claims['cognito:groups'];
    if (groups) {
        return (groups as string).includes('admins');
    }
    return false;
}