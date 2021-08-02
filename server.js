const http = require('http');
const app = require('./app');

// cette fonction renvoit un port valide sous la forme d'un nombre ou d'une string
const normalizePort = val => { 
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

/* si le port 3000 n'est pas disponible, on utilise une variable environnement si un port par défaut est proposé */
const port = normalizePort(process.env.PORT || '3000' );

app.set('port', port);

// on recherche et gère les différentes erreurs
const errorHandler = error => { 
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'Pipe ' + address : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevate privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

/* package http permet de créer un server, l'argument est la fonction appellée pour chaque requête, 
ici on appelle notre app */
const server = http.createServer(app);

// on écoute si une erreur survient
server.on('error', errorHandler); 
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

// le server est prêt et doit maintenant attendre les requête
server.listen(port); 
