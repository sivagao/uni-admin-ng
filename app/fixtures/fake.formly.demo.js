{
    "formOptions": {
        "key": "autoNgform",
        "submitCopy": "Save"
    },
    "formFields": [{
        "label": "电子邮箱",
        "key": "email",
        "type": "email",
        "placeholder": "janedoe@gmail.com",
        "defaultVal": "ghld@126.com",
        "validate": {
            "required": true,
            "maxlength": 10
        },
        "msg": {
            "help": "这里是普通的help文档",
            "xrequired": "必填项",
            "maxlength": "最长长度超过了",
            "pattern": "pattern不正确"
        },
        "attr": {
            "dynamicAttr": "value-for"
        }
    }, {
        "label": "textarea控件",
        "key": "textarea",
        "type": "textarea",
        "attr": {
            "text-area-elastic": true,
            "rows": "4",
            "cols": "50"
        },
        "validate": {
            "required": true,
            "maxlength": 20,
            "minlength": 4
        },
        "msg": {
            "help": "这里是textarea的help文档",
            "xrequired": "必填项",
            "maxlength": "最长长度超过了"
        }
    }, {
        "type": "select",
        "label": "select控件",
        "key": "vehicle",
        "info": "请选择交通工具",
        "options": [{
            "name": "Car",
            "value": "car",
            "group": "inefficiently"
        }, {
            "name": "Helicopter",
            "group": "inefficiently"
        }, {
            "name": "Sport Utility Vehicle",
            "group": "inefficiently"
        }, {
            "name": "Bicycle",
            "group": "efficiently"
        }, {
            "name": "Skateboard",
            "group": "efficiently"
        }]
    }, {
        "type": "password",
        "label": "Password",
        "key": "password"
    }, {
        "type": "checkbox",
        "label": "Check this here",
        "key": "checkbox1"
    }, {
        "type": "hidden",
        "default": "secret_code",
        "key": "secretCode"
    }]
}