const path = require("path");
const {execSync} = require('child_process');
const fs = require("fs");

const is_log = true;

/**
 * 复制文件
 * @param {String} src 源文件路径
 * @param {String} dst 复制后的文件路径
 * @returns 
 */
function copy(src, dst) {
    // 处理文件夹
    if(dst.endsWith("/") || dst.endsWith("\\")){
        fs.mkdirSync(dst, { recursive: true })
        copyFolder(src, dst);
        return ;
    }
    // 处理文件
    const dirname = path.dirname(dst);
    // 创建对应的文件夹
    if (!fs.existsSync(dst)) fs.mkdirSync(dirname, { recursive: true });
    fs.copyFileSync(src, dst);
}

/**
 * 复制文件夹
 * @param {String} source 源文件夹路径
 * @param {String} destination 目标文件夹路径
 */
 function copyFolder(srcDir, desDir) {
    fs.readdir(srcDir, { withFileTypes: true }, (err, files) => {
        for (const file of files) {
            //判断是否为文件夹
            if (file.isDirectory()) {
                const dirS = path.resolve(srcDir, file.name);
                const dirD = path.resolve(desDir, file.name);
                //判断是否存在dirD文件夹
                if (!fs.existsSync(dirD)) {
                    fs.mkdir(dirD, (err) => {
                        if (err) console.log(err);
                    });
                }
                arguments.callee(dirS, dirD);
            } else {
                const srcFile = path.resolve(srcDir, file.name);
                const desFile = path.resolve(desDir, file.name);
                fs.copyFileSync(srcFile, desFile);
            }
        }
    })
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

/**
 * 获取git项目的改变文件列表
 * @param {String} path 
 * @returns {Array}
 */
function getGitRepoChanges(path){
    return new Promise((resolve, reject) => {
        if(!fs.existsSync(path))
            reject("project path is not exists");
        let data = execSync(`cd /D ${path} && git status`).toString();
        resolve(parse(data));
    })
}

/**
 * 在文件浏览器中打开
 * @param {*} path 
 */
function openInExplorer(path){
    execSync(`start explorer ${path}`);
}

module.exports = {
    copy,
    log,
    parse,
    clear,
    getGitRepoChanges,
    openInExplorer
}