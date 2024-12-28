import React, { ElementType } from "react";
import { Box, Breadcrumbs, IconButton, Link, Stack, Toolbar, Typography } from "@mui/material";

interface BoxInterface {
    children: React.ReactNode;
    component: ElementType;
    sx: Object;
    onSubmit?: (e: React.FormEvent) => void;
}

const BoxComponent: React.FC<BoxInterface> = (props: BoxInterface) => {
    return <Box component={props.component} sx={props.sx} onSubmit={props.onSubmit}>
        {props.children}
    </Box>
}

export default BoxComponent;