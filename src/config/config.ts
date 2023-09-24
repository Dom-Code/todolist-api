import dotenv from 'dotenv';

dotenv.config();

const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    maxPoolSize: 50,
    autoIndex: false,
    retryWrites: false
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'Dom';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'AxZnYngPWMVIyI6n';
const MONGO_HOST = process.env.MONGO_URL || 'collaby.vpcdj2o.mongodb.net/TodoListDB';

const MONGO = {
    host: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    options: MONGO_OPTIONS,
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 4000;
const SERVER_ACCESS_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 10;
const SERVER_REFRESH_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 60;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'colabingissuer';
const SERVER_ACCESS_TOKEN_SECRET =
    process.env.SERVER_ACCESS_TOKEN_SECRET || '5c6617c6946328e4a540e0724af5c0ac6776a5b3318fba5190e019aacfb503f47aa5bf95d1dd687f5fba1a0c4159a550102c81a930453952330f0bb275d2434d';
const SERVER_REFRESH_TOKEN_SECRET =
    process.env.SERVER_REFRESH_TOKEN_SECRET || '55d8ae87e8c4e31caa56c96f32e4e3292e1b5475eda584dc87b87ce096c069cba5c6d1a990794677ee725b82c13acc53dced483e2f68a5501d15c1964f85a381';

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    ACCESS_TOKEN: {
        expireTime: 60,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_ACCESS_TOKEN_SECRET
    },
    REFRESH_TOKEN: {
        expireTime: 60,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_REFRESH_TOKEN_SECRET
    }
};

const config = {
    mongo: MONGO,
    server: SERVER
};

export default config;
