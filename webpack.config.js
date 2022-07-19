const itemDescription = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa aperiam optio quaerat quis maiores quae sequi porro assumenda quibusdam sapiente odio cumque delectus ex cum quia adipisci, impedit, ad beatae. Minus, distinctio commodi totam omnis incidunt cumque voluptates hic numquam optio accusantium exercitationem! Deleniti quam repellendus qui assumenda quia quo reiciendis possimus modi laborum! Rerum perspiciatis fugit ducimus totam atque?"


const data = require('./dataset.json')
const path = require('path')
const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;
const filename = (ext) => isDev ?  `[name].${ext}` : `[name].[contenthash].${ext}`
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

let getOptons = (stock)=>{
    let options = [];
    stock.forEach(el=>{
        Object.keys(el).forEach(key=>{
            if(!options.includes(key)){
                options.push(key)
            }
        })
    })
    return options.map(option=>`<option> ${option} </option>`);
}

module.exports ={
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: "./js/index.js",
    output: {
        filename: `./js/${filename('js')}`,
        path: path.resolve(__dirname, 'app')
    },
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, 'app'),
        open: true,
        compress: true,
        hot: true,
        port: 3000,
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            meta: {
                keywords: data.page_meta.meta_keywords,
                description: data.page_meta.meta_description
            },
            title: data.page_meta.title,
            nav: data.nav.map(el => {return `<a class="nav-el" href="${el.href}">${el.text}</a>`}).join(''),
            breadcrumbs: data.breadcrumbs.map(el => {return "<a class=\"breadcrumbs-el\" href=\"" + el.href + "\">" + el.text + "</a>"}).join('<div class=\"breadcrumbs-separator\">></div>'),
            h1: data.page_meta.h1,
            stock: data.stock.map(el => {
                return(`<div class="stock-elem"><img src="./img/${el.image}" alt="${el.title}"><div class="stock-elem-info"><h3>${el.title}</h3><div class="stock-elem-description description">${itemDescription}</div> <div class="stock-elem-tags"><div class="tag">${Object.values(el).join(`</div><div class="tag">`)}</div></div></div><div class="stock-elem-price">${el.price_currency} ${el.price}</div></div>`)
            }).join(""),
            stock_options: getOptons(data.stock),
            page_text: data.page_text.map(el => {return "<" + el.tag + ">" + el.content + "</" + el.tag + ">"}).join(''),
            filename: 'index.html',
            minify: {
                collapseWhitespace: isProd
            },
        }), 
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `./css/${filename('css')}`})
    ],
    module: {
        rules: [
            {
            test: /\.css$/i,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader, 
                    options: {
                        hmr: isDev
                    }
                },
                'css-loader'],
            },
            {
                test: /\.s[ac]ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'img',
                    publicPath: 'img',
                    emitFile: true,
                    esModule: false

                }
            },
        ]      
    }
}




