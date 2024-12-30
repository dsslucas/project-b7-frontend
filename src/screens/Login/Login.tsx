import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import InputComponent from "../../components/Input/Input";
import ButtonComponent from '../../components/Button/Button';
import TypographyComponent from "../../components/Typography/Typography"
import api from "../../api/api";
import { ResponseInterface } from "../../Common/interfaces"
import { colors } from '../../colors';
import LabelComponent from "../../components/Label/Label";
import { useDispatch } from 'react-redux';
import { LoginData } from '../../redux/actions/LoginData';
import { useNavigate } from 'react-router';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

const Login = (props: any) => {
    const [status, setStatus] = React.useState(false);
    const [statusMessage, setStatusMessage] = React.useState('');
    const [error, setError] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus(false);
        setError(false);
        setStatusMessage("");

        const data = new FormData(event.currentTarget);

        await api.post<ResponseInterface>("/auth/login", {
            username: data.get('username'),
            password: data.get('password'),
        })
            .then((response) => {
                const responseData = response.data;
                setStatus(true);
                setStatusMessage(`Bem vindo, ${responseData.data.name}!`);
                dispatch(LoginData(responseData.data));
                navigate("/home");
            })
            .catch((error) => {
                if (error.response) {
                    setStatus(true);
                    setError(true);
                    setStatusMessage(error.response.data.message);
                } else if (error.request) {
                    setStatus(true);
                    setError(true);
                    setStatusMessage("Erro de requisição. Tente novamente mais tarde.");
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                } else {
                    setStatus(true);
                    setError(true);
                    setStatusMessage("Erro de requisição. Tente novamente mais tarde.");
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                }
            });
    };

    return (
        <>
            <CssBaseline enableColorScheme />
            <SignInContainer direction="column" justifyContent="space-between">
                {/* <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} /> */}
                <Card variant="outlined">
                    {/* <SitemarkIcon /> */}
                    <TypographyComponent
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Login
                    </TypographyComponent>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <LabelComponent idFor="username" sx={{textAlign: "left"}}>Usuário</LabelComponent>
                            <InputComponent
                                id="username"
                                type="text"
                                name="username"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={'primary'}
                                size="small"
                            />
                        </FormControl>
                        <FormControl>
                            <LabelComponent idFor="password" sx={{textAlign: "left"}}>Senha</LabelComponent>
                            <InputComponent
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                size="small"
                            />
                        </FormControl>

                        {status && (
                            <TypographyComponent
                                component="span"
                                variant="body2"
                                sx={{ color: error? colors.text.response.error : colors.text.response.success }}
                            >
                               {statusMessage}
                            </TypographyComponent>
                        )}

                        {/* <ForgotPassword open={open} handleClose={handleClose} /> */}
                        <ButtonComponent type="submit"
                            fullWidth
                            variant="contained"
                            onClick={() => null}
                            sx={{}}
                        >
                            Entrar
                        </ButtonComponent>
                    </Box>
                </Card>
            </SignInContainer>
        </>
    );
}

export default Login;