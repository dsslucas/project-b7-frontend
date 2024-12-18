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
import { common } from "../../common";
import { useNavigate } from "react-router";
import { colors } from "../../colors";
const menuLength = 240;

interface BreadcrumbPath {
    label: string;
    href: string;
}

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

    [theme.breakpoints.up("sm")]: {
        display: "none"
    },
}));

const AppTheme = (props: any) => {
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
                        <LinkComponent pathname="/usuarios" text="Gestão de usuários" icon={<PeopleAltIcon />} />
                        <LinkComponent pathname="/produtos" text="Produtos" icon={<InventoryIcon />} />
                        <LinkComponent pathname="/produtos/categorias" text="Categorias de produtos" icon={<CategoryIcon />} />
                        <LinkComponent pathname="/ajustes" text="Configurações" icon={<AdminPanelSettingsIcon />} />
                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5
                    }}>
                        <LinkComponent pathname="/user" text="Meus dados" icon={<PersonIcon />} />
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
                        background: colors.contextBackground
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
