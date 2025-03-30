// Configuración de la aplicación
const appConfig = {
    apiBaseUrl: 'https://cityvibess.bsite.net/api',
    endpoints: {
        // Endpoints de Users
        getUsers: '/Users',
        updateUsers: '/Users',
        deleteUser: '/Users/Delete',
        getUsersOrderDesc: '/Users/OrderDesc',
        getUsersUsernames: '/Users/Usernames',
        getUsersEmails: '/Users/Emails',
        getUsersAvailables: '/Users/Availables',
        register: '/Users/Register',
        usersUnable: '/Users/Unable',
        login: '/Users/Login',
        getUserById: '/Users/{id}',
        createUser: '/Users',

        // Endpoints de Values
        getValues: '/Values',
        getValueById: '/Values/{id}',
        createValue: '/Values',
        updateValue: '/Values/{id}',
        deleteValue: '/Values/{id}'
    },
    // Configuración de tokens
    token: {
        name: 'userToken',         // Nombre para almacenar en localStorage
        expiry: 24 * 60 * 60 * 1000, // Expiración: 24 horas en milisegundos
        refreshThreshold: 30 * 60 * 1000 // Umbral para refrescar: 30 minutos antes de expirar
    }
};