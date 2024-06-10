document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const passwordInputs = form.querySelectorAll('input[name="password"]');
    const ageInput = form.querySelector('input[name="age"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const addressInput = form.querySelector('input[name="address"]');
    const cityInput = form.querySelector('input[name="city"]');
    const postalCodeInput = form.querySelector('input[name="postalCode"]');
    const dniInput = form.querySelector('input[name="dni"]');

    const inputs = [
        { input: nameInput, validate: validateName },
        { input: emailInput, validate: validateEmail },
        { input: passwordInputs[0], validate: validatePassword },
        { input: passwordInputs[1], validate: validatePasswordMatch },
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

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let isValid = true;
        inputs.forEach(({ input, validate }) => {
            if (!validate(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            alert(getFormData());
        } else {
            alert('Por favor, corrija los errores en el formulario.');
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
        const isValid = value.length > 6 && value.includes(' ');
        if (!isValid) {
            showError(input, 'El nombre completo debe tener más de 6 letras y al menos un espacio.');
        } else {
            input.classList.add('success-border');
        }
        return isValid;
    }

    function validateEmail(input) {
        const value = input.value.trim();
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!isValid) {
            showError(input, 'Por favor, ingrese un email válido.');
        } else {
            input.classList.add('success-border');
        }
        return isValid;
    }

    function validatePassword(input) {
        const value = input.value.trim();
        const isValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
        if (!isValid) {
            showError(input, 'La contraseña debe tener al menos 8 caracteres, formados por letras y números.');
        } else {
            input.classList.add('success-border');
        }
        return isValid;
    }

    function validatePasswordMatch() {
        const password1 = passwordInputs[0].value.trim();
        const password2 = passwordInputs[1].value.trim();
        const isValid = password1 === password2;
        if (!isValid) {
            showError(passwordInputs[1], 'Las contraseñas no coinciden.');
        } else {
            passwordInputs[1].classList.add('success-border');
        }
        return isValid;
    }

    function validateAge(input) {
        const value = parseInt(input.value.trim(), 10);
        const isValid = Number.isInteger(value) && value >= 18;
        if (!isValid) {
            showError(input, 'La edad debe ser un número entero mayor o igual a 18.');
        } else {
            input.classList.add('success-border');
        }
        return isValid;
    }

    function validatePhone(input) {
        const value = input.value.trim();
        const isValid = /^\d{7,}$/.test(value);
        if (!isValid) {
            showError(input, 'El teléfono debe tener al menos 7 dígitos y no contener espacios, guiones ni paréntesis.');
        } else {
            input.classList.add('success-border');
        }
        return isValid;
    }

    function validateAddress(input) {
        const value = input.value.trim();
        const isValid = /^(?=.*\d)(?=.*[A-Za-z])(?=.*\s).{5,}$/.test(value);
        if (!isValid) {
            showError(input, 'La dirección debe tener al menos 5 caracteres, con letras, números y un espacio.');
        } else {
            input.classList.add('success-border');
        }
        return isValid;
    }

    function validateCity(input) {
        const value = input.value.trim();
        const isValid = value.length >= 3;
        if (!isValid) {
            showError(input, 'La ciudad debe tener al menos 3 caracteres.');
        } else {
            input.classList.add('success-border');
        }
        return isValid;
    }

    function validatePostalCode(input) {
        const value = input.value.trim();
        const isValid = value.length >= 3;
        if (!isValid) {
            showError(input, 'El código postal debe tener al menos 3 caracteres.');
        } else {
            input.classList.add('success-border');
        }
        return isValid;
    }

    function validateDni(input) {
        const value = input.value.trim();
        const isValid = /^\d{7,8}$/.test(value);
        if (!isValid) {
            showError(input, 'El DNI debe tener 7 u 8 dígitos.');
        } else {
            input.classList.add('success-border');
        }
        return isValid;
    }

    function getFormData() {
        return `
            Nombre: ${nameInput.value}
            Email: ${emailInput.value}
            Edad: ${ageInput.value}
            Teléfono: ${phoneInput.value}
            Dirección: ${addressInput.value}
            Ciudad: ${cityInput.value}
            Código Postal: ${postalCodeInput.value}
            DNI: ${dniInput.value}
        `;
    }
});