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
     cardOwner = document.getElementById('cardOwner');
     cardName = document.getElementById('cardName');
     iban = document.getElementById('iban');
     number = document.getElementById('number');
     data = document.getElementById('data');
     pin = document.getElementById('pin');
     cvv = document.getElementById('cvv');
     moneda = document.getElementById('moneda');
     validate();    

     if (valid) {
        const postData = {
            cardOwner: cardOwner.value,
            cardName: cardName.value,
            iban: iban.value,
            number: number.value,
            data:data.value,
            pin: pin.value,
            cvv: cvv.value,
            moneda: moneda.value
        };

        fetch('/addcard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/startpage';
                } else {
                    setError(username, data.message)
                }
            })
            .catch(error => {
                console.error('Eroare:', error);
            });
    }
    valid = true;    

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
    } else {
        setSuccess(iban);
    }
    if (number.length != 16) {
        setError(number, 'Card number invalid choose other')
    } else {
        setSuccess(number)
    }
    if (pin.length != 4) {
        setError(pin, 'Pin code is invalid')
    } else {
        let err = 1;
        for (let i = 0; i < pin.length; ++i) {
            if (pin[i] < '0' || pin[i] > 9) {
                err = 0;
            }
        }
        if (err == 0) {
            setError(pin, 'Pin code can not contain letter');
        } else {
            setSuccess(pin);
        }
    }

    if (cvv.length !=3) {
        setError(cvv, 'CVV invalid')
    } else (
        setSuccess(cvv)
    )
    const monede =['euro', 'ron', 'dolar', 'lire'];
    
    if (monede.includes(moneda.value.toLowerCase())) {
        setSuccess(moneda)
    } else (
        setError(moneda, 'Inavild moned choose ather')
    )
    
}