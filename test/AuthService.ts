import { Amplify } from 'aws-amplify'
import { SignInOutput, fetchAuthSession, signIn} from "@aws-amplify/auth";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

const awsRegion = 'us-east-1'

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: 'us-east-1_GMWBlYaVZ',
            userPoolClientId: '3lomo59unvm2ljmorj53fhgqip'
        }
    }
})

export class AuthService {

    public async login(userName: string, password: string) {
        const signInOutput: SignInOutput = await signIn({
            username: userName,
            password: password,
            options: {
                authFlowType: 'USER_PASSWORD_AUTH'
            }
        });
        return signInOutput;
    }

    /**
     * call only after login
     */
    public async getIdToken(): Promise<string> {
        const authSession = await fetchAuthSession();
        const idToken = authSession.tokens?.idToken?.toString();
        if (!idToken) {
            throw new Error('ID token is not available');
        }
        return idToken;
    }

    public async generateTemporaryCredentials(){
        const idToken = await this.getIdToken();
        const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/us-east-1_GMWBlYaVZ`
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                identityPoolId: 'us-east-1:462150bf-5ac2-4129-ba16-9a29725d1b93',
                logins: {
                    [cognitoIdentityPool]: idToken
                }
            })
        });
        const credentials = await cognitoIdentity.config.credentials();
        return credentials
    }

}