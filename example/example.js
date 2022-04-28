const path = require("path");
const cgcf = require('../index')

async function main(){
    const config = require('./config')
    cgcf.log(`total projects: ${config.length}`);
    for(let item of config){
        let project_path = item['project_path'];
        let project_name = item['name'];
        let target_path = item['target_path'];
        cgcf.clear(target_path);
        let res = await cgcf.getGitRepoChanges(project_path);
        console.log(res);
        
        let source_file = "", target_file = "";
        for (let i in res) {
            source_file = path.resolve(project_path, res[i]);
            target_file= path.join(target_path, res[i]);
            cgcf.log(`[${project_name}] copy [${Number(i)+1}]: ${source_file} to ${target_file}`);
            cgcf.copy(source_file, target_file);
        }
        cgcf.log("total files:", res.length);
        cgcf.log("target path:", target_path);
    }
}

main();