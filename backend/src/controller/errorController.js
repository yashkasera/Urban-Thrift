const errorController = (err, req, res) =>
    res.status(err.code || 400).send({
        message: err.message || 'Something went wrong',
        name: err.name || 'Bad Request',
        code: err.code || 400,
    });


module.exports = errorController;
