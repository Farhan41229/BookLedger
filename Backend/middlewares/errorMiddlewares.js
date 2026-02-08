class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message,
    });

    if (err.code==11000) {
        res.status(400).json({
            success: false,
            message: "Duplicate Key Error",
        });
        err = new ErrorHandler(message, statusCode);
    }

    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((val) => val.message);
        res.status(400).json({
            success: false,
            message: messages.join(", "),
        });
        err = new ErrorHandler(message, statusCode);
    }

    if (err.name === "JsonWebTokenError") {
        res.status(400).json({
            success: false,
            message: "Invalid JWT Token",
        });
        err = new ErrorHandler(message, statusCode);
 
 
    }

    if(err.name === "TokenExpiredError") {
        res.status(400).json({
            success: false,
            message: "JWT Token has expired",
        });
        err = new ErrorHandler(message, statusCode);
    }


    if (err.name === "CastError") {
        res.status(400).json({
            success: false,
            message: `Resource not found. Invalid: ${err.path}`,
        });
        err = new ErrorHandler(message, statusCode);
    }

    const errorMiddleware=err.errors ? Object.values(err.errors).map((el) => el.message).join(", ") : err.message;


    return res.status(statusCode).json({
        success: false,
        message: errorMiddleware,
    });
};

export default ErrorHandler;