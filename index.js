const path = require("path");
const process = require("child_process");
const fs = require("fs");

// git项目路径
const PROJECT_PATH = "D:\\Desktop\\gitFiles\\shop.zhengan-food.com";
// diff文件路径
const CURRENT_PATH = __dirname;
const CHANGED_DESC_NAME = "changed_file.txt";
const DIFF = path.join(CURRENT_PATH, CHANGED_DESC_NAME);
// 复制后的文件路径
const TEMP_PATH = "tmp_files";
const is_log = true;

function copy(src, dst) {
    let dirname = path.dirname(dst);
    // 创建对应的文件夹
    if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true });
    // 不处理文件夹
    if (dst.endsWith("/")) return;
    if (dst.endsWith("\\")) return;
    fs.copyFileSync(src, dst);
}

function log() {
    if (is_log) console.log(...arguments);
}

function main() {
    new Promise((resolve, reject) => {
        // 创建临时的文件
        process.exec(
            `cd ${PROJECT_PATH} && git status > "${DIFF}"`,
            (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }
        );
    })
    .then(() => {
        let diff = fs.readFileSync(DIFF, "utf8").split("\n");
        let res = [];
        diff.forEach((element) => {
            if (element.startsWith("\t")) res.push(element);
        });

        for (let i in res) {
            // 去掉\t
            res[i] = res[i].replace(/\t/g, "");
            // 去掉 modified
            res[i] = res[i].replace(/modified:   /g, "");
            // 去除 ../
            res[i] = res[i].replace(/\.\.\//g, "");
            // 获取真实路径
            res[i] = {
                path: path.resolve(PROJECT_PATH, res[i]),
                _path: res[i],
            };
        }
        log("total files:", res.length);
        let target_path = "";
        for (let i in res) {
            target_path = path.join(CURRENT_PATH, TEMP_PATH, res[i]._path);
            log(`copy [${Number(i)+1}]: ${res[i].path} to ${target_path}`);
            copy(res[i].path, target_path);
        }
    })
    .catch((e) => {
        log(e);
    });
}
main();
