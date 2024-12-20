// Estado Inicial
const INITIAL_STATE = {
    id: null,
    name: null,
    username: null,
    role: null,
    token: null
}

const LoginDataReducer = (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case 'LOGIN_USER':
            return action.payload
        default:
            return state
    }
}

export default LoginDataReducer