document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const passwordInput = form.querySelector('input[name="password"]');
    const confirmPasswordInput = form.querySelector('input[name="confirmPassword"]');
    const ageInput = form.querySelector('input[name="age"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const addressInput = form.querySelector('input[name="address"]');
    const cityInput = form.querySelector('input[name="city"]');
    const postalCodeInput = form.querySelector('input[name="postalCode"]');
    const dniInput = form.querySelector('input[name="dni"]');
    const modal = document.getElementById('modal');
    const modalData = document.getElementById('modalData');
    const modalMessage = document.getElementById('modalMessage');
    const closeButton = document.querySelector('.close-button');

    const inputs = [
        { input: nameInput, validate: validateName },
        { input: emailInput, validate: validateEmail },
        { input: passwordInput, validate: validatePassword },
        { input: confirmPasswordInput, validate: validatePasswordMatch },
        { input: ageInput, validate: validateAge },
        { input: phoneInput, validate: validatePhone },
        { input: addressInput, validate: validateAddress },
        { input: cityInput, validate: validateCity },
        { input: postalCodeInput, validate: validatePostalCode },
        { input: dniInput, validate: validateDni }
    ];

    inputs.forEach(({ input, validate }) => {
        input.addEventListener('blur', () => validate(input));
        input.addEventListener('focus', () => clearError(input));
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        let isValid = true;
        inputs.forEach(({ input, validate }) => {
            if (!validate(input)) {
                isValid = false;
            }
        });
        if (isValid) {
            sendFormData();
        } else {
            showModalWithMessage('Por favor, corrija los errores en el formulario.');
        }
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    function showError(input, message) {
        clearError(input);
        let error = document.createElement('div');
        error.className = 'error';
        error.textContent = message;
        input.parentNode.appendChild(error);
        input.classList.add('error-border');
    }

    function clearError(input) {
        const error = input.parentNode.querySelector('.error');
        if (error) {
            error.remove();
        }
        input.classList.remove('error-border');
        input.classList.remove('success-border');
    }

    function validateName(input) {
        const value = input.value.trim();
        if (!value) {
            showError(input, 'El nombre es obligatorio.');
            return false;
        }
        input.classList.add('success-border');
        return true;
    }

    function validateEmail(input) {
        const value = input.value.trim();
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(value)) {
            showError(input, 'El email no es válido.');
            return false;
        }
        input.classList.add('success-border');
        return true;
    }

    function validatePassword(input) {
        const value = input.value.trim();
        if (value.length < 8) {
            showError(input, 'La contraseña debe tener al menos 8 caracteres.');
            return false;
        }
        input.classList.add('success-border');
        return true;
    }

    function validatePasswordMatch(input) {
        const password = passwordInput.value.trim();
        const confirmPassword = input.value.trim();
        if (password !== confirmPassword) {
            showError(input, 'Las contraseñas no coinciden.');
            return false;
        }
        input.classList.add('success-border');
        return true;
    }

    function validateAge(input) {
        const value = input.value.trim();
        const age = parseInt(value, 10);
        if (isNaN(age) || age < 18) {
            showError(input, 'Debe ser mayor de 18 años.');
            return false;
        }
        input.classList.add('success-border');
        return true;
    }

    function validatePhone(input) {
        const value = input.value.trim();
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(value)) {
            showError(input, 'El teléfono debe tener 10 dígitos.');
            return false;
        }
        input.classList.add('success-border');
        return true;
    }

    function validateAddress(input) {
        const value = input.value.trim();
        if (!value) {
            showError(input, 'La dirección es obligatoria.');
            return false;
        }
        input.classList.add('success-border');
        return true;
    }

    function validateCity(input) {
        const value = input.value.trim();
        if (!value) {
            showError(input, 'La ciudad es obligatoria.');
            return false;
        }
        input.classList.add('success-border');
        return true;
    }

    function validatePostalCode(input) {
        const value = input.value.trim();
        const postalCodePattern = /^[0-9]{4}$/;
        if (!postalCodePattern.test(value)) {
            showError(input, 'El código postal debe tener 4 dígitos.');
            return false;
        }
        input.classList.add('success-border');
        return true;
    }

    function validateDni(input) {
        const value = input.value.trim();
        const dniPattern = /^[0-9]{8}$/;
        if (!dniPattern.test(value)) {
            showError(input, 'El DNI debe tener 8 dígitos.');
            return false;
        }
        input.classList.add('success-border');
        return true;
    }

    function sendFormData() {
        const formData = new FormData(form);
        const queryParams = new URLSearchParams(formData).toString();

        const url = `https://jsonplaceholder.typicode.com/users?${queryParams}`;

        fetch(url, {
            method: 'GET'
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error en la suscripción.');
            }
        })
        .then(data => {
            saveToLocalStorage();
            showModalWithData(data);
        })
        .catch(error => {
            showModalWithMessage(error.message);
        });
    }

    function saveToLocalStorage() {
        inputs.forEach(({ input }) => {
            localStorage.setItem(input.name, input.value);
        });
    }

    function loadFromLocalStorage() {
        inputs.forEach(({ input }) => {
            const value = localStorage.getItem(input.name);
            if (value) {
                input.value = value;
            }
        });
    }

    function showModalWithData(data) {
        modalMessage.textContent = 'Successful Subscription!';
        modalData.textContent = JSON.stringify(data, null, 2);
        modal.style.display = 'block';
    }

    function showModalWithMessage(message) {
        modalMessage.textContent = message;
        modalData.textContent = '';
        modal.style.display = 'block';
    }

    loadFromLocalStorage();
});