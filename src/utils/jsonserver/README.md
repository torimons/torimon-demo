# json-server
- テスト用です

# 使い方
- torimonのルートから
```
$ ./node_modules/.bin/json-server --watch src/utils/jsonserver/db.json
```

# API
- curl，postman，ブラウザ等で試してみてください
```
# マップ一覧
$ http://localhost:3000/maps 
# idを指定して(この例ではid=1)マップデータを取得
$ http://localhost:3000/maps/1
```