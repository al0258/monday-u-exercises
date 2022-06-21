import { validationResult, checkSchema } from 'express-validator';

const sortingOptions = ['A-Z', 'Z-A']

export const validateIdSchema = {
    id: {
        isString: true,
        isLength: {
            errorMessage: 'ID should be 9 characters long.',
            options: { min: 9, max: 9 },
        },
        in: ['params']
    }
};

export const todoSchema = {
    todo: {
        isString: true,
        errorMessage: 'Missing paramater todo',
        in: ['body']
    },
};

// export const todoSchema = {
//     id: {
//         isString: true,
//         isLength: {
//             errorMessage: 'ID should be 9 characters long.',
//             options: { min: 9, max: 9 },
//         },
//         in: ['body']
//     },
//     type: {
//         isString: true,
//         isLength: {
//             errorMessage: 'ID should be 9 characters long.',
//             options: { min: 9, max: 9 },
//         },
//         in: ['body']
//     },
// };

export const getTodosSchema = {
    sortBy: {
        isString: true,
        optional: true,
        isIn: { options: [sortingOptions] },
        errorMessage: `Bad paramater sortBy, expected one of ${sortingOptions.join(',')}`,
        in: ['query']
    },
};

export function validateSchema(schema) {
    const validationMiddleware = checkSchema(schema);
    return async (req, res, next) => {
        await validationMiddleware.run(req);
        const result = validationResult(req);
        if (result.isEmpty()) {
            next();
            return;
        }
        const error = Error(result.array().map(value => value.msg).join());
        error.statusCode = 400;
        next(error);
    };
}