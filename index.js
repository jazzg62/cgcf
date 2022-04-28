const path = require("path");
const process = require("child_process");
const fs = require("fs");

const is_log = true;

/**
 * 复制文件
 * @param {String} src 源文件路径
 * @param {String} dst 复制后的文件路径
 * @returns 
 */
function copy(src, dst) {
    let dirname = path.dirname(dst);
    // 创建对应的文件夹
    if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true });
    // 不处理文件夹
    if (dst.endsWith("/")) return;
    if (dst.endsWith("\\")) return;
    fs.copyFileSync(src, dst);
}

/**
 * 记录日志
 */
function log() {
    if (is_log) console.log(...arguments);
}

/**
 * 解析diff文本
 * @param {*} statusText 
 * @returns {Array}
 */
function parse(statusText){
    let arr = statusText.split("\n");
    let res = [];
    arr.forEach((el)=>{
        if(el.startsWith("\t")){
            res.push(el);
        }
    })
    for (let i in res) {
        // 去掉\t
        res[i] = res[i].replace(/\t/g, "");
        // 去掉 modified
        res[i] = res[i].replace(/modified:   /g, "");
        // 去除 ../
        res[i] = res[i].replace(/\.\.\//g, "");
    }
    return res;
}

/**
 * 清空路径下的文件
 * @param {String} path 
 */
function clear(path){
    if(!fs.existsSync(path))
        return ;
    log('clear path:', path);
    try{
        fs.rmSync(path, { recursive: true, force: true });
    }catch(e){
        log(e);
    }
}

function getGitRepoChanges(path){
    return new Promise((resolve, reject) => {
        if(!fs.existsSync(path))
            reject("project path is not exists");
        let ps = process.exec(
            `cd /D ${path} && git status `,
            (error) => {
                if (error) reject(error);
            }
        );
        ps.stdout.on('data',function(data){
            resolve(parse(data));
        })
    })
}

module.exports = {
    copy,
    log,
    parse,
    clear,
    getGitRepoChanges
}