const yargs = require('yargs');
const db = require('./app/db');

const argv = yargs
    .command('initialize', 'Create a database for the webapp', {
        'heroku' : {
            description: 'Get ENVIRONMENT setting from heroku'
        }
    })
    .command('start', 'Start webapp', {
        'heroku' : {
            description: 'Get ENVIRONMENT setting from heroku'
        }
    })
    .help()
    .alias('help', 'h')
    .demandCommand()
    .argv;

if(argv._.includes('initialize')){
    const prompt = require('prompt-sync')({ sigint: true });

    check_continue = false;
    while (!check_continue) {
        console.log("Only use for first time setup. This will purge all current data in the database!");
        input = prompt('Do you want to continue? (yes/no) : ');
        check_continue = input == "yes";
        if (input == "no") {
            return;
        }
    }

    // Input untuk login admin pada webapp
    console.log('Enter admin credentials. Use admin login to manage stock.')
    let admin_config = {
        username: prompt('Admin username: '),
        password: prompt('Admin password: ', { echo: '*' }),
        email: prompt('Admin email: '),
        front_name: prompt('Admin front name: '),
        last_name: prompt('Admin last name: '),
    };

    let setting = {};

    if(argv.heroku){
        // Ambil setting dari heroku
        const url = require('url');
        db_connection_string = url.parse(process.env.DATABASE_URL);

        setting.databaseConfig = {};

        setting.databaseConfig.databaseName = db_connection_string.path.replace('/','');
        setting.databaseConfig.host = db_connection_string.hostname;
        setting.databaseConfig.port = db_connection_string.port;
        credential = db_connection_string.auth.split(':');
        setting.databaseConfig.username = credential[0];
        setting.databaseConfig.password = credential[1];
        setting.databaseConfig.defaultDb = db_connection_string.path.replace('/','');

        setting.static_files_dir = process.env.STATIC_DIR;
        setting.port = process.env.PORT || 80;
        setting.secret = process.env.SECRET;
    } else {
        // Ambil setting untuk server local
        const fs = require('fs');
        setting = fs.readFileSync('settings.json');
        setting = JSON.parse(setting);
    }

    // Menambahkan data awal pada database (Data barang, stok)
    db.db_init(setting.databaseConfig, admin_config, (argv.heroku));
}

if(argv._.includes('start')){
    let setting = {};

    if(argv.heroku){
        const url = require('url');
        db_connection_string = url.parse(process.env.DATABASE_URL);

        setting.databaseConfig = {};

        setting.databaseConfig.databaseName = db_connection_string.path.replace('/','');
        setting.databaseConfig.host = db_connection_string.hostname;
        setting.databaseConfig.port = db_connection_string.port;
        credential = db_connection_string.auth.split(':');
        setting.databaseConfig.username = credential[0];
        setting.databaseConfig.password = credential[1];
        setting.databaseConfig.defaultDb = db_connection_string.path.replace('/','');

        setting.static_files_dir = process.env.STATIC_DIR;
        setting.port = process.env.PORT || 80;
        setting.secret = process.env.SECRET;
    } else {
        const fs = require('fs');
        setting = fs.readFileSync('settings.json');
        setting = JSON.parse(setting);
    }

    db.initialize(setting.databaseConfig);

    // Middleware session untuk menyimpan session user (data login)
    const session = require('express-session');
    const SequelizeStore = require('connect-session-sequelize')(session.Store);
    const store = new SequelizeStore({
        db: db.db(),
    });
    store.sync();

    // Middleware passport untuk melakukan verifikasi data login user
    const passport = require('passport');
    require('./app/config/passport')(passport);

    const express = require('express');

    app = express();    
    app.use(session({
        secret: setting.secret,
        resave: false,
        store: store,
        saveUninitialized: false
    }));

    // Middleware untuk menampilkan data static (css, js, image)
    app.use(express.static(setting.static_files_dir));
    app.set('view engine', 'ejs');

    // Middleware untuk menghapuskan cache agar data terbaru ditampilkan
    const nocache = require('nocache');
    app.use(nocache());
    app.set('etag', false);

    // Middleware untuk membaca body dari request untuk form login
    const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: false }));

    // Inisialisasi passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Middleware untuk memasukan data user dan path kedalam session (untuk views login dan header)
    app.use((req, res, next) => {
        res.locals.user = req.user;
        res.locals.current_path = req.path;
        next();
    })

    // Memasukan rute yang tersedia kepada app
    app.use(require('./app/routes'));

    // Jika tidak ada rute valid maka tampilkan halaman error 404
    app.use((_, res) => {
        res.redirect('/404');
    })

    // Menjalankan app pada port yang ditentukan
    app.listen(setting.port);
    console.log(`Server berjalan pada port ${setting.port}.`);
}