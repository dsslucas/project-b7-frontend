import React from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { Box, Breadcrumbs, IconButton, Link, Stack, Toolbar, Typography } from "@mui/material";
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import LinkComponent from "../../components/Link/LinkComponent"
import MenuIcon from '@mui/icons-material/Menu';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { common } from "../../common";
import { useNavigate } from "react-router";
const menuLength = 240;

const SectionContainer = styled("section")(({ theme }) => ({
    minHeight: "100vh",
    background: "#654a25",
    marginLeft: 0,
    [theme.breakpoints.down("sm")]: {
        background: "red"
    },
    [theme.breakpoints.up("sm")]: {
        marginLeft: "4rem",
    },
    display: "flex",
    flexDirection: "column",

}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        "& .MuiDrawer-paper": {
            position: "fixed",
            whiteSpace: "nowrap",
            width: menuLength,
            background: "#000c4e",
            overflowX: "hidden",
            height: "100%",
            color: "#fff",
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: "border-box",
            ...(!open && {
                overflowX: "hidden",
                transition: theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(0),
                [theme.breakpoints.up("sm")]: {
                    width: theme.spacing(8),
                },
            }),
        },
    })
);

const Header = styled("header")(({ theme }) => ({
    //zIndex: theme.zIndex.drawer + 1,
    //height: "10%",
    background: "dodgerblue",
    color: "#fff",
    minHeight: "50px",

    [theme.breakpoints.up("sm")]: {
        display: "none"
    },
}));

const AppTheme = (props: any) => {
    const mdTheme = createTheme();
    const navigate = useNavigate();

    const [open, setOpen] = React.useState(false);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    function handleClickBreadcrumb(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, pathname: string) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
        navigate(pathname);
    }
    
    const generateBreadcrumb = () => {
        const paths = window.location.pathname.split("/").filter((element: string) => element !== "");
        const breadcrumbs: any = [];
    
        paths.forEach((element: string, index: number) => {
            if (index !== paths.length - 1) {
                breadcrumbs.push(<Link
                    underline="hover"
                    key={index}
                    color="inherit"
                    href={`/${element}`}
                    onClick={(e:React.MouseEvent<HTMLAnchorElement, MouseEvent>) => handleClickBreadcrumb (e, `/${element}`)}
                >
                    {`${common().capitalizeFirstLetter(element)} /`}
                </Link>)
            }
        })
        console.log(breadcrumbs)
    
        const element = <>
            <Stack spacing={2}>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                    {breadcrumbs}
                </Breadcrumbs>
            </Stack>
            <Typography key={10} variant="h6" sx={{ color: 'text.primary', textAlign: "left" }}>
                {`${common().capitalizeFirstLetter(paths[paths.length - 1])}`}
            </Typography>
        </>
    
        return element;
    }

    return (
        <ThemeProvider theme={mdTheme}>
            <Drawer
                variant="permanent"
                open={open}
                onMouseOver={() => !open && toggleDrawer()}
                onMouseLeave={() => open && toggleDrawer()}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        px: [1],
                        minHeight: "50px",
                        backgroundColor: "green"
                    }}
                >
                    <IconButton onClick={toggleDrawer} sx={{ color: "red" }}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>

                <List component="nav" sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    //whiteSpace: open ? "normal" : "nowrap"
                }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        flex: 1
                    }}>
                        <LinkComponent pathname="/user" text="Lucas Souza" icon={<PersonIcon />} />
                        <LinkComponent pathname="/users" text="Gestão de usuários" icon={<PeopleAltIcon />} />
                        <LinkComponent pathname="/products" text="Produtos" icon={<InventoryIcon />} />
                        <LinkComponent pathname="/products/category" text="Categoria de produtos" icon={<CategoryIcon />} />
                        <LinkComponent pathname="/config" text="Configurações" icon={<AdminPanelSettingsIcon />} />
                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5
                    }}>
                        <LinkComponent pathname="/logout" text="Logout" icon={<LogoutIcon />} />
                    </Box>
                </List>
            </Drawer>

            {/* Conteúdo principal */}
            <SectionContainer>
                <Header>
                    <Toolbar
                        sx={{
                            //pr: '24px', // keep right padding when drawer closed
                            color: "purple",
                            minHeight: "50px",
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                // marginRight: '36px',
                                // ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ display: "flex", flexGrow: 1, justifyContent: "center", textAlign: 'center' }}
                        >
                            Projeto - Produtos
                        </Typography>
                        <Box sx={{ width: "25px" }}></Box>
                    </Toolbar>
                </Header>

                <Box
                    component="summary"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        background: "white",
                        px: 1.5
                    }}
                >
                    {generateBreadcrumb()}
                </Box>

                <Box
                    component="article"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        background: "gray",
                        px: 1.5
                    }}
                >
                    <span>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste asperiores
                        totam expedita. Velit labore magni repudiandae dicta. Facere non, aperiam
                        doloribus enim quae, nemo magni molestiae, magnam odio quod vero.</span>
                    <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora distinctio repudiandae veritatis necessitatibus recusandae, fuga suscipit dignissimos deserunt vel nisi? In quidem totam maxime cupiditate rerum praesentium harum corrupti minus!</span>
                    <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem quis officiis quaerat quo id, cupiditate consequatur illo modi ducimus est? Accusantium quia magnam reiciendis architecto, impedit eveniet molestias libero veritatis! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus, consequatur! Ut odit ipsa, consectetur molestias aut neque voluptatem cum similique maxime blanditiis odio explicabo consequatur necessitatibus veritatis fuga libero corrupti?</span>
                </Box>
            </SectionContainer>
        </ThemeProvider>
    );
};

export default AppTheme;
