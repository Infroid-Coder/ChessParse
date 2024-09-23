const fs = require("fs");
const path = require("path");

function read(filePath = ""){
    if(fs.existsSync(filePath) && fs.statSync(filePath).isFile() && path.extname(filePath) == ".json"){
        let fileCont = fs.readFileSync(filePath,{"encoding":'utf-8'});
        let parsed = JSON.parse(fileCont);
        return parsed;
    }
}

function write(filePath,level,indexOrKey,value){
    if(fs.existsSync(filePath) && fs.statSync(filePath).isFile() && path.extname(filePath) == ".json"){
        if(level == 0){
            if(typeof value === "object"){
                fs.writeFileSync(filePath,JSON.stringify(value),{"encoding":"utf-8"});
            } else{
                console.error("Error: Value is not convertable to JSON.")
            }
        } else{
            let fileCont = read(filePath);
            if(value){
                fileCont[indexOrKey] = value;
            }
            fs.writeFileSync(filePath,JSON.stringify(fileCont),{"encoding":"utf-8"});
        }
    }
}

module.exports = {
    read,write
}