const vscode = require('vscode');
const { tinypngInit } = require('./vscode-tinypng')

/**
 * 插件被激活时触发，所有代码总入口
 * @param {*} context 插件上下文
 */
exports.activate = function(context) {
    
    // 图片压缩右键注册
    context.subscriptions.push(vscode.commands.registerCommand('extension.compression', function (param) {
        const folderPath = param.fsPath; // 选中的绝对路径
        tinypngInit(folderPath, (data) => {
            console.log(data)
        })
    }))
};

/**
 * 插件被释放时触发
 */
exports.deactivate = function() {
	console.log('您的扩展“vscode-plugin-demo”已被释放！')
};