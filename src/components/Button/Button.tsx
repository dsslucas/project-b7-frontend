import { Button } from "@mui/material";
import React from "react"

interface ButtonInterface {
    children: React.ReactNode;
    sx: object;
    type: "button" | "submit" | "reset" | undefined;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    
    variant?: "outlined" | "text" | "contained";
    fullWidth?: boolean;
}

const ButtonComponent: React.FC<ButtonInterface> = (props: ButtonInterface) => {
    return <Button
        type={props.type}
        onClick={props.onClick}
        sx={props.sx}
        variant={props.variant}
        fullWidth={props.fullWidth}
    >
        {props.children}
    </Button>
}

export default ButtonComponent;