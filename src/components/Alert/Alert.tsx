import React, { useEffect, useState } from "react"
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

interface AlertInterface {
    title: string;
    text: string;
    severity: 'error' | 'info' | 'success' | 'warning';
}

const AlertComponent: React.FC<AlertInterface> = (props: AlertInterface) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {visible && (
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity={props.severity}>
                        <AlertTitle>{props.title}</AlertTitle>
                        {props.text}
                    </Alert>
                </Stack>
            )}
        </>
    );
}

export default AlertComponent;