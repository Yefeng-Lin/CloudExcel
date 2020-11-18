//云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: "excel-5g6pzqnf3d96eb30"
})

const db = cloud.database()
const userjhl = db.collection('userjhl')
const _ = db.command

//操作excel用的类库
const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let list = event.list
    //1,定义excel表格名
    let dataCVS = event.filename + '.xlsx'
    //2，定义存储数据的
    let alldata = [];
    let row = ['姓名', '手机号', '地址','数量']; //表属性
    alldata.push(row);
 
    for (let i = 0; i < list.length; i++) {
      let arr = [];
     //这里对应的是你的表里面的属性的字段，不要照抄，会报错的
      arr.push(list[i].name);
      arr.push(list[i].phone);
      arr.push(list[i].address);
      arr.push(list[i].number);
      alldata.push(arr)
    }
    //3，把数据保存到excel里
    var buffer = await xlsx.build([{
      name: "mySheetName",
      data: alldata
    }]);
    //4，把excel文件保存到云存储里
    return await cloud.uploadFile({
      cloudPath: dataCVS,
      fileContent: buffer, //excel二进制文件
    })
 
  } catch (e) {
    console.error(e)
    return e
  }
}
