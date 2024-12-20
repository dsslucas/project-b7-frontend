import React from "react"
import TextField from '@mui/material/TextField';

interface InputInterface {
    id: string,
    name: string;
    type: string;
    
    // Optative
    placeholder ?: string;
    autoFocus ?: boolean;
    required ?: boolean;
    fullWidth ?: boolean;
    variant ?: "outlined";
    color ?: string;
    size ?: string
    error ?: boolean;
    helperText ?: string
}

const InputComponent: React.FC<InputInterface> = (props: InputInterface) => {
    return <TextField
        error={props.error}
        helperText={props.helperText}
        id={props.id}
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        //autoComplete="email"
        autoFocus={props.autoFocus}
        required={props.required}
        fullWidth={props.fullWidth}
        variant={props.variant}
        color={props.error ? 'error' : 'primary'}
        size="small"
    />
}

export default InputComponent;