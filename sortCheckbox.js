
let SortCheckBox = (function(){
    let cloneEl = null,activeEl=null;
    document.addEventListener('mouseup',function (event) {
        event.preventDefault();
        event.stopPropagation();
        if(cloneEl)document.body.removeChild(cloneEl);
        cloneEl = null;
        activeEl = null;
    })

    document.addEventListener('mousemove',function (event) {
        if(cloneEl){
            cloneEl.style.opacity = 0.5;
            cloneEl.style.display="block";
            cloneEl.style.position="absolute";
            cloneEl.style.top = (event.clientY-6)+'px';
            cloneEl.style.left = (event.clientX-6)+'px';
        }
    })

    function SortCheckBox(elementName){
        activeEl = null;
        this.targetEl = null;
        this.SortCheckBox = document.querySelector(elementName);
        this.list = Array.prototype.slice.call(this.SortCheckBox.querySelectorAll("label"));
        this.bindEvents();
    }

    SortCheckBox.prototype.bindEvents = function(){
        let _this = this;
        this.list.forEach(function (box) {
            box.querySelector("input[type='checkbox']").addEventListener("mousedown",function (event) {
                event.stopPropagation();

            })
            box.addEventListener('mousedown',_this._start.bind(_this));
            box.addEventListener("mouseenter",_this._sort.bind(_this));

        })
    }

    SortCheckBox.prototype._start= function (event) {
        event.preventDefault();
        event.stopPropagation();
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
    return SortCheckBox;
})()




