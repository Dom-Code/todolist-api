"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const logging_1 = __importDefault(require("./config/logging"));
const config_1 = __importDefault(require("./config/config"));
const user_1 = __importDefault(require("./routes/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const allowedList = ['http://localhost:3000', 'http://127.0.0.1:5173', 'https://dom-code.github.io'];
const options = {
    origin: '*'
    // credentials: true,
    // optionsSuccessStatus: 200
};
const NAMESPACE = 'Server';
const router = (0, express_1.default)();
// Connect to Mongo
mongoose_1.default
    .connect(config_1.default.mongo.url, config_1.default.mongo.options)
    .then((result) => {
    logging_1.default.info(NAMESPACE, 'Connected to mongoDB!');
})
    .catch((err) => {
    logging_1.default.error(NAMESPACE, err.message, err);
});
router.use((0, cors_1.default)(options));
router.use((req, res, next) => {
    logging_1.default.info(NAMESPACE, `Method: [${req.method}], URL: [$Preq.url], IP: [${req.socket.remoteAddress}]`);
    res.on(`finish`, () => {
        logging_1.default.info(NAMESPACE, `Method: [${req.method}], URL: [$Preq.url], IP:[${req.socket.remoteAddress}], STATUS: [${res.statusCode}]`);
    });
    next();
});
// parsing request
// injections allows us to send nested json to our API.
router.use(body_parser_1.default.urlencoded({ extended: false }));
router.use(body_parser_1.default.json());
// Rules for our API
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-with, Content-Type, Accept, Authorization,  application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT OPTIONS');
        return res.status(200).json();
    }
    next();
});
// Routes
router.use('/api', user_1.default);
// Error Handling
router.use((req, res, next) => {
    const error = new Error('Not Found');
    return res.status(404).json({
        message: error.message
    });
});
// Server
const httpServer = http_1.default.createServer(router);
httpServer.listen(config_1.default.server.port, () => logging_1.default.info(NAMESPACE, `Serving running on ${config_1.default.server.hostname} : ${config_1.default.server.port}`));
