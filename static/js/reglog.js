export let reglog = {
    init: function () {
        if (document.querySelector('.nav-container').dataset.user !== 'None') {
        document.querySelector('#logout').addEventListener('click', reglog.logout)
        } else {
            document.querySelector('#registration').addEventListener('click', reglog.regLogProcess);
            document.querySelector('#login').addEventListener('click', reglog.regLogProcess);
        }
    },

    setRegLogModal: function (modal_usage) {
        let regLogModal = document.querySelector('#registration_login');
        let modalTitle = document.querySelector('#registration_login .modal-title');
        let submitButton = document.querySelector('#submit_send');
        let message = document.querySelector('#message');


        modalTitle.innerText = modal_usage;
        submitButton.innerText = modal_usage;
        message.innerText = '';
        if (submitButton.classList.contains('disabled')) {
            submitButton.classList.toggle('disabled');
        }
        regLogModal.removeEventListener('hide', reglog.loggedIn);
        submitButton.addEventListener('click', reglog.handleSubmit);
        $('#registration_login').off();
    },

    regLogProcess: function (event) {

        let modal_usage = event.target.innerText;
        reglog.setRegLogModal(modal_usage);

        $('#registration_login').modal('show');
    },

    checkStatusCode: function (response) {
        if (response.status === 200 || response.status === 201) {
            let submitButton = document.querySelector('#submit_send');
            submitButton.classList.add('disabled');
            submitButton.removeEventListener('click', reglog.handleSubmit);
        }

        if (response.status === 200) {
            $('#registration_login').on('hidden.bs.modal', reglog.loggedIn)
        }
        return response.json();
    },

    loggedIn: function () {
        window.location.reload();
    },

    handleSubmit: function (event) {
        let userData = {
            username: document.querySelector('#username').value,
            password: document.querySelector('#password').value,
        };
        let message = document.querySelector('#message');

        let url = event.target.innerText === 'Registration'
            ? '/registration'
            : '/login';

        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(userData),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then((response) => reglog.checkStatusCode(response))
            .then((success) => message.innerText = success.message);
    },

    logout: function () {
        return fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then( (response) => reglog.loggedOut(response))
    },

    loggedOut: function (response) {
        if (response.status === 200) {
            window.location.reload()
        }
    },
};