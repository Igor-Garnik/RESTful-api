const handlers = {};
handlers.sample = (data, callback) => {
    callback(406, {name: 'sample handler'});
};
handlers.notFound = (data, callback) => {
    callback(404)
};

const router = {
    sample: handlers.sample
};

module.exports.handlers = handlers;
module.exports.router = router;
