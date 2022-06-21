const now = () => new Date().toISOString().replace(/[TZ]/g, ' ').trimEnd();
export default async function logger(req, res, next) {
    const method = req.method.toUpperCase();
    const url = req.url;
    const _t = ` ${method} @ ${url}`;

    console.log(`[${now()}] --> ${_t}`);

    await next();
}