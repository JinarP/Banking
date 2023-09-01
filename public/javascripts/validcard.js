
function cc () {
    const iban = document.getElementById('card woner').value;
    const inputControl = iban.parentElement;
    const errorDisplay = document.getElementsByClassName('error');

    errorDisplay.innerText = 'nan';

console.log(iban);
}