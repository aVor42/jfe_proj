// Пример: взаимодействие с модалкой

class SomeConfirmModal extends SimpleVerseConfirmModal{
    constructor(someId){
        let id = "some-confirm-modal";
        let title = "Удаление чего-то там";
        let text = "Вы точно уверены что хотите удалить что-то там?";
        let confirmBtnText = "Удалить";
        let colorMode = modalColorModes.primary;
        super(id, title, text, confirmBtnText, colorMode);
        this.someId = someId;
    }

    onConfirm(){
        console.log("Отправил запрос что бы что то сделали с чем то, у чего id = " + this.someId);
        this.clear(); 
        this.hide();
    }
}

document.addEventListener("DOMContentLoaded", function(event) { 
    let spinner = new SpinnerMedium("test-spinner", 8); //new Spinner3("test-spin", 8); // 
    
/*
    let tempContainer = document.createElement("div");
    tempContainer.style.marginTop = "200px";
    tempContainer.style.marginLeft = "300px";
    tempContainer.append(spinner.getElement());
    document.getElementsByTagName("body")[0].append(tempContainer);
*/
document.getElementsByTagName("body")[0].append(spinner.getElement());






    document.getElementById("button-test").addEventListener("click", function(e){
        //let modal = new SomeConfirmModal(1337);
        let modal = new SomeFormModal("some-form-modal");
        modal.show();
        // 25,714285714285714285714285714286

        
    })
});