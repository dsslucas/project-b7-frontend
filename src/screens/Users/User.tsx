import React, { useEffect, useState } from "react"
import BoxComponent from "../../components/Box/Box";
import TypographyComponent from "../../components/Typography/Typography";
import { useSelector } from "react-redux";
import { ResponseInterface, UserInterface } from "../../Common/interfaces";
import InputComponent from "../../components/Input/Input";
import ButtonComponent from "../../components/Button/Button";
import SelectComponent from "../../components/Select/Select";
import api from "../../api/api";
import { SelectChangeEvent } from "@mui/material";

const UserScreen = () => {
    const { LoginData } = useSelector((state: any) => state);
    const [formValues, setFormValues] = useState<UserInterface>({
        id: 0,
        name: '',
        username: '',
        password: '',
        role: '',
        roleCustom: '',
        email: '',
        registerDate: '',
        active: false,
    });

    // Check if data is valid with interface
    const isUserInterface = (data: any): data is UserInterface => {
        return (
            data &&
            typeof data.id === "number" &&
            typeof data.name === "string" &&
            typeof data.username === "string" &&
            (typeof data.password === "string" || data.password === null || data.password === undefined) &&
            typeof data.role === "string" &&
            typeof data.roleCustom === "string" &&
            typeof data.email === "string" &&
            typeof data.registerDate === "string" &&
            typeof data.active === "boolean"
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormValues({
            ...formValues,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitted Data:', formValues);
    };

    const getUserInfo = async () => {
        console.log(LoginData);
        await api.get<ResponseInterface>(`/user/${LoginData.id}`, {
            headers: {
                Authorization: `Bearer ${LoginData.token}`,
            },
        })
            .then((response) => {
                const responseData = response.data;
                if (isUserInterface(responseData.data)) {
                    setFormValues(responseData.data);
                } else {
                    console.error("Os dados retornados não correspondem ao tipo UserInterface.", responseData.data);
                }
            })
            .catch((error) => {
                console.error(error);
                if (error.response) {
                    console.error("Erro no servidor:", error.response.data);
                } else if (error.request) {
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                } else {
                    console.error("Erro inesperado:", error.message);
                }
            });
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    return <BoxComponent sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        width: "100%",
        gap: 2
    }} component="div">
        <BoxComponent sx={{}} component="header">
            <TypographyComponent component="span" variant="body2">
                Dados do usuário
            </TypographyComponent>
        </BoxComponent>

        <BoxComponent
            sx={{
                display: "flex",
                flexDirection: "column",
                width: {
                    xs: "100%",
                    sm: "100%",
                    md: "30%"
                },
                gap: 2
            }}
            component="form"
            onSubmit={handleSubmit}
        >
            <InputComponent
                label="Name"
                id="name"
                name="name"
                type="text"
                value={formValues.name}
                onChange={handleChange}
                required
            />

            <InputComponent
                label="Username"
                id="username"
                name="username"
                type="text"
                value={formValues.username}
                onChange={handleChange}
                required
            />

            <InputComponent
                label="Password"
                id="password"
                name="password"
                type="text"
                value={formValues.password}
                onChange={handleChange}
            />

            <InputComponent
                label="Email"
                id="email"
                name="email"
                type="text"
                value={formValues.email}
                onChange={handleChange}
                required
            />

            <SelectComponent
                label="Role"
                id="role"
                name="role"
                type="text"
                value={formValues.role}
                onChange={(e: SelectChangeEvent) => console.log(e.target.value)}
                options={[
                    { value: 'ADMIN', label: 'Administrador' },
                    { value: 'STOCK_WORKER', label: 'Estoquista' },
                ]}
                size="small"
                required
            />

            <ButtonComponent type="submit" sx={{}} onClick={() => null} variant="contained">
                Update
            </ButtonComponent>
        </BoxComponent>
    </BoxComponent>
};

export default UserScreen;