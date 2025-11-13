/*
  Non ui in the component:
  - form validation (whether Register is allowed)
  - registration flow (calling FakeData / backend, handling success/failure)
  - preparing registration data (converting File -> data needed for request)
  - updating user info and triggering navigation
  

  MVP flow after my refactor
  - Register.tsx (UI only) 
      -> collects user input + handles DOM events
  - RegisterPresenter
      -> receives input values -> performs validation -> drives busy/error states
      -> calls the user service.
  - UserService.register
      → converts file into request data -> returns user + token back up
      → presenter sends results back to view
  - RegisterView interface in Register.tsx
      → updates context + navigates as directed by presenter
*/

import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { Buffer } from "buffer";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { UserInfoActionsHook } from "../../userInfo/UserInfoHooks";
import { useRef } from "react";
import { RegisterPresenter, RegisterView } from "../../../presenter/RegisterPresenter";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState<string>("");
  const [] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

  const navigate = useNavigate();
  const { updateUserInfo } = UserInfoActionsHook();
  const { displayErrorMessage } = useMessageActions();

    const view: RegisterView = {
    setBusy: (b) => setIsLoading(b),
    showError: (msg) => displayErrorMessage(msg),
    onRegistered: (user, token, remember) => {
      updateUserInfo(user, user, token, remember);
    },
    navigateAfterRegister: (user) => {
      navigate(`/feed/${user.alias}`);
    },
  };

  const presenterRef = useRef<RegisterPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new RegisterPresenter(view);
  }


  const checkSubmitButtonStatus = (): boolean => {
    return !presenterRef.current!.canSubmit(
      firstName,
      lastName,
      alias,
      password,
      imageFile
    );
  };


  const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doRegister();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleImageFile(file);
  };

  const handleImageFile = (file: File | undefined) => {
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    } else {
      setImageFile(undefined);
      setImageUrl("");
    }
  };

  const doRegister = async () => {
    await presenterRef.current!.doRegister(
      firstName,
      lastName,
      alias,
      password,
      rememberMe,
      imageFile
    );
  };

  const register = async (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> => {
    // Not needed now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  };

  const inputFieldFactory = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="firstNameInput"
            placeholder="First Name"
            onKeyDown={registerOnEnter}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <label htmlFor="firstNameInput">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="lastNameInput"
            placeholder="Last Name"
            onKeyDown={registerOnEnter}
            onChange={(event) => setLastName(event.target.value)}
          />
          <label htmlFor="lastNameInput">Last Name</label>
        </div>
        <AuthenticationFields
          alias={alias}
          password={password}
          onAliasChange={setAlias}
          onPasswordChange={setPassword}
          onPasswordKeyDown={registerOnEnter} 
        />
        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onKeyDown={registerOnEnter}
            onChange={handleFileChange}
          />
          {imageUrl.length > 0 && (
            <>
              <label htmlFor="imageFileInput">User Image</label>
              <img src={imageUrl} className="img-thumbnail" alt=""></img>
            </>
          )}
        </div>
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Already registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doRegister}
    />
  );
};

export default Register;
