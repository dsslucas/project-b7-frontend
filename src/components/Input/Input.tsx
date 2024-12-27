import React from "react";
import TextField from "@mui/material/TextField";
import { IMaskInput } from "react-imask";

interface InputInterface {
  id: string;
  name: string;
  type: string;

  // Optional
  placeholder?: string;
  autoFocus?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  variant?: "filled" | "outlined" | "standard";
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  size?: "small" | "medium";
  error?: boolean;
  helperText?: string;

  // MASK
  mask?: string; // For custom masks
  maskOptions?: object; // IMask configuration options

  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MaskedInput = React.forwardRef<HTMLInputElement, any>((props, ref) => {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      inputRef={ref} // Pass the ref to IMaskInput
      onAccept={(value: string) =>
        onChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)
      } // Map the onAccept event to onChange
    />
  );
});

const InputComponent: React.FC<InputInterface> = (props: InputInterface) => {
  const {
    id,
    name,
    type,
    placeholder,
    autoFocus,
    required,
    fullWidth,
    variant = "outlined",
    color = "primary",
    size = "small",
    error,
    helperText,
    mask,
    maskOptions,
    value,
    onChange,
  } = props;

  // Render a masked input if the mask prop is provided
  if (mask) {
    return (
      <TextField
        error={error}
        helperText={helperText}
        id={id}
        name={name}
        placeholder={placeholder}
        autoFocus={autoFocus}
        required={required}
        fullWidth={fullWidth}
        variant={variant}
        color={color || (error ? "error" : "primary")}
        size={size}
        InputProps={{
          inputComponent: MaskedInput as any,
          inputProps: {
            mask,
            lazy: true, // Lazy masking (optional)
            overwrite: true,
            ...(maskOptions || {}),
          },
        }}
        value={value}
        onChange={onChange}
      />
    );
  }

  // Default TextField for non-masked inputs
  return (
    <TextField
      error={error}
      helperText={helperText}
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      autoFocus={autoFocus}
      required={required}
      fullWidth={fullWidth}
      variant={variant}
      color={color || (error ? "error" : "primary")}
      size={size}
      value={value}
      onChange={onChange}
    />
  );
};

export default InputComponent;
