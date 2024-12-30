import React from "react"
import FormLabel from '@mui/material/FormLabel';

interface LabelInterface {
    idFor: string;
    children: React.ReactNode;
    sx: Object;
}

const LabelComponent: React.FC<LabelInterface> = (props: LabelInterface) => {
    return <FormLabel htmlFor={props.idFor} sx={props.sx}>{props.children}</FormLabel>
}

export default LabelComponent;