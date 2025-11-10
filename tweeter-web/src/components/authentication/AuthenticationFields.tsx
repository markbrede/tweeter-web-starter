import React from "react";

type Props = {
  // controlled values
  alias: string;
  password: string;

  // change handlers
  onAliasChange: (value: string) => void;
  onPasswordChange: (value: string) => void;

  // key handling difference: handled on PASSWORD ONLY (Login vs Register)
  onPasswordKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  // small style/layout differences between Login and Register
  aliasWrapperClassName?: string;      // default: "form-floating"
  aliasInputClassName?: string;        // default: "form-control"
  passwordWrapperClassName?: string;   // default: "form-floating"
  passwordInputClassName?: string;     // default: "form-control"

  // ids/placeholders kept to original naming
  aliasInputId?: string;               // default: "aliasInput"
  passwordInputId?: string;            // default: "passwordInput"
  aliasPlaceholder?: string;           // default: "@alias"
  passwordPlaceholder?: string;        // default: "Password"
};

const AuthenticationFields: React.FC<Props> = ({
  alias,
  password,
  onAliasChange,
  onPasswordChange,
  onPasswordKeyDown,

  aliasWrapperClassName = "form-floating",
  aliasInputClassName = "form-control",
  passwordWrapperClassName = "form-floating",
  passwordInputClassName = "form-control",

  aliasInputId = "aliasInput",
  passwordInputId = "passwordInput",
  aliasPlaceholder = "@alias",
  passwordPlaceholder = "Password",
}) => {
  return (
    <>
      {/* Alias */}
      <div className={aliasWrapperClassName}>
        <input
          type="text"
          className={aliasInputClassName}
          size={50}
          id={aliasInputId}
          placeholder={aliasPlaceholder}
          value={alias}
          onChange={(e) => onAliasChange(e.target.value)}
          // NOTE: onKeyDown intentionally NOT set here (matches original)
        />
        <label htmlFor={aliasInputId}>Alias</label>
      </div>

      {/* Password */}
      <div className={passwordWrapperClassName}>
        <input
          type="password"
          className={passwordInputClassName}
          id={passwordInputId}
          placeholder={passwordPlaceholder}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          onKeyDown={onPasswordKeyDown}
        />
        <label htmlFor={passwordInputId}>Password</label>
      </div>
    </>
  );
};

export default AuthenticationFields;
