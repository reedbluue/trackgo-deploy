import http from 'http';
export const server = http.createServer((req, res) => {
    if (req.url == '/alive') {
        res.statusCode = 200;
        return res.end();
    }
    else {
        res.statusCode = 404;
        return res.end();
    }
});
