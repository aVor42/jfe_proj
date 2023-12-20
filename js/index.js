// Пример: взаимодействие с модалкой

document.addEventListener("DOMContentLoaded", function(event) { 
    document.getElementById("button-test").addEventListener("click", function(e){
        let modal = new VerseModal("test-modal", modalColorModes.primary);
        modal.show();
    })
});


/*



Возможно для заполнения 
1 Заголовок 
2 Тело
3 Кнопки футера

*/ 



//let test1 = function ()  { return { get: () =>  { return this.value; }, set: (value) => { this.value = value; } }; };