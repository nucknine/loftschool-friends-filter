// 1) регистрация приложения -> получение api id
// 2) авторизоваться на сайте
//   - открыть окно с запросом прав
//   - разрешить выполнять действия от нашего имени

VK.init({
    apiId: 5267932
});

function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}

function callAPI(method, params) {
    params.v = '5.76';

    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        });
    })
}

auth()
    .then(() => {
        return callAPI('users.get', { name_case: 'gen' });
    })
    .then(([me]) => {
        const headerInfo = document.querySelector('#headerInfo');
        headerInfo.textContent = `Друзья на странице ${me.first_name} ${me.last_name}`;

        return callAPI('friends.get', { fields: 'city, country, photo_100' });
    })
    .then(friends => {
        const template = document.querySelector('#user-template').textContent;
        const render = Handlebars.compile(template);
        const html = render(friends);
        const results = document.querySelector('#results');

        results.innerHTML = html;
    });
