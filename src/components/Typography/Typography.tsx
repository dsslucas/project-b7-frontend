import React from "react";
import Typography from '@mui/material/Typography';

interface TypographyInterface {
    component: string;
    variant: string;
    sx: object;
    children: React.ReactNode;
}

const TypographyComponent: React.FC<TypographyInterface> = (props: TypographyInterface) => {
    return <Typography>

    </Typography>
}

export default TypographyComponent;