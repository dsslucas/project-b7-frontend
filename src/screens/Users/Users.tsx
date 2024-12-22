import React from "react"
import BoxComponent from "../../components/Box/Box";
import TypographyComponent from "../../components/Typography/Typography";
import TableComponent from "../../components/Table/Table";

const UsersScreen = () => {
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
        <TableComponent />        

    </BoxComponent>
};

export default UsersScreen;