import { AuthService } from "./AuthService";


async function testAuth() {
    const service = new AuthService();
    const loginResult = await service.login(
        'pankajverma',
        'Pankaj@29'
    );
    const idToken = await service.getIdToken();
    console.log(idToken);
}

testAuth();