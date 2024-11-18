import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import OktaSignIn from '@okta/okta-signin-widget';
import appEnvConfig from '../../config/app-env-config';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignInWidget: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) 
  {
    this.oktaSignInWidget = new OktaSignIn({
      logo: 'assets/images/logo_login.png',
      apiUrl: appEnvConfig.oidc.issuer.split('/oauth2')[0],
      clientId: appEnvConfig.oidc.clientId,
      redirectUri: appEnvConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: appEnvConfig.oidc.issuer,
        scopes: appEnvConfig.oidc.scopes
      }
    });
   }

  ngOnInit(): void 
  {
    this.oktaSignInWidget.remove();

    this.oktaSignInWidget.renderEl({
      el: '#okta-sign-in-widget'}, // this one must have the same name as div tag id in the html component
      (response: any) => {
        if (response.status === 'SUCCESS')
        {
          this.oktaAuth.signInWithRedirect();
        }
      },
      (error: any) => {
        throw error;
      }
    );
  }
}
