const path = require('path')
let Cache = require('../middlewares/cache')
let mysqlModule = require('../middlewares/mysqlModule')
let fsModule = require('../middlewares/fsModule')

/**
 * 添加商品
 */
exports.add = async postData => {
  await mysqlModule.queryConnection('INSERT INTO Goods(name, description, price, date, Category_idCategory) VALUES(?, ?, ?, ?, ?)', [
    postData.name, postData.description, postData.price, postData.date, postData.Category_idCategory
  ])
    .then(async result => {
      await Cache.setDefaultModel('goodsModel')
    })
    .catch(error => {
      console.log(`添加商品error：${error}`)
    })
}

/**
 * 获取商品
 */
exports.get = async postData => {
  let sql = `
    SELECT idGoods, Goods.name, description, price, bigImgSrc, date,
      (SELECT GROUP_CONCAT('{id: ', SmImgSrc.idSmImgSrc, ', src: ', SmImgSrc.src, ', base64: ', SmImgSrc.base64, '}') FROM SmImgSrc WHERE Goods.idGoods = SmImgSrc.Goods_idGoods) AS smImg
    FROM Goods INNER JOIN Category ON Goods.Category_idCategory = Category.idCategory
  `
  // 只根据名称查询
  if (postData.name && !postData.min) {
    sql = `
      ${sql} AND WHERE Goods.name = ${postData.name}
    `
  // 根据名称和价格范围来查询
  } else if (postData.name && postData.min) {
    sql = `
      ${sql} AND Goods.name = ${postData.name} AND Goods.price >= ${postData.min} AND Goods.price <= ${postData.max} 
    `
  }
  // 分页
  sql = `
    ${sql} LIMIT ${postData.start}, ${postData.offset}
  `
  // 查询
  await mysqlModule.queryConnection(sql)
    .then(result => {
      Cache.setModel('tmpModel', result)
    })
    .catch(error => {
      console.log(`查询商品出错：${error}`)
    })
}

/**
 * 删除商品
 */
exports.delete = async postData => {
  const id = postData.id
  await mysqlModule.queryConnection(`DELETE FROM Goods WHERE idGoods = ?`, [id])
    .then(async result => {
      await Cache.checkDefaultModel('goodsModel')
    })
    .catch(error => {
      console.log(`删除商品出错：${error}`)
    })
}

/**
 * 修改商品
 */
exports.put = async postData => {

}

/**
 * 上传图片
 */
exports.addImg = async postData => {
  const filename = postData.file.filename
  const file = postData.file.data
  const type = postData.type.data
  const id = postData.id.data
  // 存到uploads
  await fsModule.writeFile(path.resolve(__dirname, `../uploads/${filename}`), file)
    .catch(error => {
      console.log(`上传图片错误：${error}`)
    })
  // 存src到数据库
  if (type === 'smImg') {
    await mysqlModule.queryConnection(`INSERT INTO SmImgSrc(src, Goods_idGoods) VALUES(?, ?)`, [filename, id])
      .then(async result => {
        await Cache.checkDefaultModel('goodsModel')
      })
      .catch(error => {
        console.log(`存放大图src错误：${error}`)
      })
  } else if (type === 'bigImg') {
    await mysqlModule.queryConnection(`UPDATE Goods SET bigImgSrc = ? WHERE id = ?`, [filename, id])
      .then(async result => {
        await Cache.checkDefaultModel('goodsModel')
      })
      .catch(error => {
        console.log(`存放小图src错误：${error}`)
      })
  }
}
