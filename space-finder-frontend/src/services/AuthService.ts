import { Amplify } from 'aws-amplify';
import {
  fetchAuthSession,
  signIn,
  signOut,
  getCurrentUser,
} from '@aws-amplify/auth';
import type { SignInOutput } from '@aws-amplify/auth';

import { AuthStack } from '../../../../space-finder/outputs.json';

// import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import type { AwsCredentialIdentity } from '@aws-sdk/types';

const awsRegion = 'us-east-1';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: AuthStack.SpaceUserPoolId,
      userPoolClientId: AuthStack.SpaceUserPoolClientId,
      identityPoolId: AuthStack.SpaceIdentityPoolId,
    },
  },
});

export class AuthService {
  private user: SignInOutput | undefined;
  private userName = '';
  public jwtToken: string | undefined;
  private temporaryCredentials: AwsCredentialIdentity | undefined;

  public isAuthorized() {
    if (this.user){
        return true;

    }
    return false;
}

  public async login(
    userName: string,
    password: string
  ): Promise<SignInOutput | undefined> {
    try {
      // If a user is already signed in, sign them out first
      try {
        await getCurrentUser();
        await signOut();

        this.user = undefined;
        this.userName = '';
        this.jwtToken = undefined;
        this.temporaryCredentials = undefined;
      } catch {
        // No existing signed-in user, continue
      }

      const signInOutput: SignInOutput = await signIn({
        username: userName,
        password,
        options: {
          authFlowType: 'USER_PASSWORD_AUTH',
        },
      });

      this.user = signInOutput;
      this.userName = userName;

      await this.generateIdToken();

      return this.user;
    } catch (error) {
      console.error('Login failed:', error);
      return undefined;
    }
  }

  public async logout(): Promise<void> {
    await signOut();

    this.user = undefined;
    this.userName = '';
    this.jwtToken = undefined;
    this.temporaryCredentials = undefined;
  }

  public async getTemporaryCredentials(): Promise<AwsCredentialIdentity> {
    if (this.temporaryCredentials) {
      return this.temporaryCredentials;
    }

    this.temporaryCredentials = await this.generateTempCredentials();
    return this.temporaryCredentials;
  }

  private async generateTempCredentials(): Promise<AwsCredentialIdentity> {
    if (!this.jwtToken) {
      await this.generateIdToken();
    }

    if (!this.jwtToken) {
      throw new Error('JWT token not available. Please login first.');
    }

    const cognitoIdentityProvider = `cognito-idp.${awsRegion}.amazonaws.com/${AuthStack.SpaceUserPoolId}`;

    const credentialsProvider = fromCognitoIdentityPool({
      clientConfig: {
        region: awsRegion,
      },
      identityPoolId: AuthStack.SpaceIdentityPoolId,
      logins: {
        [cognitoIdentityProvider]: this.jwtToken,
      },
    });

    const credentials = await credentialsProvider();

    return {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
      expiration: credentials.expiration,
    };
  }

  private async generateIdToken(): Promise<void> {
    const session = await fetchAuthSession();
    this.jwtToken = session.tokens?.idToken?.toString();
  }

  public getIdToken(): string | undefined {
    return this.jwtToken;
  }

  public getUserName(): string {
    return this.userName;
  }

  public isAuthenticated(): boolean {
    return !!this.jwtToken;
  }
}

