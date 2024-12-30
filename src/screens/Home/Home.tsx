import React from "react";
import BoxComponent from "../../components/Box/Box";
import TypographyComponent from "../../components/Typography/Typography";

const Home = () => {
    return <BoxComponent sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        width: "100%",
        gap: 1
    }} component="div">
        
        <BoxComponent sx={{}} component="header">
            <TypographyComponent component="span" variant="body2">
                Informações do projeto
            </TypographyComponent>
        </BoxComponent>
        <BoxComponent sx={{gap: 1}} component="section">
            <TypographyComponent component="p" variant="body2">
                Neste projeto, lidamos com a gestão de produtos, suas categorias e dos usuários. As funcionalidades deste sistema dependerão do perfil atribuído ao usuário.
            </TypographyComponent>
        </BoxComponent>
    </BoxComponent>
}

export default Home;