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
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { common } from "../../common/common";
import { useNavigate } from "react-router";
import { colors } from "../../colors";

import Button from "../../components/Button/Button"
import ListItemButtomComponent from "../../components/List/ListItemButtom";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import { ResponseInterface } from "../../Common/interfaces";
import { LoginData } from "../../redux/actions/LoginData";
const menuLength = 240;

interface AppThemeInterface {
    children: React.ReactNode;
}

interface BreadcrumbPath {
    label: string;
    href: string;
}

const SectionContainer = styled("section")(({ theme }) => ({
    minHeight: "100vh",
    background: "#654a25",
    marginLeft: 0,
    [theme.breakpoints.down("sm")]: {

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
            background: colors.headerBackground,
            overflowX: "hidden",
            height: "100%",
            color: colors.optionsText.normal,
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
    background: colors.headerBackground,
    color: "#fff",
    minHeight: "50px",
    [theme.breakpoints.down("sm")]: {
        position: "sticky",
        top: 0
    },

    [theme.breakpoints.up("sm")]: {
        display: "none"
    },
}));

const AppTheme: React.FC<AppThemeInterface> = (props: AppThemeInterface) => {
    const mdTheme = createTheme({
        components: {
            MuiToolbar: {
                styleOverrides: {
                    dense: {
                        height: 55,
                        minHeight: 55
                    }
                }
            }
        }
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loginDataRedux = useSelector((state: any) => state.LoginData);
    const isAdmin = loginDataRedux.role === "ADMIN";
    console.log(loginDataRedux)

    const [open, setOpen] = React.useState(false);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const scrollToTop = () => {
        console.log("cliquei")
        window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    };

    const logoutUser = async () => {
        console.log(loginDataRedux.token)
        await api.post<ResponseInterface>("/auth/logout", {}, {
            headers: { 
                Authorization: `Bearer ${loginDataRedux.token}` 
            }
        })
            .then((response) => {
                const responseData = response.data;
                dispatch(LoginData(responseData.data));
                window.location.reload();
            })
            .catch((error) => {
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

    function handleClickBreadcrumb(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, pathname: string) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
        navigate(pathname);
    }

    const generateBreadcrumb = () => {
        const paths: BreadcrumbPath[] = [
            { label: "Projeto de Gerenciamento", href: "/home" },
            ...window.location.pathname
                .split("/")
                .filter((element, index) => index !== 0 && element !== "")
                .map((element: string) => ({
                    label: common().capitalizeFirstLetter(element),
                    href: `/${element}`,
                })),
        ];

        console.log(paths)

        const breadcrumbs = paths
            .slice(0, -1)
            .map(({ label, href }, index) => (
                <Link
                    underline="hover"
                    key={index}
                    color="inherit"
                    href={href}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
                        handleClickBreadcrumb(e, href)
                    }
                    sx={{
                        display: label === "Projeto de Gerenciamento" ? { xs: "none", sm: "flex" } : "inline",
                    }}
                >
                    {`${label}`}
                </Link>
            ));

        return (
            <>
                <Stack spacing={2}>
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                        {breadcrumbs}
                    </Breadcrumbs>
                </Stack>
                <Typography
                    key={10}
                    variant="h6"
                    sx={{ color: "text.primary", textAlign: "left", lineHeight: breadcrumbs.length > 0 ? 1.15 : 1.5 }}
                >
                    {paths[paths.length - 1].label}
                </Typography>
            </>
        );
    }

    return (
        <ThemeProvider theme={mdTheme} >
            <Drawer
                variant="permanent"
                open={open}
                onMouseOver={() => !open && toggleDrawer()}
                onMouseLeave={() => open && toggleDrawer()}
            >
                <Toolbar
                    variant="dense"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        px: [1],
                    }}
                >
                    <IconButton onClick={toggleDrawer} sx={{ color: colors.optionsText.normal }}>
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
                        <LinkComponent pathname="/home" text="Home" icon={<HomeIcon />} />
                        {isAdmin && (
                            <LinkComponent pathname="/usuarios" text="Gestão de usuários" icon={<PeopleAltIcon />} />
                        )}
                        <LinkComponent pathname="/produtos" text="Produtos" icon={<InventoryIcon />} />
                        <LinkComponent pathname="/produtos/categorias" text="Categorias de produtos" icon={<CategoryIcon />} />
                        {isAdmin && (
                            <LinkComponent pathname="/permissoes" text="Permissões" icon={<AdminPanelSettingsIcon />} />
                        )}
                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5
                    }}>
                        <Button
                            type="button"
                            onClick={scrollToTop}
                            sx={{ background: "transparent", padding: 0, textTransform: 'none' }}
                        >
                            <ListItemButtomComponent
                                isMenuList
                                sx={{
                                    padding: 0,
                                    margin: 0,
                                    display: "flex",
                                    color: colors.optionsText.normal
                                }}
                                icon={<KeyboardDoubleArrowUpIcon />}
                                text={"Voltar ao início"}
                            />
                        </Button>
                        <LinkComponent pathname="/usuario" text="Meus dados" icon={<PersonIcon />} />
                        <Button
                            type="button"
                            onClick={logoutUser}
                            sx={{ background: "transparent", padding: 0, textTransform: 'none' }}
                        >
                            <ListItemButtomComponent
                                isMenuList
                                sx={{
                                    padding: 0,
                                    margin: 0,
                                    display: "flex",
                                    color: colors.optionsText.normal
                                }}
                                icon={<LogoutIcon />}
                                text={"Logout"}
                            />
                        </Button>
                    </Box>
                </List>
            </Drawer>

            {/* Conteúdo principal */}
            <SectionContainer>
                <Header>
                    <Toolbar
                        sx={{
                            //pr: '24px', // keep right padding when drawer closed
                            color: colors.headerText,
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
                            Projeto de Gerenciamento
                        </Typography>
                        <Box sx={{ width: "25px" }}></Box>
                    </Toolbar>
                </Header>

                <Box
                    component="summary"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        px: 1.5,
                        background: colors.contextBackground,
                        paddingTop: 1,
                        minHeight: "1.8rem",
                        maxHeight: "3.50rem",
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
                        px: 1.5,
                        background: colors.contextBackground,
                        paddingBottom: 1.5
                    }}
                >
                    {props.children}
                </Box>
            </SectionContainer>
        </ThemeProvider>
    );
};

export default AppTheme;
