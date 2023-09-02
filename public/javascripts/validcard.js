let cardOwner;
let cardName;
let iban;
let number;
let data;
let pin;
let cvv;
let moneda;
let valid = true;


function finish() {
     cardOwner = document.getElementById('cardOwner').value;
     cardName = document.getElementById('cardName').value;
     iban = document.getElementById('iban').value;
     number = document.getElementById('number').value;
     data = document.getElementById('data').value;
     pin = document.getElementById('pin').value;
     cvv = document.getElementById('cvv').value;
     moneda = document.getElementById('moneda').value;
     validate();

    // Modificarea ID-ului pentru a evita spațiile și erorile de scriere

}

function setError (element, message) {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    valid = false;

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
}

function setSuccess (element) {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
}

function validate () {
    if (iban.length != 16) {
        setError(iban, 'IBAN inavli choose ather')
    } 
    if (number.length != 16) {
        setError(number, 'Card bumber invalid choose other')
    }
    
}