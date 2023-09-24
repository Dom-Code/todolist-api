import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';

const NAMESPACE = 'DB';

const checkTodoId = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Checking if todo exists');

    console.log(req.body);
};

export default checkTodoId;
