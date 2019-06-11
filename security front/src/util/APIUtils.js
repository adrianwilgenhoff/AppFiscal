import { API_BASE_URL, USER_LIST_SIZE, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

export function getAllUsers(page, size) {
    page = page || 0;
    size = size || USER_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllUser() {

    return request({
        url: API_BASE_URL + "/users",
        method: 'GET'
    });
}

export function createUser(UserData) {
    return request({
        url: API_BASE_URL + "/users",
        method: 'POST',
        body: JSON.stringify(UserData)
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/register",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function updateProfile(updateRequest) {
    return request({
        url: API_BASE_URL + "/account/update",
        method: 'PUT',
        body: JSON.stringify(updateRequest)
    });
}

export function editUser(userEditRole) {
    return request({
        url: API_BASE_URL + "/users",
        method: 'PUT',
        body: JSON.stringify(userEditRole)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?login=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}

export function resetPassword(email) {
    return request({
        url: API_BASE_URL + "/account/send-reset-password?email=" + email,
        method: 'POST'
    });
}

export function changePassword(passwordChange) {
    return request({
        url: API_BASE_URL + "/account/change-password",
        method: 'POST',
        body: JSON.stringify(passwordChange)
    });
}


//GET USER LOGUEADO
export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/me"/*"/users/" + username*/,
        method: 'GET'
    });
}


export function deleteUser(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'DELETE'
    });
}

