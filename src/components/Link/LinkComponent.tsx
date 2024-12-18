import { Divider, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React from "react"
import { Link } from "react-router";
import { colors } from "../../colors";

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
            color: window.location.pathname === props.pathname ? colors.optionsText.active : colors.optionsText.normal,
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
        </ListItemButton>
    </Link>
}

export default LinkComponent;