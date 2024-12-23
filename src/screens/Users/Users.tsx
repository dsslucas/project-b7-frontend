import React, { useEffect, useMemo, useState } from "react"
import BoxComponent from "../../components/Box/Box";
import TypographyComponent from "../../components/Typography/Typography";
import TableComponent from "../../components/Table/Table";
import { useSelector } from "react-redux";
import { ResponseInterface, UserInterface } from "../../Common/interfaces";
import api from "../../api/api";
import { MRT_ColumnDef, MRT_Row, MRT_TableOptions } from "material-react-table";
import { Box } from "@mui/material";

const UsersScreen = () => {
    const { LoginData } = useSelector((state: any) => state);
    const [users, setUsers] = useState<UserInterface[]>([]);
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
                muiEditTextFieldProps: {
                    required: true,
                    // error: !!validationErrors?.name,
                    // helperText: validationErrors?.name,
                    // onFocus: () =>
                    //     setValidationErrors({
                    //         ...validationErrors,
                    //         name: undefined,
                    //     }),
                }
            }, {
                accessorKey: 'username',
                filterVariant: 'autocomplete',
                header: 'Username',
                size: 100,
                muiEditTextFieldProps: {
                    required: false,
                    // error: !!validationErrors?.name,
                    // helperText: validationErrors?.name,
                    // onFocus: () =>
                    //     setValidationErrors({
                    //         ...validationErrors,
                    //         name: undefined,
                    //     }),
                }
            }, {
                accessorKey: 'email',
                header: 'E-mail',
                filterVariant: 'autocomplete',
                muiEditTextFieldProps: {
                    type: 'email',
                    required: true,
                    // error: !!validationErrors?.email,
                    // helperText: validationErrors?.email,
                    // onFocus: () =>
                    //     setValidationErrors({
                    //         ...validationErrors,
                    //         email: undefined,
                    //     }),
                }
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
                muiEditTextFieldProps: {
                    select: true,
                    // error: !!validationErrors?.state,
                    // helperText: validationErrors?.state,
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
                muiEditTextFieldProps: {
                    select: true,
                },
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
                    console.table(content);
                    setUsers(content);
                } else {
                    console.error("O tipo de dados recebido não é um array.");
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

    const handleCreateUser = async (data: UserInterface) => {
        console.log(data)
        console.log(LoginData.token)
        await api.post("/user/signin", data, {
            headers: {
                Authorization: `Bearer ${LoginData.token}`,
            }
        })
            .then((response) => {
                const responseData = response.data;

                console.log(responseData)
                getUsers();
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

    const handleUpdateUser = async (data: UserInterface) => {
        console.log(data)
        console.log(LoginData.token)
        await api.put(`/user/${data.id}`, data, {
            headers: {
                Authorization: `Bearer ${LoginData.token}`,
            }
        })
            .then((response) => {
                const responseData = response.data;

                console.log(responseData)
                getUsers();
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

    const handleDeleteUser = async (data: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            alert(`user deleted! Id: ${data}`)
            await api.delete(`/user/${data}`, {
                headers: {
                    Authorization: `Bearer ${LoginData.token}`,
                }
            })
                .then((response) => {
                    const responseData = response.data;

                    console.log(responseData)
                    getUsers();
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