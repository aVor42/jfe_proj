let HtmlElemId = function(htmlElemObj) {  
    this.htmlElemObj = htmlElemObj;
    this.set = (value) =>{
        if(!value){
            return;
        }

        if(this.htmlElemObj.element){
            this.htmlElemObj.element.id = value;
            this.value = null;
        }
        else{
            this.value = value;
        }
    };
    this.get = () =>{
        return this.htmlElemObj.element && this.htmlElemObj.element.id && !this.value? this.htmlElemObj.element.id: this.value;
    };
    this.empty = () => {
        this.value = null;
        this.htmlElemObj.element.removeAttribute("id");
    };
    /*
    return {
        set: (value) =>{
            if(!value){
                return;
            }

            if(this.htmlElemObj.element){
                this.htmlElemObj.element.id = value;
                this.value = null;
            }
            else{
                this.value = value;
            }
        },
        get: () =>{
            return this.htmlElemObj.element? this.htmlElemObj.element.id: this.value;
        },
        empty: () => {
            this.value = null;
            this.htmlElemObj.element.removeAttribute("id");
        }
    };
    */
};

class HtmlElem{ 
    constructor(id){
        this.id =  new HtmlElemId(this);

        if(id){
            let element = document.getElementById(id);
            if(element){
                this.element = element;
            }
            this.id.set(id);
        }
    }

    create(name){
        this.tryInitElem();
        if(this.isExists()){
            let warnText = `HtmlElem.create: Элемент с id = ${this.id.get()} уже существовал. ` + 
            "Создания не производилось, HtmlElem инициализирован существовавшим элементом.";
            console.warn(warnText);
        }
        else{
            this.element = document.createElement(name);
            this.id.set(this.id.get());
        }
        
        return this;
    }

    setElement(element){
        if(element && element instanceof HTMLElement){
            this.element = element;
            this.id.set(this.id.get());
        }

        return this;
    }

    getElement(){
        this.tryInitElem();
        return this.element;
    }

    append(child){
        this.tryInitElem();
        if(child instanceof HtmlElem){
            this.element.append(child.element);
        }
        if(child instanceof HTMLElement){
            this.element.append(child);
        }
    }

    addClass(className){
        this.tryInitElem();
        this.element.classList.add(className);
    }

    addClasses(classNames){
        this.tryInitElem();
        let list = this.element.classList;
        list.add.apply(list, classNames);
    }

    removeClass(className){
        this.tryInitElem();
        this.element.classList.remove(className);
    }

    addAttribute(name, value){
        this.tryInitElem();
        this.element.setAttribute(name, value);
    }

    addAttributes(attributes){
        this.tryInitElem();
        for(let name of Object.keys(attributes)){
            this.addAttribute(name, attributes[name]);
        }
    }

    isExists(){
        this.tryInitElem();
        return !!this.element;
    }

    isExistsOnDocumnent(){
        return !!document.getElementById(this.id.get());
    }

    tryInitElem(){
        let id = this.id.get();
        if(!this.element && id){
            let element = document.getElementById(id);
            if(element){
                this.element = element;
            }
        }
    }
}

class Spinner2{
    constructor(spinnerId, circleCount){
        this.spinnerId = spinnerId;
        this.defaultCirclesCount = 5;
        this.circleCount = circleCount? circleCount: this.defaultCirclesCount;
    }

    create(){
        let loader = new HtmlElem().create("div");
        loader.addClass("loader");

        for(let i = 0; i < this.circleCount; i++){
            let circle = new HtmlElem().create("div");
            circle.addClass("circle");
            loader.append(circle);
        }

        let spin = new HtmlElem().create("div");
        spin.addClass("spinner");
        spin.append(loader);

        let pageloader3 = new HtmlElem().create("div");
        pageloader3.addClass("pageloader3");
        pageloader3.append(spin);

        let column = new HtmlElem().create("div");
        column.addClass("col-lg-12");
        column.append(pageloader3);

        let preloader = new HtmlElem().create("div");
        preloader.addClasses(["row", "preloader"]);
        preloader.append(column);

        let spinner = new HtmlElem(this.spinnerId).create("div");
        spinner.append(preloader);

        return spinner.element;
    }

    clear(){

    }
}

class Spinner{
    constructor(id, spinnerSizeClass){
        this.id = id;
        this.spinnerSizeClass = spinnerSizeClass;
    }

    getElement(){
        let container = new HtmlElem(this.id).create("div");
        container.addClass("spinner-container");
        if (this.spinnerSizeClass){
            container.addClass(this.spinnerSizeClass);
        }

        let testDiv = new HtmlElem().create("div");
        testDiv.addClass("spinner");
        container.append(testDiv);

        return container.getElement();
    }
}




class Spinner3{
    constructor(id, circlesCount){
        this.id = id;
        this.circlesCount = circlesCount;
    }

    getElement(){
        let container = new HtmlElem(this.id).create("div");
        container.addClass("spinner-container");

        let spinnerW = new HtmlElem().create("div");
        spinnerW.addClass("spinner-container-stretch-w");
        container.append(spinnerW);

        let spinnerRatioW = new HtmlElem().create("div");
        spinnerRatioW.addClass("spinner-container-ratio-w");
        spinnerW.append(spinnerRatioW);
        
        let radius = 10;
        let animateTimeMs = 3500;

        
        let getTranslateByXY = (x, y) => {
            return `translate(${getTransformPercent(x)}%, ${getTransformPercent(-y)}%)`
        }

        let getTransformPercent = (position) => {
            let centerSideProcent = 0;
            let endSideProcent = 50 - radius;
            let lengthProcent = endSideProcent - centerSideProcent;
            let procentByDiameter = lengthProcent * 100 / (radius * 2);
            return (procentByDiameter * position).toFixed(2);

        }

        let genAngle = 2 * Math.PI;
        let dAngle = genAngle / this.circlesCount;
        let length = 1;

        let dTime = animateTimeMs / this.circlesCount / 2;

        for(let i = 0; i < this.circlesCount; i++){
            let circle = new HtmlElem().create("div");
            circle.addClass("spinner-circle");
            let circElement = circle.getElement();
            let getBeginCeneter = () =>{
                let centerPerscent = 50;
                return (centerPerscent - radius) + "%";
            }
            circElement.style.height = radius * 2 + "%";
            circElement.style.width = radius * 2 + "%";
            circElement.style.top = getBeginCeneter();
            circElement.style.left = getBeginCeneter();

            let angle = dAngle  * i;
            let startAnimateTime = dTime * i;
            /* animation: 1s linear -0.153846s infinite normal none running spinner-line-fade-quick; */
            let x = Math.cos(angle) * length;
            let y = Math.sin(angle) * length
            circElement.style.transform = getTranslateByXY(1, 0);
            circElement.style.animation = `${animateTimeMs}ms linear ${-startAnimateTime}ms infinite normal none running spinner-circle`;
            spinnerRatioW.append(circle);
        }


        return container.getElement();
    }
}

class SpinnerSize extends Spinner3{
    constructor(id, circlesCount, sizeClass){
        super(id, circlesCount);
        this.sizeClass = sizeClass;
    }

    getElement(){
        let sizeContainer = new HtmlElem(this.id + "-size-container").create("div");
        sizeContainer.addClass("spinner-size-container");
        let spinnerSize = new HtmlElem(this.id + "-size").create("div");
        spinnerSize.addClass(this.sizeClass);
        spinnerSize.append(super.getElement());
        sizeContainer.append(spinnerSize);

        return sizeContainer.getElement();
    }
}

class SpinnerSmall extends SpinnerSize{
    constructor(id, circlesCount){
        super(id, circlesCount, "spinner-container-small");
    }
}

class SpinnerMedium extends SpinnerSize{
    constructor(id, circlesCount){
        super(id, circlesCount, "spinner-container-medium");
    }
}

class SpinnerLarge extends SpinnerSize{
    constructor(id, circlesCount){
        super(id, circlesCount, "spinner-container-large");
    }
}

class Modal{
    constructor(id){  
        this.id = id;
    }

    getOverlay(){
        let div = new HtmlElem(this.id + "-overlay").create("div");
        div.addClasses(["jfe-overlay", "jfe-hidden"]);
        return div;
    }

    getModal(){
        let section = new HtmlElem(this.id).create("section");
        section.addClasses(["jfe-verse-modal", "jfe-hidden"]);
        return section;
    }

    fill(){
        let modal = this.getModal();
        // В потомках надо заполнить эту модалку
    }

    show(){
        let body = document.getElementsByTagName("body")[0];

        let modalsBody = new HtmlElem("jfe-modals");
        if(!modalsBody.isExistsOnDocumnent()){
            modalsBody.create("div");
            body.append(modalsBody.getElement());
        }        

        let modalsContainer = new HtmlElem("jfe-modals-container");
        if(!modalsContainer.isExistsOnDocumnent()){
            modalsContainer.create("div");
            modalsBody.append(modalsContainer.getElement());
        }

        let overlay = this.getOverlay();
        if(!overlay.isExistsOnDocumnent()){
            modalsContainer.append(overlay.getElement())
        }

        let modalElement = this.getModal();
        if(!modalElement.isExistsOnDocumnent()){
            modalsContainer.append(modalElement.getElement())
        }
        
        if(modalElement.isExistsOnDocumnent()){
            this.clear();
        }
        
        overlay.removeClass("jfe-hidden");
        modalElement.removeClass("jfe-hidden");

        this.fill();
    }

    hide(){
        let overlay = this.getOverlay();
        let modalElement = this.getModal();

        overlay.addClass("jfe-hidden");
        modalElement.removeClass("jfe-verse-modal");
        modalElement.addClass("jfe-hidden");
    }

    clear(){
        let modal = new HtmlElem(this.id);
        modal.getElement().innerHTML = "";
    }

    refresh(){
        this.clear();
        this.fill();
    }
}

const modalBtnTypes = {
    action: { id: 1 }
}

const modalColorModes = {
    info: {
        headerClasses: ["jfe-verse-modal-header", "jfe-verse-default"], 
        bodyClasses: ["jfe-verse-modal-body"],
        footerClasses: ["jfe-verse-modal-footer", "jfe-verse-default", "pull-right"],
        titleClasses: ["jfe-verse-modal-title"],
        primaryBtnClasses: ["jfe-verse-btn", "jfe-verse-btn-success"]
    },
    danger: {
        headerClasses: ["jfe-verse-modal-header", "jfe-verse-danger"], 
        bodyClasses: ["jfe-verse-modal-body"],
        footerClasses: ["jfe-verse-modal-footer", "jfe-verse-default", "pull-right"],
        titleClasses: ["jfe-verse-modal-title"],
        primaryBtnClasses: ["jfe-verse-btn", "jfe-verse-btn-danger"]
    },
    primary: {
        headerClasses: ["jfe-verse-modal-header", "jfe-verse-primary"], 
        bodyClasses: ["jfe-verse-modal-body"],
        footerClasses: ["jfe-verse-modal-footer", "jfe-verse-default", "pull-right"],
        titleClasses: ["jfe-verse-modal-title"],
        primaryBtnClasses: ["jfe-verse-btn", "jfe-verse-btn-success"]
    }
}

class VerseModal extends Modal{
    constructor(id, colorMode){
        super(id);
        this.colorMode = colorMode;
    }

    getTitle(){
        let h4 = new HtmlElem().create("h4");
        h4.addClasses(this.colorMode.titleClasses);
        return h4; 
    }

    getContent(){
        
    }

    getFooterButtons(){
        return [

        ];
    }

    getBody(){
        let body = new HtmlElem(this.id + "-body").create("div");
        body.addClasses(this.colorMode.bodyClasses);

        let content = this.getContent();
        if(content){
            body.append(content);
        }

        return body;
    }

    getCloseHeadButton(){
        let button = new HtmlElem().create("button");
        button.getElement().textContent = "×";
        button.addAttribute("type", "button");
        button.addClass("jfe-verse-modal-header-close");
        let modal = this;
        button.getElement().addEventListener("click", (e) => {
            modal.clear();
            modal.hide();
        })
        return button;
    }

    getHeader(){
        let header = new HtmlElem(this.id + "-header").create("div");
        header.addClasses(this.colorMode.headerClasses);
        let closeButton = this.getCloseHeadButton();
        header.append(closeButton);
        let titleElement = this.getTitle();
        header.append(titleElement);
        
        return header;
    }

    getFooter(){
        let footer = new HtmlElem(this.id + "-footer").create("div");
        footer.addClasses(this.colorMode.footerClasses);

        let buttons = this.getFooterButtons();
        for(let button of buttons){
            footer.append(button);
        }

        return footer;
    }

    fill(){
        let header = this.getHeader();
        let body = this.getBody();
        let footer = this.getFooter();

        let modal = this.getModal();
        modal.append(header);
        modal.append(body);
        modal.append(footer);
    }
}

class SimpleVerseConfirmModal extends VerseModal{
    constructor(id, title, text, confirmBtnText, colorMode){
        super(id, colorMode);
        this.title = title? title: "Подтвердите действие";
        this.text = text? text: "Вы уверены?";
        this.confirmBtnText = confirmBtnText? confirmBtnText: "Ок";
        this.colorMode = colorMode? colorMode: modalColorModes.info;
    }

    getTitle(){
        let h4 = new HtmlElem().create("h4");
        h4.addClasses(this.colorMode.titleClasses);
        h4.getElement().textContent = this.title
        return h4;
    }

    getContent(){
        let container = new HtmlElem(this.id + "-content").create("div");
        container.addClass("jfe-verse-modal-content");
        let textNode = new HtmlElem().create("p");
        textNode.getElement().textContent = this.text;
        container.append(textNode);

        return container;
    }

    getFooterButtons(){
        let modal = this;

        let confirmBtn = new HtmlElem(this.id + "-confirm-btn").create("button");
        confirmBtn.addClasses(this.colorMode.primaryBtnClasses);
        confirmBtn.getElement().textContent = this.confirmBtnText;
        confirmBtn.getElement().addEventListener("click", (e) => {
            modal.onConfirm();
        })

        let closeBtn = new HtmlElem(this.id + "-close-btn").create("button");
        closeBtn.addClasses(["jfe-verse-btn", "jfe-verse-btn-default"]);
        closeBtn.getElement().textContent = "Закрыть";
        closeBtn.getElement().addEventListener("click", (e) => { 
            modal.clear(); 
            modal.hide();
        })

        return [closeBtn, confirmBtn];
    }

    onConfirm(){
        
    }
}

class FieldDependEngine{
    constructor(dependent, dependencies){
        // зависимый
        this.dependent = dependent;
        // зависимости от
        this.dependencies = dependencies;
        for(let dependence of this.dependencies){
            dependence.addOnchange(() => {
                dependent.initialize();
            });
        }
    }
}

class FormField {
    constructor(name, formId, depends, required, enable){
        this.name = name;
        this.id = formId + "-" + name;
        this.dependEnginge = new FieldDependEngine(this, depends);
        this.required = required;
        this.enable = enable;

        this.onChangeList = [];
    }

    getElement(){

    }

    getValue(){

    }

    setValue(){

    }

    initialize(value){

    }

    addOnchange(action){
        this.onChangeList.push(action);
    }

    setInititialize(getData){
        this.getData = getData;
    }
}

class StaticNonRenderFormField extends FormField{
    constructor(name, formId){
        super(name, formId, [], true, false);
    }

    getValue(){
        return this.value;
    }

    initialize(value){
        this.value = value;
    }
}

class FormFieldInput extends FormField{
    constructor(id, defaultValue){
        super(id, defaultValue);
    }

    getElement(){
        let input = new HtmlElem(this.id).create("input");
        input.getElement().value = this.defaultValue;

        input.addClasses([]);
        return input;
    }

    addOnchange(action){
        new HtmlElem(this.id).getElement().addEventListener("input", e => {
            action(e);
        })
    }

    getValue(){

    }
}

class FormFieldSelect extends FormField{
    constructor(name, formId, depends, required, enable){
        super(name, formId, depends, required, enable);
        
    }

    initialize(value){
        if(value){
            this.value = value;
        }
        
        return this.getData().then(data => {
            let select = new HtmlElem(this.id);
            if(!select.isExistsOnDocumnent()){
                return;
            }

            for(let dataEntry of data){
                let option = new HtmlElem().create("option");
                option.getElement().value = dataEntry.value;
                option.getElement().textContent = dataEntry.text;
                select.append(option);
            }
            select.getElement().value = this.value;

            return Promise.resolve();
        });
    }

    getElement(){
        let select = new HtmlElem(this.id).create("select");
        return select;
    }
}

class FormFieldSelect2{

}

class FormFieldCheckbox{

}







class Form{
    constructor(fields){
        this.fields = fields;
    }

    getElement(){
        let formContainer = new HtmlElem(this.id).create("div");
        for(let field of this.fields){
            formContainer.append(field.getElement());
        }
        return formContainer;
    }

    getFormData(){
        let formData = new FormData();
        return formData;
    }
}

// extends VerseModal
class FormModal extends VerseModal{
    constructor(id, form){
        super(id, modalColorModes.primary);
        this.form = form;
        this.obj = {};
    }

    fill(){
        this.obj = null;

        let modal = this;
        if (this.getDataPromise){
            this.getDataPromise().
            then(data => modal.obj = data).
            then(x => super.fill());
            return;
        }

        if(this.getData){
            this.obj = this.getData();
        }
        super.fill();
    }
}

/// ------------ example ---------------


class AnyField1 extends FormField{
    constructor(name, formId){
        super(name, formId);
    }

    getData(){
        return fetch("", {

        }).then(response => {
            let result = [];
            for(let data of result.data){
                result.push({ 
                    text: data.text, 
                    value: data.value
                });
            }
            return Promise.resolve(result);
        });
    }
}

class AnyField2 extends FormField{
    constructor(id, defaultValue){
        
    }
}

class AnyField3{
    constructor(id, defaultValue){
        super(id, defaultValue, {

        });
    }
}

class AnyField4{
    constructor(id, defaultValue){
        
    }
}

class AnyForm extends Form{
    constructor(id){
        /*
        let fields = {
            anyField1: new AnyField1(),
            anyField2: new AnyField2(),
            anyField3: new AnyField3(),
            anyField4: new AnyField4()
        }
        */
        let fields = [
            new AnyField1(),
            new AnyField2(),
            new AnyField3(),
            new AnyField4()
        ];
        this.fields = {};

        for(let field of fields){
            this.fields[field.name] = field;
        }

        /*
        f1 
        f2 
        f3 зависит от f1
        f4 зависит от f2 и f3
        */ 
    }

    

    initialize(){
        let getDataAnySelect1 = () => {
            return fetch("", {

            }).then(response => {
                let result = [];
                for(let data of result.data){
                    result.push({ 
                        text: data.text, 
                        value: data.value
                    });
                }
                return Promise.resolve(result);
            });
        }

        this.fields.AnyField1.setInititialize(getDataAnySelect1);
    }
}


class AnyFormModal extends FormModal{
    constructor(id){
        let form = new AnyForm(this.id + "-form");
        super(id, form);
        this.obj = {};
    }

    // Если асинхронно
    getDataPromise(){

    }

    // если синхронно
    getData(){

    }

    getTitle(){
        let h4 = new HtmlElem().create("h4");
        h4.addClasses(this.colorMode.titleClasses);
        h4.getElement().textContent = this.obj.anyTitle;
        return h4;
    }

    getContent(){
        // Заполняем контент
        // this.form.initialize(this.obj);
        // return this.form.getElement();
    }

    getFooterButtons(){
        // возвращаем массив кнопок
    }
}

class HttpHelper{

    objectToFormData(object){
        let formData = new FormData();
        for(let key of Object.keys(object)){
            formData.append(key, object[key]);
        }
        return formData;
    }

    apiAshxPost(params, onSuccess, onError){
        let formData = this.objectToFormData(params);
        return fetch("/api.ashx", {
            method: "POST",
            body: formData
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        }).
        then(response => { onSuccess(response) }).
        catch((response) => { 
            if(onError) {
                onError(response)
            } 
            else{
                let errorMessage = "Произошла ошибка! " + 
                "Пожалуйста перезагрузите страницу " + 
                "или обратитесь к администратору.";
                alert(errorMessage);
                console.log(response); 
            }
        });
    }
}