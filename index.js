const path = require('path');
const process =require('child_process');
const fs= require('fs');

// git项目路径
const project_path = 'D:\\Desktop\\gitFiles\\shop.zhengan-food.com\\app';
const current_path = __dirname;
const changed_desc_name = 'changed_file.txt';
// 临时文件路径
const target_file = path.join(current_path,changed_desc_name);
// 复制后的文件路径
const tmp_path = 'tmp_files';
const is_log = true;

function copy(src,dst){
    fs.copyFileSync(src,dst)
}

function log(){
    if(is_log) console.log(...arguments)
}

function main(){
    // 创建临时的文件
    process.exec(`cd ${project_path} && git status > "${target_file}"`)

    let file = fs.readFileSync(target_file, 'utf8').split('\n')
    let res = [];
    file.forEach(element => {
        // if(element.startWith('\t'))
        if(element.startsWith('\t'))
            res.push(element)
    });

    for(let i in res)
    {
        // 去掉\t
        res[i] = res[i].replace(/\t/g,'')
        // 去掉 modified   
        res[i] = res[i].replace(/modified:   /g,'')
        // 获取真实路径
        res[i] = 
        res[i] = {
            path : path.resolve(project_path,res[i]),
            _path : res[i]
        }
    }
    // log(res);
    log('total files:',res.length);
    let target_path = '';
    for(let i in res){
        target_path = path.join(current_path,tmp_path,res[i]._path);
        target_dirname = path.dirname(target_path);
        // 创建文件路径
        if(!fs.existsSync(target_dirname)) fs.mkdirSync(target_dirname,{recursive:true})
        log('copy: ',res[i].path,' to ',target_path);
        copy(res[i].path, target_path);
    }
}
main(); 