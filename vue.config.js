
module.exports = {
    // 关闭lint严格模式
    lintOnSave:false,
    // 定义webpack的打包配置
    chainWebpack:config =>{
        // 发布模式
        config.when(process.env.NODE_ENV === 'production',config=>{
            config.entry('app').clear().add('./src/main-prod.js')

            config.set('externals',{
                vue:'Vue',
                'vue-router':'VueRouter',
                axios:'axios',
                lodash:'_',
                echarts:'echarts',
                nprogress:'NProgress',
                'vue-quill-editor':'VueQuillEditor'
            })

            config.plugin('html').tap(args=>{
                // 自定义属性
                args[0].isProd = true
                return args
            })
        })
        // 开发模式
        config.when(process.env.NODE_ENV === 'development',config=>{
            config.entry('app').clear().add('./src/main-dev.js')

            config.plugin('html').tap(args=>{
                // 自定义属性
                args[0].isProd = false
                return args
            })
        })
    }
}

