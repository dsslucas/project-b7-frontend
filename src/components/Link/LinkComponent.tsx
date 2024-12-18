import { Divider, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React from "react"
import { Link } from "react-router";

interface LinkInterface {
    pathname: string;
    style?: Object;
    text: string;
    icon: React.ReactNode;
}

const LinkComponent: React.FC<LinkInterface> = (props: LinkInterface) => {
    return <Link
        style={{
            display: "flex",
            textDecoration: 'none',
           
            //background: "silver",
            
        }}
        to={props.pathname}>
        <ListItemButton sx={{
            padding: 0,
            margin: 0,
            display: "flex",
            color: window.location.pathname === props.pathname ? "red" : "white",
        }}>
            <Divider sx={{
                display: "flex",
                justifyContent: "center",
                width: "65px"
            }}>
                {props.icon}
            </Divider>
            <ListItemText
                inset
                primary={props.text}
                sx={{
                    padding: 0,
                    maxWidth: "70%"
                }}
            />
            {/* <Divider sx={{
                background: "#654a",
                height: "auto",
                width: "70%",
                wordWrap: "wrap",
                wordBreak: "break-words" // Propriedade adicionada para quebra de linha
            }}>
                {props.text}
            </Divider> */}

            {/* <ListItemText
                primary=
                sx={{
                    background: "#654a",
                    width: "10px",
                    //wordBreak: "break-all" // Propriedade adicionada para quebra de linha
                }}
            /> */}
        </ListItemButton>
    </Link>
}

export default LinkComponent;