import React, { useEffect, useState } from "react";
import BoxComponent from "../../components/Box/Box";
import TypographyComponent from "../../components/Typography/Typography";
import { useSelector } from "react-redux";
import api from "../../api/api";
import { CommonFunctions } from "../../common/common";
import { AlertInterface, ConfigInfoInterface, ResponseInterface } from "../../Common/interfaces";
import SwitchComponent from "../../components/Switch/Switch"
import AlertComponent from "../../components/Alert/Alert";
import LoadingComponent from "../../components/Loading/Loading";

const PermissionScreen = () => {
    const { LoginData } = useSelector((state: any) => state);
    const [configData, setConfigData] = useState<ConfigInfoInterface[]>([]);
    const [alert, setAlert] = useState<AlertInterface>({
        open: false,
        title: "",
        text: "",
        severity: 'info'
    });
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getConfigInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function isConfigInfoArray(data: unknown): data is ConfigInfoInterface[] {
        return Array.isArray(data) && data.every(item => 'id' in item);
    }

    const getConfigInfo = async () => {
        setLoading(true);
        await api
            .get<ResponseInterface>("/config/tables/list", {
                headers: {
                    Authorization: `Bearer ${LoginData.token}`,
                },
            })
            .then((response) => {
                const responseData = response.data;
                if (isConfigInfoArray(responseData.data)) {
                    const content: ConfigInfoInterface[] = responseData.data;
                    setConfigData(content);
                } else {
                    console.error("O tipo de dados recebido não é um array.");
                }
            }).catch((error) => {
                console.error(error);
                if (error.response) {
                    console.error("Erro no servidor:", error.response.data);
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        error.response.data.message,
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                } else if (error.request) {
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        "Erro de requisição. Tente novamente mais tarde.",
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                } else {
                    console.error("Erro inesperado:", error.message);
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        "Erro inesperado. Tente novamente mais tarde.",
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                }
            }).finally(() => {
                setLoading(false);
            });
    };

    const handleChangeVisibilityColumn = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const { checked } = e.target;
        setLoading(true);

        await api.put<ResponseInterface>(`/config/tables/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${LoginData.token}`
            }
        })
            .then((response) => {
                const dataUpdated = configData.map((item) => {
                    if (item.id === id) {
                        return { ...item, active: checked };
                    } else {
                        return item;
                    }
                });

                setConfigData(dataUpdated);
                setAlert(CommonFunctions().buildAlert(
                    "Sucesso",
                    response.data.message,
                    "success",
                    (updatedAlert) => {
                        setAlert(updatedAlert)
                    })
                );
            }).catch((error) => {
                console.error(error)
                if (error.response) {
                    console.error(error)
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        error.response.data.message,
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                } else if (error.request) {
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        "Erro de requisição. Tente novamente mais tarde.",
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                } else {
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                    setAlert(CommonFunctions().buildAlert(
                        "Erro",
                        "Erro inesperado. Tente novamente mais tarde.",
                        "error",
                        (updatedAlert) => {
                            setAlert(updatedAlert)
                        })
                    );
                }
            }).finally(() => {
                setLoading(false);
            });
    }

    return <BoxComponent sx={{
        textAlign: "left",
        width: {
            xs: "100%",
            sm: "100%",
            md: "30%"
        }
    }} component="div">
        {loading && <LoadingComponent open={loading} />}
        {alert.open && (
            <AlertComponent
                open={alert.open}
                title={alert.title}
                text={alert.text}
                severity={alert.severity}
            />
        )}
        <BoxComponent sx={{}} component="header">
            <TypographyComponent component="span" variant="body2">
                Exibição de colunas da tabela para usuários estoquistas
            </TypographyComponent>
        </BoxComponent>
        <BoxComponent sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2
        }} component="section">
            {configData && configData.map((element: ConfigInfoInterface) => {

                return <BoxComponent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} component="div">
                    <TypographyComponent component="p" variant="body2">
                        {element.name}
                    </TypographyComponent>
                    <SwitchComponent checked={element.active} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeVisibilityColumn(e, element.id)} />
                </BoxComponent>
            })}

        </BoxComponent>

    </BoxComponent>
}

export default PermissionScreen;