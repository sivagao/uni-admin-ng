# Uni-Admin by Angular.js and API

## list API，item API， meta API， miscAPI

 - list API的注意点是很好的支持分页
 - meta API是返回资源的描述信息 （可以结合起来）
 - misc API是返回相关辅助信息（譬如）

## Resource
结合资源的数据List API，资源的描述meta API （还有其他的miscAPI）
UI 呈现：
 - Resource Table
  - TableBar (checkAll，AddResource[ResourceEditor]，BatchActionBtnList)
  - ResourceRow * N
  - Pager

### BatchActionFn: 需要完全的DIY支持
batchDelete，（不选除了selectedIdList外的参数）
e.g.: - offlineBatchAction -> fn(selectedIdList[ids]) 

### ResourceRow：
 - ResourceField * N
 - ResourceRowViewField
:select - 是否选择 ：用于批量操作
:ItemActionBtnList：删除，编辑[ResourceEditor]，ItemActionFn: 推送到首页等)


ItemActionFn: 需要完全的DIY支持
e.g.: sendToCategoryPage  需要除了selectedID外的参数， 如类目名称，在类目的位置。 支持widget dropdown select etc等等

### ResourceEditor：
展现形式：popup，page（详情页）
功能是： 
 - 每个field有的逻辑和视图（同下）
 - 数据回填 detail with data binding
 - Watcher(把field关联起来的，譬如验证，譬如协同填写等)
 - Action: 
  - 自定义的ItemActionFn 
  -通用的 save， update，delete 等等功能
 - Extra:
  - 外键链接相关资源数据（譬如一个剧集的有很多渠道信息等 ）


### ResourceField
 - 一个Field有ViewValue，有ModelValue，有Formatter，Parser
 - 一个Field有inline Editor, （如tagInput，如FileUploader，如select，如date picker等）
 - 一个Field有Trigger（preview？如url支持预览等）
 - 一个Field有Validator

### Field Type:
When you create a Form class, the most important part is defining the fields of the form. Each field has custom validation logic, along with a few other hooks. 帮助渲染widget和widget交互时候依赖的信息如：
help_text filed的提示信息（field inline-help或表头的tip）, label, field的human title（表头，或者field label）
error_message和validator配合（前者提供规则的出错信息，后者提供验证规则）
label, help_text, || error_message, validators, localize || initial, widget, 
类型如下：
 - Boolean, NullBooleanField, 
 - CharField,EmailField,IPAddressField,RegexField,SlugField,URLField
 - Choice, TypedChoice, MultiChoiceField, TypedMultipleChoiceField
 - DateField,DateTimeField, TimeField, DateRangeField, DateTimeRangeField
 - IntField, NumberField, DecimalField, PercentageField, FloatField
 - FileField, ImageField, VideoField, AudioField,Mutl<Type>


### Widget: 
每种widget有默认的preview|view行为， 有各自的inline editor, 有相应的validator，等
分类如下：
Widgets handling input of text
TextInput,NumberInput,EmailInput,URLInput,PasswordInput
DateInput,DateTimeInput,TimeInput
Textarea
HiddenInput

Selector and checkbox widgets
CheckboxInput,Select,NullBooleanSelect,SelectMultiple,RadioSelect,CheckboxSelectMultiple

File upload widgets
FileInput,ClearableFileInput

Composite widgets
MultipleHiddenInput,SplitDateTimeWidget,SplitHiddenDateTimeWidget,SelectDateWidget


![截图展示 - model-list](http://img.wdjimg.com/uni-admin/QQ20140416-1.png)
![截图展示 - home](http://img.wdjimg.com/uni-admin/QQ20140419-1.png)
![截图展示 - pickup](http://img.wdjimg.com/uni-admin/QQ20140419-2.png)
