const path = require('path')
const baseTips = require('../middlewares/baseTips')
let Cache = require('../middlewares/cache')
let mysqlModule = require('../middlewares/mysqlModule')
let fsModule = require('../middlewares/fsModule')

/**
 * 添加商品
 */
exports.add = async ctx => {
  const postData = ctx.filteredData
  await mysqlModule.queryConnection('INSERT INTO Goods(name, description, price, date, Category_idCategory) VALUES(?, ?, ?, ?, ?)', [
    postData.name, postData.description, postData.price, postData.date, postData.categoryId
  ])
    .then(async result => {
      await Cache.setDefaultModel('goodsModel')
      ctx.resbody = await Cache.getModel('goodsModel')
    })
    .catch(error => {
      console.log(`添加商品error：${error}`)
      ctx.resbody = baseTips['081']
    })
}

/**
 * 获取商品
 */
exports.get = async ctx => {
  const postData = ctx.filteredData
  let sql = `
    SELECT idGoods, Goods.name, description, price, bigImgSrc, date, Category.name AS category, (SELECT COUNT(idGoods) FROM Goods) AS allCount,
      CONCAT('[', (SELECT GROUP_CONCAT('{id: ', SmImgSrc.idSmImgSrc, ', src: ', SmImgSrc.src, ', base64: ', SmImgSrc.base64, '}') FROM SmImgSrc WHERE Goods.idGoods = SmImgSrc.Goods_idGoods), ']') AS smImg
    FROM Goods INNER JOIN Category ON Goods.Category_idCategory = Category.idCategory
  `
  // 根据id查商品
  if (postData.id) {
    sql = `
      ${sql} AND idGoods = ${postData.id};
    `
  // 根据商品类别查询
  } else if (postData.categoryId) {
    sql = `
      ${sql} AND Goods.Category_idCategory = ${postData.categoryId}
      LIMIT ${postData.start}, ${postData.offset};
    `
  // 只根据名称查询
  } else if (postData.name && !postData.min) {
    sql = `
      ${sql} AND Goods.name = '${postData.name}'
      LIMIT ${postData.start}, ${postData.offset};
    `
  // 根据名称和价格范围来查询
  } else if (postData.name && postData.min) {
    sql = `
      ${sql} AND Goods.name = '${postData.name}' AND Goods.price >= ${postData.min} AND Goods.price <= ${postData.max}
      LIMIT ${postData.start}, ${postData.offset};
    `
  }
  console.log(sql)
  // 查询
  await mysqlModule.queryConnection(sql)
    .then(result => {
      ctx.resbody = {
        'status': 'success',
        'statusCode': 200,
        'data': result,
        allCount: result[0] ? result[0].allCount : 0,
        min: postData.min ? postData.min : 0,
        max: postData.max ? postData.max : 0
      }
    })
    .catch(error => {
      console.log(`查询商品出错：${error}`)
      ctx.resbody = baseTips['082']
    })
}

/**
 * 删除商品
 */
exports.delete = async ctx => {
  const postData = ctx.filteredData
  const id = postData.id
  await mysqlModule.queryConnection(`DELETE FROM Goods WHERE idGoods = ?`, [id])
    .then(async result => {
      await Cache.checkDefaultModel('goodsModel', id)
      ctx.resbody = await Cache.getModel('goodsModel')
    })
    .catch(error => {
      console.log(`删除商品出错：${error}`)
      ctx.resbody = baseTips['082']
    })
}

/**
 * 修改商品
 */
exports.put = async ctx => {
  const postData = ctx.filteredData
  await mysqlModule.queryConnection(`UPDATE Goods SET name = ?, description = ?, price = ?, Category_idCategory = ? WHERE idGoods = ?`,
    [postData.name, postData.description, postData.price, postData.categoryId, postData.id]
  )
    .then(async result => {
      await Cache.checkDefaultModel('goodsModel', postData.id)
      console.log(await Cache.getModel('goodsModel'))
      ctx.resbody = await Cache.getModel('goodsModel')
    })
    .catch(error => {
      console.log(`修改商品出错：${error}`)
      ctx.resbody = baseTips['082']
    })
}

/**
 * 上传图片
 */
exports.addImg = async ctx => {
  const postData = ctx.filteredData
  const filename = postData.file.filename
  const file = postData.file.data
  const type = postData.type.data
  const id = postData.id.data
  // 存到uploads
  await fsModule.writeFile(path.resolve(__dirname, `../uploads/${filename}`), file)
    .catch(error => {
      console.log(`上传图片错误：${error}`)
      ctx.resbody = baseTips['500']
    })
  // 存src到数据库
  if (type === 'smImg') {
    await mysqlModule.queryConnection(`INSERT INTO SmImgSrc(src, Goods_idGoods) VALUES(?, ?)`, [filename, id])
      .then(async result => {
        await Cache.checkDefaultModel('goodsModel', id)
        ctx.resbody = await Cache.getModel('goodsModel')
      })
      .catch(error => {
        console.log(`存放大图src错误：${error}`)
        ctx.resbody = baseTips['500']
      })
  } else if (type === 'bigImg') {
    await mysqlModule.queryConnection(`UPDATE Goods SET bigImgSrc = ? WHERE id = ?`, [filename, id])
      .then(async result => {
        await Cache.checkDefaultModel('goodsModel', id)
        ctx.resbody = await Cache.getModel('goodsModel')
      })
      .catch(error => {
        console.log(`存放小图src错误：${error}`)
        ctx.resbody = baseTips['500']
      })
  }
}
