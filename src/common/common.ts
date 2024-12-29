import { useSelector } from "react-redux";

// Hook customizado
export function CommonFunctions() {
  function capitalizeFirstLetter(value: string) {
    return String(value).charAt(0).toUpperCase() + String(value).slice(1);
  }

  function ReturnHeaderAuthentication() {
    const { LoginData } = useSelector((state: any) => state);

    return {
      headers: {
        Authentication: `Bearer ${LoginData.token}`,
      },
    };
  }

  function transformStringToNumericValue(value: string) {
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
  }

  function buildAlert(title: string, text: string, severity: 'error' | 'info' | 'success' | 'warning') {
    return {
      open: true,
      title,
      text,
      severity
    }
  }

  return {
    capitalizeFirstLetter,
    ReturnHeaderAuthentication,
    transformStringToNumericValue,
    buildAlert
  };
}


