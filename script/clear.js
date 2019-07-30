const fs = require("fs");
const path = require("path");

const DIR = "./dist";

function clear(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) clear(filePath);
        else {
            fs.unlinkSync(filePath);
            console.log("> clear.js deleted " + filePath);
        }
    })
    if (dir != DIR) fs.rmdirSync(dir);
}

console.log("> clear.js clearing dist files");
clear(DIR);
console.log("> clear.js dist files cleared");