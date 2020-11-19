import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

const interpolatedConfig = "@@config@@";

// Checks for Auth0 environment and sets correct config object.
// We encode the string so we can make a check without the 2nd part of the check getting replaced in Auth0 as well.
const config =
  interpolatedConfig !== decodeURIComponent("%40%40config%40%40")
    ? JSON.parse(decodeURIComponent(escape(window.atob(interpolatedConfig))))
    : {};

const leeway = config?.internalOptions?.leeway;
if (leeway) {
  const convertedLeeway = parseInt(leeway);

  if (!isNaN(convertedLeeway)) {
    config.internalOptions.leeway = convertedLeeway;
  }
}

const params = Object.assign(
  {
    overrides: {
      __tenant: config.auth0Tenant,
      __token_issuer: config.authorizationServer.issuer,
    },
    domain: config.auth0Domain,
    clientID: config.clientID,
    redirectUri: config.callbackURL,
    responseType: "code",
  },
  config.internalOptions
);

// @ts-ignore
const webAuth = new auth0.WebAuth(params);
const databaseConnection = "Username-Password-Authentication";

const LoginPage = () => {
  const captchaContainerRef = useRef<any>(null);
  const captchaRef = useRef<any>(null);

  const [error, setError] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [email, setEmail] = useState<string>();

  useEffect(() => {
    captchaRef.current = webAuth.renderCaptcha(captchaContainerRef.current);
  }, []);

  function login(e: any) {
    e.preventDefault();
    webAuth.login(
      {
        realm: databaseConnection,
        username: email,
        password: password,
        captcha: captchaRef.current.getValue(),
      },
      function (err: any) {
        console.error(err);
        if (err) displayError(err);
      }
    );
  }

  function signup() {
    webAuth.redirect.signupAndLogin(
      {
        connection: databaseConnection,
        email,
        password,
        captcha: captchaRef.current.getValue(),
      },
      function (err: any) {
        if (err) displayError(err);
      }
    );
  }

  function loginWithGoogle() {
    webAuth.authorize(
      {
        connection: "google-oauth2",
      },
      function (err: any) {
        if (err) displayError(err);
      }
    );
  }

  function displayError(err: any) {
    if (captchaRef.current) {
      captchaRef.current!.reload();
    }
    setError(err.description);
  }

  return (
    <div className="login-container">
      <div className="col-xs-12 col-sm-4 col-sm-offset-4 login-box">
        <div className="login-header">
          <img src="https://cdn.auth0.com/styleguide/1.0.0/img/badge.svg" />
          <h3>Welcome</h3>
          <h5>PLEASE LOG IN</h5>
        </div>
        {error && (
          <div id="error-message" className="alert alert-danger">
            {error}
          </div>
        )}
        <form onSubmit={login}>
          <div className="form-group">
            <label htmlFor="name">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={email}
              onChange={(e) => setPassword(e.currentTarget.value)}
              placeholder="Enter your password"
            />
          </div>
          <div
            ref={captchaContainerRef}
            className="captcha-container form-group"
          ></div>
          <button
            type="submit"
            id="btn-login"
            className="btn btn-primary btn-block"
          >
            Log In
          </button>
          <button
            onClick={signup}
            type="button"
            id="btn-signup"
            className="btn btn-default btn-block"
          >
            Sign Up
          </button>
          <hr />
          <button
            onClick={loginWithGoogle}
            type="button"
            id="btn-google"
            className="btn btn-default btn-danger btn-block"
          >
            Log In with Google
          </button>
        </form>
      </div>
    </div>
  );
};

ReactDOM.render(<LoginPage />, document.getElementById("root"));
