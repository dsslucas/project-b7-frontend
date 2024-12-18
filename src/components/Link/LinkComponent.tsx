import { Divider, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React from "react"
import { Link } from "react-router";
import { colors } from "../../colors";
import ListItemButtomComponent from "../List/ListItemButtom";

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

        <ListItemButtomComponent
            isMenuList
            sx={{
                padding: 0,
                margin: 0,
                display: "flex",
                color: window.location.pathname === props.pathname ? colors.optionsText.active : colors.optionsText.normal
            }}
            icon={props.icon}
            text={props.text}
        />
    </Link>
}

export default LinkComponent;