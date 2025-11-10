import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { UserInfoActionsHook } from "../../userInfo/UserInfoHooks";
import { useRef } from "react";
import { AuthPresenter, AuthView } from "../../../presenter/AuthPresenter";


interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = UserInfoActionsHook();
  const { displayErrorMessage } = useMessageActions();

  // View and presenter ref
  const view: AuthView = {
    setBusy: (b) => setIsLoading(b),
    showError: (msg) => displayErrorMessage(msg),
    onLoggedIn: (user, authToken, remember) => {
      updateUserInfo(user, user, authToken, remember);
    },
    navigateAfterLogin: (user) => {
      if (!!props.originalUrl) {
        navigate(props.originalUrl);
      } else {
        navigate(`/feed/${user.alias}`);
      }
    },
  };

  const presenterRef = useRef<AuthPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new AuthPresenter(view);
  }

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

const doLogin = async () => {
  await presenterRef.current!.login(alias, password, rememberMe, props.originalUrl);
};


  const inputFieldFactory = () => {
    return (
      <>
        <AuthenticationFields
          alias={alias}
          password={password}
          onAliasChange={setAlias}
          onPasswordChange={setPassword}
          onPasswordKeyDown={loginOnEnter} 
          // Login has slightly different classes than Register:
          // - password wrapper has "mb-3"
          // - password input has "bottom"
          passwordWrapperClassName="form-floating mb-3"
          passwordInputClassName="form-control bottom"
        />
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;