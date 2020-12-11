
# introduction

（英語に疲れたので日本語で）  
本プロジェクトはTypescriptでFastifyを構築する際に必要な環境ファイルなどを最低限準備可能とすることを目的にしたプロジェクトです。  
  
あくまでboilerplateであり、本家のドキュメントに勝るものはありませんのでご使用の際は以下をお読みください。  
  
https://github.com/fastify/fastify/blob/master/docs/TypeScript.md  

# run scripts

- yarn start
    - トランスパイル後のソース実行
- yarn dev
    - typescriptのままで実行テスト実行する
- yarn build
    - トランスパイルの実行
- yarn lint
    - src以下のtsファイルを一括でlint実行
- yarn test
    - 作者が基本的にjestを使用しているためjestになっていますがデフォルトでは構成含め一才プロジェクト内に設定が存在しません。適宜いい感じに設定してご使用ください。
# installation

## 1. プロジェクトのクローン

省略します

## 2. パッケージインストール

```bash
$ yarn install
```

初期では以下パッケージを使用しています。

### dependences

```
 - app-root-path
 - dayjs
 - fastify
 - fastify-cors
 - fastify-helmet
 - js-yaml
 - winston
 - winston-daily-rotate-file
```

- corsは許可することの方が多いため含めていますが、不要な方は除外してください。
- loggerはfastify組み込みのloggerではなく、winstonを利用しています。
  - 上記に合わせてログローテート用の winston-daily-rotate-file を含めています。
- また、dotenvやconfigjsは含めておりませんが、どちらにしても使うことの多いjs-yamlは導入しております。(不要な方は削除してください。)

### devDependences
```
 - @types/app-root-path
 - @types/cors
 - @types/gulp-nodemon
 - @types/gulp-plumber
 - @types/jest
 - @types/node
 - @types/winston
 - @typescript-eslint/eslint-plugin
 - @typescript-eslint/parser
 - @typescript-eslint/typescript-estree
 - eslint
 - eslint-config-prettier
 - eslint-plugin-prettier
 - gulp
 - gulp-nodemon
 - gulp-plumber
 - gulp-typescript
 - gulp-util
 - jest
 - prettier
 - rimraf
 - ts-node-dev
 - typescript
```

- 主にFastifyの型定義、typescriptのトランスパイル用パッケージを使用しています。
- トランスパイルにはgulpを利用しており、フォルダ構成をそのまま出力するようにしております。
  - トランスパイルに関する項目についてはトランスパイル設定項目にて説明します。

# use

## ソース構成

ソースコードのファイル、フォルダ構成は以下の通りです。  
  
```
./src
├── logger
│   └── main.ts
├── routes
│   ├── health.ts
│   └── webhook.ts
└── server
    └── app.ts
```

### (server) app.ts

メインファイルです。  
起動時の環境変数 **PORT** が指定されていれば指定ポートを、なければ **3000** を起動ポートとして割り当てます。  
メインクラスである **Instansce** でモジュールやルートの設定、読み込みを行っています。  
  
もしモジュールを追加される場合は initialize関数 に設定を行ってください。  
（追加方法はinitialize関数を参照のこと）  

### (routes) health.ts

ルートハンドラその１です。  
本ファイルの記述はfastifyを使用する上でもっともベーシックな方法で、引数のみを渡してハンドリングするような場合に使用するため、  
主に小規模プロジェクトの際に有効な方法です。  
  
`health.ts` ではclass内の関数を `main/app.ts` 読み込ませるように実装しています。

### (routes) webhook.ts

ルートハンドラその２です。  
本設定では一つのエンドポイントに対して複数のエンドポイントを設定可能とするための記述方法です。  
設定（利用）方法について以下に記載します。  
  
1 - 新たに設定するハンドラのファイルを作成し、defaultでexportする関数を作成します  
2 - 作成した関数内に以下の引数を受け取るよう指定してください  

```
/** server = instance, opts = shorthands option, next => error handler */
(server, opts, next) => {

}
```

3 - サブパスを設定したハンドラを作成します。（health.tsで記述した方法と同様）
4 - エラー処理を記述する場合はnext()の中で処理。
5 - app.tsのconstructor内に、 `server.register` を記述し、引数に以下を設定してください

```
({{1で作成したファイルのインポート名}}, {prefix: '{{エンドポイント}}'});
```

もう少し綺麗に書く方法があるかもしれませんが現状調べている余裕がなかったのでこの形になっていますが、  
もしお分かりの方がいれば教えてください、  

### logger

loggerはデフォルトで `LocalLogger` をエクスポートしています。  
利用方法は以下です。  
  
```
import Logger from './logger/main';
const logger = new Logger('sample-app");
``` 
  
上記の通り、インスタンス生成時の引数に与えた文字列はアプリケーション名としてログに出力されます。

# transapile

トランスパイルはgulpを使用しており、設定ファイルは `gulpfile.js` です。  
デフォルトでは、cloneした際にも含まれている以下のディレクトリがトランスパイル対象です。  
  
- controller
- interactor
- logger
- presenter
- routes
- server
- types
- valueobject
  
もしフォルダ構成を変更される場合は、以下をgulpfile.jsに追記してください。  
  
```
/** タスクの追加 */
gulp.task("{{folder_name}}", () => {
  return gulp
    .src(["src/controller/**/*.ts", "!src/**/__tests__/*.test.ts"], {
      since: gulp.lastRun("controller")
    })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest("dist/controller"));
});

/** 追記した場合はフォルダ名の追加、削除した場合は削除してください */
gulp.task(
  "build",
  gulp.series(
    "clean",
    "controller",
    "interactor",
    "logger",
    "presenter",
    "routes",
    "server",
    "types",
    "valueobject",
    "folder_name" // <= 追記した
  )
);

/** watchで自動トランスパイルする際の監視対象設定 */
gulp.task(
  "default",
  gulp.parallel("nodemon", callback => {
    gulp.watch("src/controller/**/*.ts", gulp.series("controller"));
    gulp.watch("src/interactor/**/*.ts", gulp.series("interactor"));
    gulp.watch("src/logger/**/*.ts", gulp.series("logger"));
    gulp.watch("src/presenter/**/*.ts", gulp.series("presenter"));
    gulp.watch("src/routes/**/*.ts", gulp.series("routes"));
    gulp.watch("src/server/**/*.ts", gulp.series("server"));
    gulp.watch("src/types/**/*.ts", gulp.series("types"));
    gulp.watch("src/valueobject/**/*.ts", gulp.series("valueobject"));
    gulp.watch("src/folder_name/**/*.ts", gulp.series("folder_name")); // <= 追記した
    callback();
  })
);
```
