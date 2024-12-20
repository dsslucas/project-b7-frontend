import React, { useEffect, useState } from "react";
import BoxComponent from "../../components/Box/Box";
import TypographyComponent from "../../components/Typography/Typography";
import { useSelector } from "react-redux";
import api from "../../api/api";
import { CommonFunctions } from "../../common/common";
import { ConfigInfoInterface, ResponseInterface } from "../../Common/interfaces";
import SwitchComponent from "../../components/Switch/Switch"

const PermissionScreen = () => {
    const { LoginData } = useSelector((state: any) => state);
    const [configData, setConfigData] = useState<ConfigInfoInterface[]>([]);

    useEffect(() => {
        getConfigInfo();
    }, []);

    const getConfigInfo = async () => {
        console.log("opa joia")
        await api.get<ResponseInterface>("/config/tables/list", {
            headers: {
                Authorization: `Bearer ${LoginData.token}`
            }
        }
        ).then((response) => {
            const responseData = response.data;

            if (Array.isArray(responseData.data)) {
                // Se 'data' for um array de ConfigInfoInterface
                const content: ConfigInfoInterface[] = responseData.data;
                console.log(content);
                setConfigData(content);
            }
        }).catch((error) => {
            console.error(error)
            if (error.response) {
                console.error(error)
            } else if (error.request) {
                console.error("Erro de requisição. Tente novamente mais tarde.");
            } else {
                console.error("Erro de requisição. Tente novamente mais tarde.");
            }
        });
    }

    const handleChangeVisibilityColumn = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const { checked } = e.target;

        await api.put<ResponseInterface>(`/config/tables/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${LoginData.token}`
            }
        })
            .then((response) => {
                const dataUpdated = configData.map((item) => {
                    if (item.id === id) {
                        console.log("ENTREI AQUI")
                        return { ...item, active: checked };
                    } else {
                        return item;
                    }
                });

                setConfigData(dataUpdated);
            }).catch((error) => {
                console.error(error)
                if (error.response) {
                    console.error(error)
                } else if (error.request) {
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                } else {
                    console.error("Erro de requisição. Tente novamente mais tarde.");
                }
            });
    }

    useEffect(() => {
        console.log(configData)
    }, [configData])

    return <BoxComponent sx={{}} component="div">
        <BoxComponent sx={{}} component="header">
            <TypographyComponent component="span" variant="body2">
                Exibição de colunas da tabela para usuários estoquistas
            </TypographyComponent>
        </BoxComponent>
        <BoxComponent sx={{ display: "flex", flexDirection: "column", gap: 2 }} component="section">
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