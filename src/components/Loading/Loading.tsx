import React from "react"
import { LoadingInterface } from "../../Common/interfaces";
import BoxComponent from "../Box/Box";
import { CircularProgress, Slide, Typography } from "@mui/material";
import { colors } from "../../colors";

const LoadingComponent: React.FC<LoadingInterface> = (props: LoadingInterface) => {
    return <BoxComponent
        component="div"
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: colors.headerBackground,
            color: colors.optionsText.active,
            zIndex: 1500, // Mantém o loading acima de outros elementos
        }}
    >
        <CircularProgress size={60} color="warning" />
        <Typography variant="h6" sx={{ mt: 2 }}>
            Carregando, por favor aguarde...
        </Typography>
    </BoxComponent>
}

export default LoadingComponent;