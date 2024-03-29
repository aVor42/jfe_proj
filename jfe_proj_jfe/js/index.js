function isNullOrUndefined(obj){
    return obj === null || typeof(obj) === "undefined";
}

class HtmlElemId{
    constructor(htmlElemObj){
        this.htmlElemObj = htmlElemObj;
    }

    set(value){
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
    }

    get(){
        let element = this.htmlElemObj.element;
        return element && element.id && !this.value? 
                element.id: this.value;
    }

    empty() {
        this.value = null;
        this.htmlElemObj.element.removeAttribute("id");
    }
}

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

class Spinner{
    constructor(id, circlesCount){
        this.id = id;
        this.circlesCount = circlesCount;
        this.radius = 10;
        this.animateTimeMs = 3500;
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

        let dTime = this.animateTimeMs / this.circlesCount / 2;
        for(let i = 0; i < this.circlesCount; i++){
            let startAnimateTime = -dTime * i;
            let circle = new SpinnerCircle(this.radius, this.animateTimeMs, startAnimateTime);
            spinnerRatioW.append(circle.getCircle());            
        }

        return container.getElement();
    }
}

class SpinnerCircle{
    constructor(radius, animateTimeMs, startAnimateTime){
        this.radius = radius;
        this.animateTimeMs = animateTimeMs;
        this.startAnimateTime = startAnimateTime;
        this.classes = ["spinner-circle"];
    }

    getBeginCeneter(){
        let centerPerscent = 50;
        return (centerPerscent - this.radius) + "%";
    }

    getTransformPercent(position) {
        let centerSideProcent = 0;
        let endSideProcent = 50 - this.radius;
        let lengthProcent = endSideProcent - centerSideProcent;
        let procentByDiameter = lengthProcent * 100 / (this.radius * 2);
        return (procentByDiameter * position).toFixed(2);

    }

    getTranslateByXY(x, y) {
        return `translate(${this.getTransformPercent(x)}%, ${this.getTransformPercent(-y)}%)`
    }

    getStyles(){
        let sideSize = this.radius * 2 + "%";
        let beginCenter = this.getBeginCeneter();
        let animation = this.animateTimeMs + "ms linear " + 
                        this.startAnimateTime + 
                        "ms infinite normal none running spinner-circle"
        return { 
            height: sideSize,
            width: sideSize,
            top: beginCenter,
            left: beginCenter,
            transform: this.getTranslateByXY(1, 0),
            animation: animation
        };
    }

    getCircle(){
        let circle = new HtmlElem().create("div");
        circle.addClasses(this.classes);
        let circElement = circle.getElement();
        let styles = this.getStyles();
        for(let styleKey of Object.keys(styles)){
            circElement.style[styleKey] = styles[styleKey];
        }
        return circElement;
    }
}

class SpinnerSize extends Spinner{
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
        });

        let closeBtn = new HtmlElem(this.id + "-close-btn").create("button");
        closeBtn.addClasses(["jfe-verse-btn", "jfe-verse-btn-default"]);
        closeBtn.getElement().textContent = "Закрыть";
        closeBtn.getElement().addEventListener("click", (e) => { 
            modal.clear(); 
            modal.hide();
        });

        return [closeBtn, confirmBtn];
    }

    onConfirm(){
        
    }
}

class FieldDependEngine{
    constructor(current, dependencies){
        // Текущее поле
        this.current = current;
        // зависимости поля
        this.dependencies = dependencies;
        // завясящие от текущего поля
        this.dependent = [];

        for(let dependence of this.dependencies){       
            dependence.dependEnginge.dependent.push(current);
        }
    }

    setForm(form){
        this.form = form;
    }

    getDependenceByName(name){
        for(let dependence of this.dependencies){       
            if(dependence.name === name){
                return dependence;
            }
        }
        return null;
    }

    onInput(){
        for(let dependentField of this.dependent){
            if(dependentField.onChangeDependence){
                dependentField.onChangeDependence();
            }
        }
        if(this.form){
            this.form.onFieldInput();
        }
        
    }
}

class FormField {
    constructor(name, parentId, title, depends, required){
        this.name = name;
        this.id = parentId + "-" + name;
        this.title = title;
        this.dependEnginge = new FieldDependEngine(this, depends);
        this.required = required;
        this.value = null;
    }

    setForm(form){
        this.dependEnginge.setForm(form);
    }

    getValue(){
        return this.value;
    }

    setValue(value){
        this.value = value;
    }
}

class StaticNonElementFormField extends FormField{
    constructor(name, parentId, title){
        super(name, parentId, title, [], true);
    }
}

class ElementFormField extends FormField {
    constructor(name, parentId, title, depends, required){
        super(name, parentId, title, depends, required);
        this.tempValue = null;
        this.currentElement = null;
    }

    getFormElement(){
        let container = new HtmlElem(this.id + "-container").create("div");
        container.addClass("jfe-verse-modal-form-field-container");

        let labelText = this.title + (this.required? " (обязательное)": "") + ":";
        let label = new HtmlElem(this.id + "-label").create("label");
        label.addAttribute("for", this.id);
        label.getElement().textContent = labelText;

        let element = this.getElement();
        container.append(label);
        container.append(element);
        return container;
    }

    onChangeDependence(){

    }
}

class FormFieldInput extends ElementFormField{
    constructor(name, parentId, title, depends, required, placeholder){
        super(name, parentId, title, depends, required);
        this.placeholder = placeholder;
    }

    init(input){
        if(input && input.id.get() !== this.id){
            throw new Error("id переданного элемента и id поля не совпадают!");
        }

        if(!input){
            input = new HtmlElem(this.id);
            if(!input.isExists()){
                return;
            }
        }

        let currentValue = isNullOrUndefined(this.value) && !isNullOrUndefined(this.tempValue)?
                                this.tempValue: this.value;

        this.setValue(currentValue);
    }

    getElement(){
        let input = new HtmlElem(this.id);
        if(input.isExistsOnDocumnent()){
            return input;
        }
        if(this.currentElement){
            return this.currentElement;
        }
        
        input.create("input");
        input.addAttribute("placeholder", this.placeholder);
        let field = this;
        input.getElement().addEventListener("input", (e) => {
            field.setValue(input.getElement().value)
        });
        this.currentElement = input;
        this.init(input);
        return input;
    }

    setValue(value){
        let input = new HtmlElem(this.id);
        input = !input.isExists() && this.currentElement? this.currentElement: input;

        if(!input.isExists()){
            this.tempValue = value;
            this.value = null;
            return;
        }
        let valueToInput = isNullOrUndefined(value)? this.getDefaultValue(): value;

        this.tempValue = null;
        this.value = value;
        if(input.isExists() && input.getElement().value !== value){
            input.getElement().value = valueToInput;
        }
        this.dependEnginge.onInput();
    }

    getDefaultValue(){
        return "";
    }
}

class FormFieldSelect extends ElementFormField{
    constructor(name, parentId, title, depends, required){
        super(name, parentId, title, depends, required);
    }

    init(select){
        if(select && select.id.get() !== this.id){
            throw new Error("id переданного элемента и id поля не совпадают!");
        }

        if(!select){
            select = new HtmlElem(this.id);
            if(!select.isExists()){
                return;
            }
        }

        let defaultOptionValue = null
        if(this.getDefaultOption){
            let defOption = this.getDefaultOption();
            select.append(defOption);
            defaultOptionValue = defOption.value;
        }

        return this.getData().then(data => {  
            let currentValue = isNullOrUndefined(this.value) && !isNullOrUndefined(this.tempValue)?
                                this.tempValue: this.value;
            

            let hasCurrentValue = false;          
            for(let dataEntry of data){
                let option = new HtmlElem().create("option");
                option.getElement().value = dataEntry.value;
                option.getElement().textContent = dataEntry.text;
                select.append(option);
                hasCurrentValue |= currentValue == dataEntry.value;
            }

            let selectElement = select.getElement();
            if(isNullOrUndefined(currentValue)){
                selectElement.value = defaultOptionValue;
            }
            else if(!hasCurrentValue){
                this.setValue(null);
            }
            else{
                this.setValue(currentValue);
            }

            return Promise.resolve();
        });
    }

    refresh(){
        let select = new HtmlElem(this.id);
        if(!select.isExists()){
            return;
        }
        select.getElement().innerHTML = "";
        let currentValue = isNullOrUndefined(this.value) && !isNullOrUndefined(this.tempValue)?
                                this.tempValue: this.value;
        this.value = null;
        this.tempValue = currentValue;
        this.dependEnginge.onInput();

        return this.init();
    }

    onChangeDependence(){
        this.refresh();
    }

    getElement(){
        let select = new HtmlElem(this.id);
        if(select.isExistsOnDocumnent()){
            return select;
        }
        if(this.currentElement){
            return this.currentElement;
        }

        select.create("select");

        let field = this;
        select.getElement().addEventListener("input", (e) => {
            field.setValue(select.getElement().value)
        });

        this.init(select);
        this.currentElement = select;
        return select;
    }

    setValue(value){
        let select = new HtmlElem(this.id);
        select = !select.isExists() && this.currentElement? this.currentElement: select;

        if(!select.isExists()){
            this.tempValue = value;
            this.value = null;
            return;
        }
        let valueToSelect = isNullOrUndefined(value) && this.getDefaultOption? 
                                this.getDefaultOption().value: value;

        let selectHasValue = document.querySelector('#' + this.id + " option[value='" + valueToSelect + "']") !== null;

        if(!selectHasValue){
            throw new Error("Выпадающий список не содержит значения " + value);
        }

        this.tempValue = null;
        this.value = value;
        if(select.isExists() && select.getElement().value !== value){
            select.getElement().value = valueToSelect;
        }
        this.dependEnginge.onInput();
    }
}

class Form{
    constructor(id, fields){
        this.id = id;
        this.fields = fields;
        for(let field of this.fields){
            field.setForm(this);
        }
        this.submitButton = null;
    }

    getElement(){
        let formContainer = new HtmlElem(this.id).create("div");
        formContainer.addClass("jfe-verse-modal-form");
        for(let field of this.fields){
            formContainer.append(field.getFormElement());
        }
        return formContainer;
    }

    getFormData(){
        let formData = new FormData();
        for(let field of this.fields){
            formData.append(field.name, field.getValue());
        }
        return formData;
    }

    getFieldByName(name){
        for(let field of this.fields){
            if(field.name === name){
                return field;
            }
        }
        return null;
    }

    onFieldInput(){
        let allRequiredFilled = true;
        for(let field of this.fields){

            allRequiredFilled &= !!field.getValue() || !field.required;
        }
        if(this.submitButton){
            this.submitButton.disabled = !allRequiredFilled;
        }
    }

    getSubmitButton(){
        if(!this.submitButton){
            let button = new HtmlElem(this.id + "-btn-submit").create("button");
            this.submitButton = button.getElement();
        }        
        return this.submitButton;
    }
}

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


class AnyField1 extends FormFieldSelect{
    constructor(name, parentId, title){
        super(name, parentId, title, [], true);
    }

    getData(){
        return new HttpHelper().getField1Data().then(response => {
            let result = [];
            for(let data of response.data){
                result.push({ 
                    text: data.text, 
                    value: data.value
                });
            }
            return Promise.resolve(result);
        });
    }

    getDefaultOption(){
        let option = new HtmlElem().create("option");
        option.getElement().textContent = "-- Укажите значение --";
        option.getElement().value = "";
        return option.getElement();
    }
}

class AnyField2 extends FormFieldSelect{
    constructor(name, parentId, title){
        super(name, parentId, title, [], true);
    }

    getData(){
        /*
        
        */
        return new HttpHelper().getField2Data().then(response => {
            let result = [];
            for(let data of response.data){
                result.push({ 
                    text: data.text, 
                    value: data.value
                });
            }
            return Promise.resolve(result);
        });
    }

    getDefaultOption(){
        let option = new HtmlElem().create("option");
        option.getElement().textContent = "-- Укажите значение --";
        option.getElement().value = "";
        return option.getElement();
    }
}

class AnyField3 extends FormFieldSelect{
    constructor(name, parentId, title, anyField1){
        super(name, parentId, title, [anyField1], true);
    }

    getData(){
        let anyField1 = this.dependEnginge.getDependenceByName("anyField1");
        if(!anyField1.getValue()){
            return Promise.resolve([]);
        }

        return new HttpHelper().getField3Data().then(response => {
            let result = [];
            for(let data of response.data){
                result.push({ 
                    text: data.text, 
                    value: data.value
                });
            }
            return Promise.resolve(result);
        });
    }

    getDefaultOption(){
        let option = new HtmlElem().create("option");
        option.getElement().textContent = "-- Укажите значение --";
        option.getElement().value = "";
        return option.getElement();
    }
}

class AnyField4 extends FormFieldSelect{
    constructor(name, parentId, title, anyField2, anyField3){
        super(name, parentId, title, [anyField2, anyField3], false);
    }

    getData(){
        let field2 = this.dependEnginge.getDependenceByName("anyField2");
        let field3 = this.dependEnginge.getDependenceByName("anyField3");
        if(!field2.getValue() || !field3.getValue()){
            return Promise.resolve([]);
        }

        return new HttpHelper().getField4Data(field2, field3).then(response => {
            let result = [];
            for(let data of response.data){
                result.push({ 
                    text: data.text, 
                    value: data.value
                });
            }
            return Promise.resolve(result);
        });
    }

    getDefaultOption(){
        let option = new HtmlElem().create("option");
        option.getElement().textContent = "-- Укажите значение --";
        option.getElement().value = "";
        return option.getElement();
    }
}

class AnyField5 extends FormFieldInput{
    constructor(name, parentId, title, placeholder){
        super(name, parentId, title, [], false, placeholder);
    }
}

class SomeFormModal extends FormModal{
    constructor(id){
        let anyField1 = new AnyField1("anyField1", id, "Какое то поле 1");
        let anyField2 = new AnyField2("anyField2", id, "Какое то поле 2");
        let anyField3 = new AnyField3("anyField3", id, "Какое то поле 3", anyField1);
        let anyField4 = new AnyField4("anyField4", id, "Какое то поле 4", anyField2, anyField3);
        let anyField5 = new AnyField5("anyField5", id, "Какое то текстовое поле", "Заполни меня");
        let fields = [
            anyField1, 
            anyField2,
            anyField3,
            anyField4,
            anyField5
        ];
        let form = new Form(id + "-form", fields);

        super(id, form);
    }

    // Если асинхронно
    /*
    getDataPromise(){
        
    }
    */

    // если синхронно
    getData(){
        return {
            title: "Test modal",
            anyField2: 1,
            anyField3: 10,
            anyField5: "help me"
            //anyField4: 1
        };
    }

    getTitle(){
        let h4 = new HtmlElem().create("h4");
        h4.addClasses(this.colorMode.titleClasses);
        h4.getElement().textContent = this.obj.title;
        return h4;
    }

    getContent(){
        // Заполняем контент
        // this.form.initialize(this.obj);
        // return this.form.getElement();
        let fieldNames = Object.keys(this.obj);
        for(let fieldName of fieldNames){
            if(this.form.getFieldByName(fieldName) !== null){
                this.form.getFieldByName(fieldName).setValue(this.obj[fieldName]);
            }
        }
        return this.form.getElement();

    }

    getFooterButtons(){
        let modal = this;

        let confirmBtn = new HtmlElem().setElement(this.form.getSubmitButton());
        confirmBtn.addClasses(this.colorMode.primaryBtnClasses);
        confirmBtn.getElement().textContent = "Получить форму";
        confirmBtn.getElement().addEventListener("click", (e) => {
            modal.onConfirm();
        });

        let closeBtn = new HtmlElem(this.id + "-close-btn").create("button");
        closeBtn.addClasses(["jfe-verse-btn", "jfe-verse-btn-default"]);
        closeBtn.getElement().textContent = "Закрыть";
        closeBtn.getElement().addEventListener("click", (e) => { 
            modal.clear(); 
            modal.hide();
        });
        // возвращаем массив кнопок
        return [closeBtn, confirmBtn]
    }

    onConfirm(){
        let formData = this.form.getFormData();
        for(let key of formData.keys()){
            let value = formData.getAll(key)[0];
            console.log({ key: key, value: value } );
        }        
    }
}

class HttpHelper{

    delay(ms){
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms)
        });
    }

    getField1Data(){
        let data = [
            { text: "field1 one", value: 1 },
            { text: "field1 two", value: 2 },
            { text: "field1 three", value: 3 },
            { text: "field1 four", value: 4 },
            { text: "field1 five", value: 5 }
        ]

        return this.delay(1000).then(() => {
            return new Promise((resolve) => resolve({data}));
        });
    }

    getField2Data(){
        let data = [
            { text: "field2 one", value: 1 },
            { text: "field2 two", value: 2 },
            { text: "field2 three", value: 3 }
        ]

        return this.delay(1000).then(() => {
            return new Promise((resolve) => resolve({data}));
        });
    }

    getField3Data(){
        let data = [
            { text: "field3 one", value: 1 },
            { text: "field3 two", value: 2 },
            { text: "field3 three", value: 3 },
            { text: "field3 four", value: 4 },
        ]

        return this.delay(1000).then(() => {
            return new Promise((resolve) => resolve({data}));
        });
    }

    getField4Data(field2, field3){
        let data = [
            { text: "field4 one", value: 1 },
            { text: "field4 two", value: 2 }
        ];

        if(field3.getValue() == 3){
            data = [
                { text: "field4 three", value: 3 },
                { text: "field4 four", value: 4 }
            ];
        }

        return this.delay(1000).then(() => {
            return new Promise((resolve) => resolve({data}));
        });
    }

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