const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer') // 发起命令行交互询问
const ejs = require('ejs') // 模板引擎
inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message:'Project name?'
  }
]).then(rst => {
  console.log(rst);
  const tempDir = path.join(__dirname, 'templates')
  // 目标目录
  const destDir = process.cwd()
  // 将模板下的文件全部转换到目标目录
  fs.readdir(tempDir, (err, files) => {
    if (err) throw err
    files.forEach(file => {
      // 通过模板引擎渲染文件
      ejs.renderFile(path.join(tempDir, file), answer, (err, result) => {
        if(err) throw err
        // 将结果写入到目标目录
        fs.writeFileSync(path.join(destDir, file), result)
      })
    })
  })
})
