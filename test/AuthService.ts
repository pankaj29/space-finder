import { Amplify } from 'aws-amplify'
import { SignInOutput, fetchAuthSession, signIn} from "@aws-amplify/auth";

const awsRegion = 'us-east-1'

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: 'us-east-1_UDDhP4aS6',
            userPoolClientId: '2b0u59d3khng0qsdqd6dme314d'
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
    public async getIdToken(){
        const authSession = await fetchAuthSession();
        return authSession.tokens?.idToken?.toString();

    }

}