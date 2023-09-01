const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
let valid = true;

function finish() {
    validateInputs();
    if (valid) {
        console.log('a')
        const postData = {
            email: email.value,
            username: username.value,
            password: password.value,
            password2: password2.value
        };

        fetch('/register', {
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
                    setError(username, 'Username allready exist chose ather one')
                }
            })
            .catch(error => {
                console.error('Eroare:', error);
            });
    }
    valid = true;
}

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    valid = false;

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    if (valid) {
        valid = true;
    }


    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateInputs = () => {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    if (usernameValue === '') {
        setError(username, 'Username is required');

    } else {
        setSuccess(username);
    }

    if (emailValue === '') {
        setError(email, 'Email is required');

    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');

    } else {
        setSuccess(email);
    }

    if (passwordValue === '') {
        setError(password, 'Password is required');

    } else if (passwordValue.length < 8) {
        setError(password, 'Password must be at least 8 character.')

    } else {
        setSuccess(password);
    }

    if (password2Value === '') {
        setError(password2, 'Please confirm your password');

    } else if (password2Value !== passwordValue) {
        setError(password2, "Passwords doesn't match");

    } else {
        setSuccess(password2);
    }
};

