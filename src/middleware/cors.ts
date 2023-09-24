import cors from 'cors';

const allowedList = ['http://127.0.0.1:5173'];

const options: cors.CorsOptions = {
    // origin: allowedList
    origin: '*'
};

const CorsOps = () => {
    return cors(options);
};

export default CorsOps;
