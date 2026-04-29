import {handler} from '../src/services/spaces/handler';

handler({
    httpMethod: 'POST',
    body: JSON.stringify({ location: "Paris" })
} as any, {} as any);
