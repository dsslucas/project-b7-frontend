import React, { useEffect, useMemo, useState } from "react"
import BoxComponent from "../../components/Box/Box";
import TypographyComponent from "../../components/Typography/Typography";
import TableComponent from "../../components/Table/Table";
import { useSelector } from "react-redux";
import { AlertInterface, ResponseInterface, UserInterface } from "../../Common/interfaces";
import api from "../../api/api";
import { MRT_ColumnDef, MRT_Row, MRT_TableOptions } from "material-react-table";
import { Box } from "@mui/material";
import { CommonFunctions } from "../../common/common";
import AlertComponent from "../../components/Alert/Alert";

const UsersScreen = () => {
    const { LoginData } = useSelector((state: any) => state);
    const [users, setUsers] = useState<UserInterface[]>([]);
    const [alert, setAlert] = useState<AlertInterface>({
        open: false,
        title: "",
        text: "",
        severity: 'info'
    });
    const columns = useMemo<MRT_ColumnDef<UserInterface | any>[]>(
        () => [
            {
                id: 'id',
                accessorKey: 'id',
                header: 'Id',
                enableEditing: false,
                filterVariant: "autocomplete",
                size: 20,
                accessorFn: (row: any) => String(row.id)
            }, {
                accessorKey: 'name',
                filterVariant: 'autocomplete',
                header: 'Nome',
                size: 100,
                muiEditTextFieldProps: ({ cell, row }) => {
                    return ({
                        required: true,
                        value: String(row.original.name || ''),
                        onChange: (event) => {
                            row._valuesCache = {
                                ...row._valuesCache,
                                name: event.target.value,
                            }

                            row.original = {
                                ...row.original,
                                name: event.target.value,
                            }
                        },
                    })
                },
            }, {
                accessorKey: 'username',
                filterVariant: 'autocomplete',
                header: 'Username',
                size: 100,
                muiEditTextFieldProps: ({ cell, row }) => {
                    return ({
                        required: true,
                        value: String(row.original.username || ''),
                        onChange: (event) => {
                            row._valuesCache = {
                                ...row._valuesCache,
                                username: event.target.value,
                            }

                            row.original = {
                                ...row.original,
                                username: event.target.value,
                            }
                        },
                    })
                },
            }, {
                accessorKey: 'email',
                header: 'E-mail',
                filterVariant: 'autocomplete',
                muiEditTextFieldProps: ({ cell, row }) => {
                    return ({
                        required: true,
                        value: String(row.original.email || ''),
                        onChange: (event) => {
                            row._valuesCache = {
                                ...row._valuesCache,
                                email: event.target.value,
                            }

                            row.original = {
                                ...row.original,
                                email: event.target.value,
                            }
                        },
                    })
                },
            }, {
                accessorFn: (row: UserInterface) => String(row.roleCustom),
                accessorKey: 'role',
                header: 'Cargo',
                editVariant: 'select',
                filterVariant: 'autocomplete',
                editSelectOptions: [
                    { value: 'ADMIN', label: 'Administrador' },
                    { value: 'STOCK_WORKER', label: 'Estoquista' },
                ],
                muiEditTextFieldProps: ({ cell, row }) => {
                    return ({
                        select: true,
                        value: String(row.original.role),
                        defaultValue: String(row.original.role),
                        onChange: (event) => {
                            row._valuesCache = {
                                ...row._valuesCache,
                                role: event.target.value
                            }

                            row.original = {
                                ...row.original,
                                role: event.target.value
                            }
                        },
                    })
                },
            }, {
                accessorFn: (row: UserInterface) => String(row.active ? "ATIVO" : "INATIVO"),
                accessorKey: 'active',
                header: 'Ativo',
                editVariant: 'select',
                filterVariant: 'select',
                editSelectOptions: [
                    { value: true, label: 'ATIVO' },
                    { value: false, label: 'INATIVO' },
                ],
                muiEditTextFieldProps: ({ cell, row }) => {
                    return {
                        select: true,
                        value: String(row.original.active),
                        defaultValue: String(row.original.active),
                        onChange: (event) => {
                            const result: boolean = String(event.target.value) === 'true';

                            row._valuesCache = {
                                ...row._valuesCache,
                                active: result
                            }

                            row.original = {
                                ...row.original,
                                active: result
                            }
                        },
                    }
                }
            }, {
                accessorFn: (row: UserInterface) => new Date(row.registerDate),
                id: 'dateRegister',
                header: 'Data de registro',
                filterVariant: 'date',
                filterFn: 'lessThan',
                sortingFn: 'datetime',
                enableEditing: false,
                Cell: ({ cell }) => {
                    const date = cell.getValue<Date>();
                    if (date instanceof Date && !isNaN(date.getTime())) {
                        return date.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit', year: 'numeric' });
                    }
                    return '';
                },
                Header: ({ column }) => <em>{column.columnDef.header}</em>,
                muiFilterTextFieldProps: {
                    sx: {
                        minWidth: '250px',
                    },
                },
                muiEditTextFieldProps: {
                    disabled: true,
                },
            }
        ],
        [],
    );

    useEffect(() => {
        getUsers();
    }, []);

    function isUsersArray(data: unknown): data is UserInterface[] {
        return Array.isArray(data) && data.every(item => 'id' in item);
    }

    const getUsers = async () => {
        await api
            .get<ResponseInterface>("/user/list", {
                headers: {
                    Authorization: `Bearer ${LoginData.token}`,
                },
            })
            .then((response) => {
                const responseData = response.data;

                if (isUsersArray(responseData.data)) {
                    const content: UserInterface[] = responseData.data;
                    setUsers(content);
                } else {
                    console.error("O tipo de dados recebido não é um array.");
                }
            })
            .catch((error) => {
                console.error(error);
                if (error.response) {
                    console.error("Erro no servidor:", error.response.data);
                    setAlert(CommonFunctions().buildAlert("Erro", error.response.data.message, "error"));
                } else if (error.request) {
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                    setAlert(CommonFunctions().buildAlert("Erro", "Erro de requisição. Tente novamente mais tarde.", "error"));
                } else {
                    console.error("Erro inesperado:", error.message);
                    setAlert(CommonFunctions().buildAlert("Erro", "Erro inesperado. Tente novamente mais tarde.", "error"));
                }
            });
    };

    const handleCreateUser = async (data: UserInterface) => {
        await api.post("/user/signin", data, {
            headers: {
                Authorization: `Bearer ${LoginData.token}`,
            }
        })
            .then((response) => {
                setAlert(CommonFunctions().buildAlert("Sucesso", response.data.message, "success"));
                getUsers();
            })
            .catch((error) => {
                console.error(error);
                if (error.response) {
                    console.error("Erro no servidor:", error.response.data);
                    setAlert(CommonFunctions().buildAlert("Erro", error.response.data.message, "error"));
                } else if (error.request) {
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                    setAlert(CommonFunctions().buildAlert("Erro", "Erro de requisição. Tente novamente mais tarde.", "error"));
                } else {
                    console.error("Erro inesperado:", error.message);
                    setAlert(CommonFunctions().buildAlert("Erro", "Erro inesperado. Tente novamente mais tarde.", "error"));
                }
            });
    }

    const handleUpdateUser = async (data: UserInterface) => {
        await api.put(`/user/${data.id}`, data, {
            headers: {
                Authorization: `Bearer ${LoginData.token}`,
            }
        })
            .then((response) => {
                getUsers();
                setAlert(CommonFunctions().buildAlert("Sucesso", response.data.message, "success"));
            })
            .catch((error) => {
                console.error(error);
                if (error.response) {
                    console.error("Erro no servidor:", error.response.data);
                    setAlert(CommonFunctions().buildAlert("Erro", error.response.data.message, "error"));
                } else if (error.request) {
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                    setAlert(CommonFunctions().buildAlert("Erro", "Erro de requisição. Tente novamente mais tarde.", "error"));
                } else {
                    console.error("Erro inesperado:", error.message);
                    setAlert(CommonFunctions().buildAlert("Erro", "Erro inesperado. Tente novamente mais tarde.", "error"));
                }
            });
    }

    const handleDeleteUser = async (data: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await api.delete(`/user/${data}`, {
                headers: {
                    Authorization: `Bearer ${LoginData.token}`,
                }
            })
                .then((response) => {
                    getUsers();
                    setAlert(CommonFunctions().buildAlert("Sucesso", response.data.message, "success"));
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
        }
    }

    return <BoxComponent sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        width: "100%",
        gap: 2
    }} component="div">
        <>
            {alert.open && (
                <AlertComponent
                    open={alert.open}
                    title={alert.title}
                    text={alert.text}
                    severity={alert.severity}
                />
            )}
        </>
        <BoxComponent sx={{}} component="header">
            <TypographyComponent component="span" variant="body2">
                Gestão de usuários do sistema
            </TypographyComponent>
        </BoxComponent>
        <TableComponent
            columns={columns}
            data={users}
            create={handleCreateUser}
            update={handleUpdateUser}
            delete={handleDeleteUser}
        />
    </BoxComponent>
};

export default UsersScreen;