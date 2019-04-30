var fs = require("fs");
var path =require('path');
function copyFile(pattern){
  console.log('--------开始读取文件：'+pattern.from+'--------');
  var fs = require('fs');
  fs.readFile(pattern.from, 'utf-8', function(err, data) {
    console.log('--------文件读取结束--------');
    if (err) {
      console.log("读取失败");
    } else {
      writeFile(data, pattern.to)
      // return data;
    }
  });
}

function writeFile(data, outpath){
  fs.writeFile(outpath,data,'utf8',function(error){
    if(error){
      throw error;
    }else{
      console.log("文件已保存至："+outpath);
    }
  });
}

copyFile({
  from: path.resolve(__dirname, '../dist/index.html'),
  to: path.resolve(__dirname, '../index.html')
});
