import React from "react";
import Typography, { TypographyProps } from '@mui/material/Typography';
import { SxProps } from "@mui/material";

interface TypographyInterface extends Omit<TypographyProps, "variant"> {
    component?: any;
    variant?: TypographyProps["variant"];
    sx?: SxProps;
    children: React.ReactNode;
}

const TypographyComponent: React.FC<TypographyInterface> = (props: TypographyInterface) => {
    return <Typography 
        component={props.component}
        variant={props.variant}
        sx={props.sx}
    >
        {props.children}
    </Typography>
}

export default TypographyComponent;