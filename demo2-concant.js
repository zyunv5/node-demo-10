// 使用 fs.readdir 读取目录，重点其回调函数中files对象
// fs.readdir(path, callback);

/**
 * path, 要读取目录的完整路径及目录名；
 * [callback(err, files)], 读完目录回调函数；err错误对象，files数组，存放读取到的目录中的所有文件名
 */
//目录读写能力
const fs=require('fs')
const path=require('path')
// const files=[]
// const walk = function (path) {
//   fs.readdirSync(path).forEach(function (file) {
//     const newPath = path + "/" + file;
//     const stat = fs.statSync(newPath);

//     if (stat.isFile()) {
//       if (/\.js/.test(file)) {
//         files.push(file);
//       }
//     } else if (stat.isDirectory) {
//       walk(newPath);//递归调用
//     }
//   });
// };

// walk(".");
// console.log(files.join("\r\n"));

//合并文件
const exists=filePath=>fs.existsSync(filePath)
const jsonPath=process.argv[2]//node app 127.0.0.1 7001  这时候通过.argv [2] 得到IP，argv[3]得到端口，更方便我们修改配置。

if(!jsonPath){
  console.log('没有传JSON目录参数')
  process.exit(1)//1是退出
}

const rootPath=path.join(process.cwd(),jsonPath)//process.cwd()返回的是当前Node.js进程执行时的工作目录
//遍历所有文件
const walk=(path)=>fs.readdirSync(path).reduce((files,file)=>{
  const filePath=path+'/'+file
  const stat=fs.statSync(filePath)

  if(stat.isFile()){
    if(/(.*)\.(json)/.test(file)){
      return files.concat(filePath)
    }
  }
  return files
},[])

//合并文件内容
const mergeFileData=()=>{
  const files=walk(rootPath);

  if(!files.length) process.exit(2)

  const data=files.filter(exists).reduce((total,file)=>{
    const fileData=fs.readFileSync(file)
    const basename=path.basename(file,'.json')

    let fileJson

    try {
      fileJson=JSON.parse(fileData)
    } catch (error) {
      console.log('读出错误',file)
      console.log(error);      
    }
    total[basename]=fileJson;
    return total
  },{})

  fs.writeFileSync('./json/data.json',JSON.stringify(data,null,2))
}

mergeFileData()
//node app.js ./json