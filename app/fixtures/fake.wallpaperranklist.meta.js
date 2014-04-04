{
    "key": "wallpaperRanklist",
    "val": "壁纸排行榜",
    "icon": "fa-flag",
    "type": "APPLICATION",
    "meta": {
        "IntroOptions": {
            "steps": [{
                "element": ".col-md-3",
                "intro": "点击输入关键词添加相应的资源"
            }, {
                "element": "#step4",
                "intro": "拖动block完成排序",
                "position": "right"
            }, {
                "element": "#step4",
                "intro": "鼠标hover在图片上300ms后有preview效果",
                "position": "right"
            }, {
                "element": "#step4",
                "intro": "在block的右上角落完成删除",
                "position": "right"
            }, {
                "element": "#step4",
                "intro": "点击最下方的保存按钮存下数据",
                "position": "right"
            }]
        },
        "hideBreadcrumb": true,
        "hideContentNavBar": true,
        "typeaheadTemplateUrl": "wallpapersRanlistSearch.html",
        "batchActions": [{
            "name": "批量删除选中",
            "func": "deleteBatchHandler"
        }, {
            "name": "批量发送到首页TEST",
            "func": "sendToHome"
        }],
        "actions": [{
            "name": "保存",
            "func": ""
        }]
    },
    "children": [{
        "key": "RANKLIST_AUSLESS",
        "val": "精选",
        "icon": "fa-flag",
        "type": "RESOURCE",
        "meta": {
            "layout": "inline-block",
            "inlineAdd": true,
            "actions": [{
                "name": "删除",
                "func": "deleteHandler"
            }, {
                "name": "发送到首页",
                "func": "sendToHome"
            }],
            "batchActions": [{
                "name": "批量删除选中ZZK",
                "func": "deleteBatchHandler"
            }, {
                "name": "批量发送到首页TEST",
                "func": "sendToHome"
            }]
        }
    }]
}