# 天天淘用户API V1

---
|api    |请求方法   |描述     |
|:------|:---------|:--------|
|/v1/user   |POST   |注册新用户|
|/v1/user/login   |POST     |登陆 |
|/v1/user    |PUT    |修改资料   |
|/v1/user/:account/vip    |GET    |查看会员   |
|/v1/user/:id/vip    |PUT    |解冻/冻结vip   |
|/v1/user/vip    |POST    |升级为vip   |
---
``
## 用户完整版信息 UserInfo

```json
{
  "id": "1",
  "accounr": "15622178496",
  "name": "garven",
  "sex": "男",
  "isVid": 0,
  "orderformId": [1, 2, 3],
  "shoppingcartId": 1
}
```

## 注册新用户

```
POST /v1/user
```

`请求参数`

---
|参数    |含义   |备注     |
|:------|:---------|:--------|
|account   |账号   |必传，为手机号码  |
|name   |用户名   |必传  |
|password   |密码   |必传，[md5加密]  |
|sex   |性别     |必传，0代表男，1代表女 |
---

`返回`

201，新创建的UserInfo

## 登陆

```
POST /v1/user/login
```

`请求参数`

---
|参数    |含义   |备注     |
|:------|:---------|:--------|
|account   |账号   |必传  |
|password    |密码    |必传, [md5加密]   |
---

`返回`

200

## 修改信息

```
PUT /v1/user
```

`请求参数`

---
|参数    |含义   |备注     |
|:------|:---------|:--------|
|name   |用户名   |必传  |
|password   |密码   |必传，[md5加密]  |
|sex   |性别     |必传，0代表男，1代表女 |
---

`返回`

200，新创建的UserInfo

## 升级为会员

```
POST /v1/user/vip
```

`返回`

200

## 冻结/解冻会员 - 管理员

```
PUT /v1/user/:id/vip
```

`请求参数`

---
|参数    |含义   |备注     |
|:------|:---------|:--------|
|isVip   |vip状态   | 必传，0代表冻结，1代表解冻  |
---

`返回`

202

## 查看会员 - 管理员

```
GET /v1/user/:account/vip
```

`请求参数`

account为某个用户的account值，若查全部则传`all`

`返回`

200