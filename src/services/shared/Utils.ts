import { JsonError } from "./Validator";
import { randomUUID } from "crypto";

export function createRandomId(){
    return randomUUID();
}

export function parseJSON(arg: string){
    try {
        return JSON.parse(arg);
    } catch (error) {
        if (error instanceof Error) {
            throw new JsonError(error.message);
        } else {
            throw new JsonError('Unknown error');
        }
    }
}