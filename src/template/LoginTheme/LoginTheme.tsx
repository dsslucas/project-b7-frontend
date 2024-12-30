import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LoginThemeInterface } from './Interface';
import Login from "../../screens/Login/Login";

export default function LoginTheme(props: LoginThemeInterface) {
  const { disableCustomTheme, themeComponents } = props;
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
        cssVariables: {
          colorSchemeSelector: 'data-mui-color-scheme',
          cssVarPrefix: 'template',
        },
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableCustomTheme, themeComponents]);

  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      <Login />
    </ThemeProvider>
  );
}