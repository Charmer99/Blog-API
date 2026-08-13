// errorHandler.js

function errorHandler(err, req, res, next) {
    console.error(err);


    if(err.code === "P2002"){
        return res.status(409).json({
            message: "A record with this value already exists"
        })
    }
    
    if(err.code === "P2025"){
        return res.status(404).json({
            message: "Record not found"
        })
    }

    const statusCode = err.status || 500;

    res.status(statusCode).json({
        message:
            process.env.NODE_ENV === "production" 
                ? "Something went wrong"
                : err.message,
    })
}

module.exports = errorHandler