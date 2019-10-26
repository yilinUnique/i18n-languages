/**
 * @file
 * @author csy
 * @desc jquery.i18n
 * @date 2019-06-21
 * @last modified by csy
 */
/* eslint-disable*/ //do not use eslint to check the codes

/**
 * jquery-i18n使用说明，以component.html和markperson_detail.html为例。
 * (trying to use several kinds of jquery i18n plugins, this one is better than others) 
 * document address：https://github.com/wikimedia/jquery.i18n
 */

//step1. html引入语言依赖包
/* 
<script src="../../lib/i18n/jquery.i18n.js"></script>
<script src="../../lib/i18n/jquery.i18n.messagestore.js"></script>
<script src="../../lib/i18n/jquery.i18n.language.js"></script>
<script src="../../js/component/i18n_language.js"></script> 
*/

//step2. html添加data-i18n属性
/*
***命名规则Attention！！！(因为平台情况繁多，要分不同类型进行赋值)
    1.如果是text命名时就加-text(grid-system-text);需要title就加-title(accessional-title)...
        <h1 class="page-header grid-system" data-i18n="grid-system-text">栅格系统</h1>
    2.如果有多个类型，名称之间用逗号隔开(下面函数做了处理，直接加就可以)
        <h1 class="page-header" data-i18n="accessional-text,accessional-title">辅助类</h1>
    3.上面两种情况是针对html页面的，js里面命名可以不加上面的后缀
*/

//step3. i18n_json/language.json文件添加字段(为了注释 所以写了多余的几行文字隔开)
/*
zh-CN
{
    "公共组件-start":"*****注释", 
    "grid-system-text": "栅格系统",//这个就是text
    "accessional-title": "辅助类",//这个就是title
    "公共组件-end":"*****注释",
}

en-US
{
    "公共组件-start":"*****注释",
    "grid-system-text": "Grid system",
    "accessional-title": "Accessional Class",
    "公共组件-end":"*****注释",
}
*/

//step4. js部分添加代码
/*
//i.页面更新语言翻译 doI18n作为updateText的回调 下面的代码搬到自己的js就可以
updateText(doI18n);

//ii.js中需要翻译的直接改$.i18n("文本内容") 
    如：alertModal(1, $.i18n("chooseGroupTip"));
*/

/**
 * 设置语言类型： 默认为中文
 */
var g_i18nLanguage;

if (localStorage.getItem("userLanguage")) {
    g_i18nLanguage = localStorage.getItem("userLanguage");
} else {
    g_i18nLanguage = "zh-CN";
    localStorage.setItem("userLanguage", g_i18nLanguage);
}

/**
 * 页面执行加载执行
 */
$(function(){
    /*将语言选择默认选中缓存中的值*/
    $("#language option[value="+ g_i18nLanguage +"]").attr("selected",true);

    /*选择语言 */
    $("#language").bind('change', function() {
        var language = $(this).children('option:selected').val();
        localStorage.setItem("userLanguage", language);
    });
});

/**
 * 每个页面初始化，过程是第一步$.i18n().load(json,language)，然后$.i18n("text")生效
 * @param {*} doI18n 页面调用这个函数处理html中的字段
 */
function updateText(doI18n) {//引入语言文件
    var i18n = $.i18n();
    i18n.locale = localStorage.getItem("userLanguage") ? localStorage.getItem("userLanguage") : g_i18nLanguage;
    // console.log(i18n.locale);

    var parseStorage = JSON.parse(sessionStorage.getItem(i18n.locale));//语言对应的json
    if(parseStorage){
        i18n.load(parseStorage, i18n.locale).done(doI18n ? doI18n : console.log("callback does not exist"));
    }
    else{
        console.log("language storage does not exist")
    }
}

/**
 *  更新页面中的所有带data-i18n属性的翻译
*/
function doI18n() {
    var elements = $('[data-i18n]');
    elements.each(function(index, val) {
        var messageKey = $(val).attr('data-i18n');
        var multiKeyArr = messageKey.split(",");//考虑到某些标签可能需要加多个属性 如同时加title,placeholder等等
        //遍历数组 匹配字符串关键字
        for(var k = 0; k < multiKeyArr.length; k++){
            var txt = $.i18n(multiKeyArr[k]);//翻译后的文本
            var text = "-text",
                html = "-html",
                title = "-title",
                alt = "-alt",
                placeholder = "-placeholder",
                value = "-value";
            if(multiKeyArr[k].indexOf(text) > -1 )
            {
                $(elements[index]).text(txt);//text
            }
            if(multiKeyArr[k].indexOf(html) > -1 )
            {
                $(elements[index]).html(txt);//html
            }
            if(multiKeyArr[k].indexOf(title) > -1 )
            {
                $(elements[index]).attr("title", txt);//title
            }
            if(multiKeyArr[k].indexOf(alt) > -1 )
            {
                $(elements[index]).attr("alt", txt);//alt
            }
            if(multiKeyArr[k].indexOf(placeholder) > -1 )
            {
                $(elements[index]).attr("placeholder", txt);//placeholder
            }
            if(multiKeyArr[k].indexOf(value) > -1 )
            {
                $(elements[index]).val(txt);//value
            }
        }
    });
}

/**
 *  监听语言值缓存变化更新翻译; 用于组件页面component.html
*/
window.addEventListener('storage',function(e){
    if(e.key == "userLanguage"){//判断语言值是否发生改变
        watchLanguageChange();
    }
});

/**
 *  用于本页面设置缓存 本页面监听；重写localStorage的方法，抛出自定义事件(用于index.html)
 */
var orignalSetItem = localStorage.setItem;

localStorage.setItem = function(key,newValue){
    var setItemEvent = new Event("setItemEvent");
    setItemEvent.newValue = newValue;
    window.dispatchEvent(setItemEvent);
    orignalSetItem.apply(this,arguments);
}

window.addEventListener("setItemEvent", function (e) {
    watchSelfPage();
});
