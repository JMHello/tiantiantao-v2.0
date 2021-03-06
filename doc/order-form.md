# 天天淘订单API V1

---
|api    |请求方法   |描述     |
|:------|:---------|:--------|
|/v1/orderform/:id   |GET   |查找订单  |
|/v1/orderform/:id   |DELETE     |删除订单  |
|/v1/orderform    |POST    |生成订单   |
|/v1/orderform/:id    |PUT    |结算订单(用户)／执行订单(管理员)   |
---

## 订单完整信息 OrderFormInfo

```
{
  "idGoods": 1,
  "user": "garven"
  "phone": 15622178496,
  "address": "广工",
  "fare": 5,
  "total": 167,
  "recipients": "garven",
  "postcodes": "521511",
  "status": "未执行"
}
```

## 查找订单

```
GET /v1/orderform/:id
```

`请求参数`

id: 订单id

`返回`

200

## 删除订单

```
DELETE /v1/orderform/:id
```

`请求参数`

id：订单id

`返回`

204 无返回信息

## 生成订单

```
POST /v1/shoppingcart
```

`请求参数`

---
|参数    |含义   |备注     |
|:------|:---------|:--------|
|phone   |手机号码   |必传, 数值  |
|address   |收货地址   |必传  |
|recipients   |收件人   |必传  |
|postcodes   |邮编   |必传, 数值  |
---

`返回`

201 返新的OrderFormInfo

## 结算订单(用户)／执行订单(管理员)

```
PUT /v1/orderform/:id
```

`返回`

202

---

[返回API目录](./api.md)