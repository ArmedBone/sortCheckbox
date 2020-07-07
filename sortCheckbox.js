
let SortCheckBox = (function(){
    let cloneEl = null,activeEl=null,activeSort=null,SortList=[];
    /**
     * 防抖
     * @param func
     * @param wait
     * @returns {function(...[*]=)}
     */
    function debounce(func, wait) {
        let timeout;
        return function () {
            let context = this;
            let args = arguments;
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args)
            }, wait);
        }
    }

    const createDom = (tpl) => {
        let container = document.createElement('div');
        container.innerHTML = tpl;
        return container.childNodes[0];
    };
    document.addEventListener('mouseup',function (event) {
        event.preventDefault();
        event.stopPropagation();
        if(cloneEl)document.body.removeChild(cloneEl);
        cloneEl = null;
        activeEl = null;
        if(activeSort)activeSort.change();
        activeSort = null;
    })

    document.addEventListener('mousemove',function (event) {
        if(cloneEl){
            cloneEl.style.opacity = 0.5;
            cloneEl.style.display="block";
            cloneEl.style.position="absolute";
            cloneEl.style.top = (document.documentElement.scrollTop+event.clientY)+'px';
            cloneEl.style.left = (event.clientX)+'px';
        }
    })

    function extend(t,o) {
            for ( let k in o) {
                if(t[k] == null)t[k] =o[k];
            }
            return t;
    }

    const defaults = {
        data:[],
        selected:[],
        change:new Function()
    }

    function SortCheckBox(element,options){
        SortList.push(this)
        options = extend(options,defaults);
        let _this = this;
        activeEl = null;
        this.targetEl = null;
        this.SortCheckBox =typeof element=="string"?document.querySelector(element):element;
        this.SortCheckBox.classList.add("sort-checkbox-wrapper");
        this.selected=options.selected;
        this.change = debounce(function () {
            _this.valueChange(options.change)
        },300);
        this.setData(options.data,this.selected);
    }
    SortCheckBox.prototype.getInputList = function(){
       return this.SortCheckBox.querySelectorAll("input[type='checkbox']");
    }
    SortCheckBox.prototype.bindEvents = function(){
        let _this = this;
        this.list.forEach(function (box) {
            box.querySelector("input[type='checkbox']").addEventListener("mousedown",function (event) {
                event.stopPropagation();
            })
            /**
             * 注入选择结果
             */
            box.querySelector("input[type='checkbox']").addEventListener("change",function (event) {
                _this.change();
            })
            box.addEventListener('mousedown',_this._start.bind(_this));
            box.addEventListener("mouseenter",_this._sort.bind(_this));

        })
    }
    SortCheckBox.prototype.valueChange=function(callback){
        _this = this;
        let selected = [];
        this.getInputList().forEach(function (item,index) {

            if(item["checked"]){
                selected[index]=item.value
            };
        })
        callback(selected);
    }
    SortCheckBox.prototype._start= function (event) {
        event.preventDefault();
        event.stopPropagation();
        activeSort = this;
        activeEl = event.currentTarget;
        cloneEl = activeEl.cloneNode(true);
        cloneEl.style.display="none";
        document.body.append(cloneEl);
    }

    SortCheckBox.prototype._sort=function (event) {
        event.stopPropagation();
        event.preventDefault();
        targetEl =event.target;
        if(!activeEl || targetEl.parentNode!=activeEl.parentNode)return;
        if(activeEl && targetEl!=activeEl){
            let activeIndex = this.list.indexOf(activeEl);
            let targetIndex = this.list.indexOf(targetEl);
            let targetNext = targetEl.nextElementSibling;
            let activeNext= activeEl.nextElementSibling;
            if(activeIndex<targetIndex){
                if(targetNext){
                    targetEl.parentNode.insertBefore(activeEl,targetNext)
                }else{
                    targetEl.parentNode.appendChild(activeEl)
                }
            }else{
                if(activeNext){
                    targetEl.parentNode.insertBefore(activeEl,targetEl);
                }else{
                    targetEl.parentNode.appendChild(targetEl);
                }
            }
            this.list = Array.prototype.slice.call(this.SortCheckBox.querySelectorAll("label"));
        }
    }
    SortCheckBox.prototype.setData = function (data,selected) {
        let _this = this;
        this.SortCheckBox.innerHTML = "";
         this.list=data.map(function (item) {
            let nodeHtml = `<label><input type="checkbox" value="${item.value}" />${item.text}</label>`;
            let node = createDom(nodeHtml);
            _this.SortCheckBox.appendChild(node);
            return node;
        })
        this.getInputList();
        this.getInputList().forEach(function (input) {
            selected.forEach(function (v) {
                if(v==input.value)input["checked"]="checked";
            })
        })
        this.bindEvents();
    }
    return SortCheckBox;
})()




