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

class Spinner{
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

        let overlay = this.getOverlay();
        if(!overlay.isExistsOnDocumnent()){
            body.append(overlay.getElement());
        }

        let modalElement = this.getModal();
        if(!modalElement.isExistsOnDocumnent()){
            body.append(modalElement.getElement());
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
        footerClasses: ["jfe-verse-modal-footer", "jfe-verse-default"],
        titleClasses: ["jfe-verse-modal-title"]
    },
    danger: {
        headerClasses: ["jfe-verse-modal-header", "jfe-verse-danger"], 
        bodyClasses: ["jfe-verse-modal-body"],
        footerClasses: ["jfe-verse-modal-footer", "jfe-verse-default"],
        titleClasses: ["jfe-verse-modal-title"]
    },
    primary: {
        headerClasses: ["jfe-verse-modal-header", "jfe-verse-primary"], 
        bodyClasses: ["jfe-verse-modal-body"],
        footerClasses: ["jfe-verse-modal-footer", "jfe-verse-default"],
        titleClasses: ["jfe-verse-modal-title"]
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

class SimpleConfirmModal extends VerseModal{
    constructor(someId){
        super("simple-confirm-modal", modalColorModes.primary);
        this.someId = someId;

        this.someObject = null;
    }

    getTitle(){
        let h4 = new HtmlElem().create("h4");
        h4.addClasses(this.colorMode.titleClasses);
        h4.getElement().textContent = "Удаление чего-то там"
        return h4;
    }
    // 
    getContent(){
        let container = new HtmlElem(this.id + "-content").create("div");
        container.addClass("jfe-verse-modal-content");
        let textNode = new HtmlElem().create("p");
        textNode.getElement().textContent = "Вы точно уверены что хотите удалить что-то там?";
        container.append(textNode);

        return container;
    }
    
    simulateHttpRequest(){

    }
}