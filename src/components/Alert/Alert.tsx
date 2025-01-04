import React, { useEffect, useState } from "react"
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { AlertInterface } from "../../Common/interfaces";
import { Slide } from "@mui/material";

const AlertComponent: React.FC<AlertInterface> = (props: AlertInterface) => {
    const [visible, setVisible] = useState(props.open);

    useEffect(() => {
        const timer = setTimeout(() => {
            //setVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Stack
            sx={{
                position: 'fixed',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1400,
                maxWidth: '90%',
            }}
            spacing={2}
        >
            <Slide in={visible} timeout={{ enter: 500, exit: 300 }}>
                <Alert severity={props.severity} variant="filled">
                    <AlertTitle>{props.title}</AlertTitle>
                    {props.text}
                </Alert>
            </Slide>
        </Stack >
    );
}

export default AlertComponent;