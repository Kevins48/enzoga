const { Sequelize } = require('sequelize');
const pg = require('pg');

var sequelize = null;

module.exports.db_init = function(dbSettings, admin_config, heroku = false){
    let databaseName = dbSettings.databaseName,
        username = dbSettings.username,
        password = dbSettings.password,
        host = dbSettings.host,
        port = dbSettings.port;
        defaultDb = dbSettings.defaultDb;

    if(!heroku){
        // String koneksi database (URL tempat database hidup)
        let dbURL = 'postgres://' + username + ':' + password + '@' + host + ':' + port + '/' + databaseName;

        let pool = new pg.Pool({
            user: username,
            host: host,
            port: port,
            password: password,
            database: defaultDb,
        });
        
        // Menciptakan database
        pool.query('CREATE DATABASE ' + databaseName, (err, res) =>{
            if (!err) {
                console.log('Successfully created database');
            }
            else {
                console.log("Failed creating database.\nA database probably already exists with the same name.\nCreating a new database.\nUse with argument -v if error persists");
            }
    
            sequelize = new Sequelize(dbURL, { logging: false });
    
            // Mengimport model-model yang diperlukan webapp agar tabel diciptakan
            const user = require('./models/user');
            const item = require('./models/item');
    
            sequelize.sync({ force: true }).then((sequelize) => {
                // Buat akun admin untuk manajemen stok
                user.createAdmin(admin_config.username, admin_config.password, admin_config.email, admin_config.front_name, admin_config.last_name);
                item.initialize();

                console.log('Success initializing database!')
            });
            
            pool.end();
        });

    // Jika menggunakan heroku
    } else {
        let dbURL = 'postgres://' + username + ':' + password + '@' + host + ':' + port + '/' + databaseName + "?sslmode=require";

        sequelize = new Sequelize(dbURL, { 
            logging: false,
            ssl: {
                require: true,
                rejectUnauthorized: false
            },
        });
    
        const user = require('./models/user');

        sequelize.sync({ force: true }).then((sequelize) => {
            user.createAdmin(admin_config.username, admin_config.password, admin_config.email, admin_config.front_name, admin_config.last_name);

            console.log('Success initializing database!')
        });
    }    
};

// membuat koneksi antara webapp dengan database
module.exports.initialize = function(dbSettings){
    let databaseName = dbSettings.databaseName,
        username = dbSettings.username,
        password = dbSettings.password,
        host = dbSettings.host,
        port = dbSettings.port

    // String koneksi database (URL tempat database hidup)
    let dbURL = 'postgres://' + username + ':' + password + '@' + host + ':' + port + '/' + databaseName + "?sslmode=require";

    // Menghidupkan koneksi database
    sequelize = new Sequelize(dbURL, { logging: false, ssl: {
        require: true,
        rejectUnauthorized: false
    } });

    require('./models/user');
    require('./models/item');
    require('./models/cart');
}

module.exports.db = function(){
    return sequelize;
};