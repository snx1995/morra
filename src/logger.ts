function format(lv: string, tag: string, msg: any) {
    const now = new Date();
    return `[${formatDate(now)}][${lv}] <${tag}> ${msg}`;

    function formatDate(date: Date) {
        const y = date.getFullYear();
        const M = date.getMonth() + 1;
        const d = date.getDate();
        const h = date.getHours();
        const m = date.getMinutes();
        const s = date.getSeconds();
        const f = (x: any) => x < 10 ? '0' + x : x;

        return `${y}-${f(M)}-${f(d)} ${f(h)}:${f(m)}:${f(s)}`;
    }
}

const logger = {
    info(tag: string, msg: any) {
        console.log(format("INFO", tag, msg));
    },
    debug(tag: string, msg: any) {
        console.log(format("DEBUG", tag, msg));
    },
    error(tag: string, msg: any) {
        console.log(format("ERROR", tag, msg));
    }
}

module.exports = logger;