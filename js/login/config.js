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
    }
};