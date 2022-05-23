// 实现这个项目的构建任务
const { src, dest, parallel, series, watch } = require('gulp')
// parallel 任务可以不按顺序执行
// series 任务按照顺序去执行
const del = require('del')
const browserSync = require('browser-sync')
// 创建一个开发服务器
const bs = browserSync.create()
// 小技巧：自动加载所有安装的插件，不用再单独引用
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()
// 文件中的数据信息。在模版引擎工作的时候需要插入到对应的位置。可以放任意的数据。
const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}
// js
const myelins = () => {
  return src(['src/assets/scripts/*.js'])
  .pipe(plugins.eslint({
    rules: {
      // 要求使用 let 或 const 而不是 var
      'no-var': 'warn',
    },
    globals: [
        'jQuery',
        '$'
    ],
    envs: [
        'browser'
    ]
  }))
  .pipe(plugins.eslint.format())
}
const mysasslint = () => {
  return src(['src/assets/styles/*.scss'])
  .pipe(plugins.sassLint())
  .pipe(plugins.sassLint.format())
  .pipe(plugins.sassLint.failOnError())
}
// 样式编译
const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    // sass插件：将sass文件转换成css文件。按照完全展开的格式生成代码
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    // 输出的目标位置
    .pipe(dest('temp'))
    // 以流的方式向浏览器推
    .pipe(bs.reload({ stream: true }))
}
// js文件编译
const script = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
     // babel插件：将es6转换为es5, 如果不传presets: ['@babel/preset-env']，会导致转换无效
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}
// 页面模版 html 编译
const page = () => {
  return src('src/*.html', { base: 'src' })
    // swig插件：将定义的数据传递到模版页中。配置网页中的数据。
    .pipe(plugins.swig({ data, defaults: { cache: false } })) //defaults: { cache: false }： 防止模板缓存导致页面不能及时更新
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}
// 图片文件转换
const image = () => {
  // **: 通配表示所有的文件。
  return src('src/assets/images/**', { base: 'src' })
    // .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}
// 字体文件转换
const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    // 可以压缩的的就启用imagemin插件，不可以使用的就不压缩。
    .pipe(dest('dist'))
}
// 其他文件编译：
const extra = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}
// 热更新开发服务器 - 监视文件变化
const serve = () => {
  // 文件修改之后自动编译，自动同步到浏览器。监视的是src下面的文件。
  // watch： src下面的代码修改之后自动执行编译任务，浏览器的效果得到及时更新。
  // 这里可能会因为swig模版引擎缓存的机制导致页面不会辩护，此时需要额外将swig选项中的cache设置为false。具体的参考代码的81行
  // 监视样式文件的变化，文件的代码修改之后，就执行相应的任务。 style：是执行的任务
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)
  watch('src/*.html', page)
  // 开发阶段不用监视图片，字体，和其他的文件，减少构建的次数，提高构建效率。
  // bs.reload：文件发生变化，自动更新浏览器。
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload)
  // 初始化web服务器的相关配置
  bs.init({
    notify: false, // 启动成功之后页面的提示
    port: 3030, // 端口号
    open: true, // 启动服务器是否打开浏览器
    // 修改dist文件的代码，刷新浏览器，可以在浏览器看到最新的效果。是dist目录下的文件，不是src文件下的文件。
    server: {
      // 打开的网页的根目录
      baseDir: ['temp', 'src', 'public'],
      // 重定向node_modules目录的文件。
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}
// 文件引用：处理代码中引入的问题：例如：代码中引入node_modules下面的css。在开发任务中可以这样引用，但是打包上线之后会出问题。
const useref = () => {
  return src('temp/*.html', { base: 'temp' })
    .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
    // 压缩代码html js css
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    })))
    .pipe(dest('dist'))
}
// 组合任务：style, script, page这三个任务，让这三个任务同时开始执行，提高效率。
const compile = parallel(style, script, page)
const develop = series(compile, serve)
// 清除dist，temp两个文件夹
// 每次build之前，清除上次打包的文件
const clean = () => {
  return del(['dist', 'temp'])
}
// 打包：上线之前执行的任务
const build = series(
  clean,
  parallel(
    series(compile, useref),
    image,
    font,
    extra
  )
)
// lint任务：语法检查
const lint = parallel(myelins, mysasslint)
// 开发任务
const start = series(build, serve)
module.exports = {
  clean, // yarn gulp clean
  build, // yarn gulp build
  develop, // yarn gulp develop
  lint, // yarn gulp lint
  start, // yarn gulp start
}
