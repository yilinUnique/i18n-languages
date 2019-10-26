/**
 * 功能： 点击新增tab栏按钮事件
 * @param addName 新增页签的名称 例如 查询1 (string)
 * @param tabWrapper 各自页面包裹tab栏模块的元素(如：$('.tabs-wrapper'))
 * @param tabLinkName tab栏a标签的href值 以及tab栏对应内容的id值(string)
 */
function addNewTab(addName,tabWrapper,tabLinkName){
    // console.log($("." + tabWrapper + " .top-tab"))
    // console.log(tabLinkName)

    // console.log(tabWrapper.children().children().children(".top-tab"),111)
    // console.log(tabWrapper.find(".top-tab"),111)

    var new_tab;
    var new_content;
    var newContentId;
    var newId;

    if(tabWrapper.find(".top-tab").length > 19){//设置查询tab上限为20
        // alert("最多支持20个页签查询！")
        var alertContent = "最多支持20个"+addName+"页签!";
        alertModal(1,alertContent);
        return;
    }

    // var step = 100;    
    // $("." + tabWrapper + " .query-tab").scrollLeft(step += 100)

    //新增tab栏部分
    var currentTabNum = tabWrapper.find(".top-tab").length + 1;
    newContentId = tabLinkName + currentTabNum;//a链接对应的tab的id值
    newId = "#"+tabLinkName + currentTabNum;//a链接的href值
    new_tab = tabWrapper.find(".top-tab:first").clone();
    tabWrapper.find(".query-tab").append(new_tab);
    new_tab.attr('data-index', currentTabNum);
    new_tab.children(tabWrapper.find(".linked-tag")).attr('href',newId);//a的href跟着下面的content的id而变化
    new_tab.addClass("active").siblings().removeClass('active');
    tabWrapper.find(".top-tab:last .tab-number").text(addName + currentTabNum);//新增的tab按钮文字

    //新增tab栏对应的内容部分
    new_content = tabWrapper.find(".query-item:first").clone();
    tabWrapper.find(".tab-content").append(new_content);
    new_content.attr('id', newContentId);
    new_content.attr('content-index', currentTabNum);
    new_content.addClass("active").siblings().removeClass('active');
    tabWrapper.find(".query-item").css("opacity","1");
}

/**
 * 功能： 点击删除tab栏按钮事件
 * @param obj this对象
 * @param addName 新增页签的名称 例如 查询1 (string)
 * @param tabWrapper 各自页面包裹tab栏模块的元素(如：$('.tabs-wrapper'))
 * @param tabLinkName tab栏a标签的href值 以及tab栏对应内容的id值(string)
 */
function removeOneTab(obj,addName,tabWrapper,tabLinkName){
    if(tabWrapper.find(".top-tab").length == 1){//标签仅剩一个，不处理
        return;
    }
    var currentRemoveIndex = $(obj).parent().parent().attr('data-index');
    if(currentRemoveIndex == 1){//如果active在查询1上面，前面没有其他项，单独处理
        //如果当前点击的remove-icon 父级如果有active这个类，将active赋予下一个元素
        var nextIndex = Number($($(obj).parent().parent().next()).attr('data-index'));
        if($($(obj).parent().parent()).hasClass('active')){
            //tab active操作
            $($(obj).parent().parent().next()).addClass('active').siblings().removeClass('active');
            
            //当前需要加active的data-index值
            tabWrapper.find(".query-item").removeClass('active');
            tabWrapper.find(".query-item:eq(" + 1 + ")").addClass('active');
        }
    }
    // e.stopPropagation();
    //阻止事件冒泡和默认事件，之前不加阻止的时候，点击关闭标签3，可能active就跳标签1上去了而不是标签2，前三个标签互动时出错。
    event.stopPropagation();
    event.preventDefault();
    tabWrapper.find(".query-item").css("opacity","1");//防止闪现

    //如果当前点击的remove-icon 父级如果有active这个类，将active赋予上一个元素
    var prevIndex = Number($($(obj).parent().parent().prev()).attr('data-index'));
    if($($(obj).parent().parent()).hasClass('active')){
        //tab active操作
        $($(obj).parent().parent().prev()).addClass('active').siblings().removeClass('active');
        
        //当前需要加active的data-index值
        var newPrevIndex = prevIndex - 1;
        tabWrapper.find(".query-item").removeClass('active');
        tabWrapper.find(".query-item:eq(" + newPrevIndex + ")").addClass('active');
        // console.log($(".query-item:eq(" + newPrevIndex + ")"),newPrevIndex,111111);
    }

    //删除当前tab 以及对应的content
    var content_index = $(obj).parent().parent().attr('data-index');
    var activeTabIndex = "#"+tabLinkName + content_index;
    $(activeTabIndex).remove();
    $(obj).parent().parent().remove();
    
    //tab栏删除 标签值减1
    var currentTabIndex;
    var newContentIndex;
    //对应的data-index,#queryItem,content-index,id也要改变

    //遍历$(".top-tab .tab-number"),给其赋新的标签值，给$(".top-tab)赋新的索引值
    var currentTopTab = tabWrapper.find(".top-tab .tab-number");
    for(var j = 0; j < currentTopTab.length; j++){
        currentTabIndex = Number(j + 1);
        $(currentTopTab[j]).text(addName + currentTabIndex);
        newId = "#"+tabLinkName + currentTabIndex;//a链接的href值
        $(currentTopTab[j]).parent().attr('href',newId);
        $(currentTopTab[j]).parent().parent().attr('data-index',currentTabIndex);
    }

    //遍历$(".query-item"),给其赋新的索引值
    var changedQueryItem = tabWrapper.find(".tab-content").children();
    for(var k = 0; k < changedQueryItem.length; k++){
        newContentIndex = Number(k + 1);
        newContentId = tabLinkName + newContentIndex;//a链接对应的tab的id值
        $(changedQueryItem[k]).attr('id', newContentId);
        $(changedQueryItem[k]).attr('content-index', newContentIndex);
    }
}

/**
 * 功能： 点击回到上一个tab栏按钮事件
 * @param tabWrapper 各自页面包裹tab栏模块的元素(如：$('.tabs-wrapper'))
 */
function turnToLastTab(tabWrapper){
    var currentActiveIndex = Number(tabWrapper.find(".query-tab .active").attr("data-index"));//设置的data-index是从1开始的
    if(currentActiveIndex == 1){
        var alertContent = "已经是第一个页签了！";
        alertModal(1,alertContent);
        return;
    }
    var lastIndex = currentActiveIndex - 2;
    tabWrapper.find(".query-tab .top-tab:eq(" + lastIndex + ")").addClass('active').siblings().removeClass('active');
    tabWrapper.find(".tab-content .query-item:eq(" + lastIndex + ")").addClass('active').siblings().removeClass('active');

    // var step = 100;
    // $("." + tabWrapper + " .query-tab").scrollLeft(step -= 100)
}

/**
 * 功能： 点击回到下一个tab栏按钮事件
 * @param tabWrapper 各自页面包裹tab栏模块的元素(如：$('.tabs-wrapper'))
 */
function turnToNextTab(tabWrapper){
    var currentActiveIndex = Number(tabWrapper.find(".query-tab .active").attr("data-index"));//设置的data-index是从1开始的
    //判断如果在active最后一项 return；如果active在第一项且length为1 return
    var tabLength = tabWrapper.find(".top-tab").length;
    if(currentActiveIndex >= tabLength){
        var alertContent = "已经是最后一个页签了！";
        alertModal(1,alertContent);
        return;
    }
    var nextIndex = currentActiveIndex;
    tabWrapper.find(".query-tab .top-tab:eq(" + nextIndex + ")").addClass('active').siblings().removeClass('active');
    tabWrapper.find(".tab-content .query-item:eq(" + nextIndex + ")").addClass('active').siblings().removeClass('active');

    // var step = 100;
    // $("." + tabWrapper + " .query-tab").scrollLeft(step += 100)
}