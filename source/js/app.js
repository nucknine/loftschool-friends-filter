// (function() {
// 'use strict';

// svg4everybody();

// VK.init({
//     apiId: 6487685
// });

VK.init({
    apiId: 6487685
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
        // const headerInfo = document.querySelector('#headerInfo');

        // headerInfo.textContent = `Друзья на странице ${me.first_name} ${me.last_name}`;

        return callAPI('friends.get', { fields: 'city, country, photo_100' });
    })
    .then(friends => {        
        const template = document.querySelector('#user-template').textContent;
        const render = Handlebars.compile(template);
        const html = render(friends);
        const results = document.querySelector('#results');

        results.innerHTML = html;
    }).then(() => {
        let counter = 0;
        let currentDrag;        

        document.addEventListener('click', e => {
            if (e.target.classList.contains('new-item')) {
                const newItem = createItem();
                const zone = getCurrentZone(e.target);

                zone.insertBefore(newItem, zone.lastElementChild)
            }            
        });

        document.addEventListener('dragstart', (e) => {
            const zone = getCurrentZone(e.target);

            if (zone) {
                currentDrag = { startZone: zone, node: e.target };
            }
        });

        document.addEventListener('dragover', (e) => {
            const zone = getCurrentZone(e.target);

            if (zone) {
                e.preventDefault();
            }
        });

        document.addEventListener('drop', (e) => {
            if (currentDrag) {
                const zone = getCurrentZone(e.target);

                e.preventDefault();

                if (zone && currentDrag.startZone !== zone) {
                    if (e.target.classList.contains('item')) {
                        zone.insertBefore(currentDrag.node, e.target.nextElementSibling);
                    } else {
                        zone.insertBefore(currentDrag.node, zone.lastElementChild);
                    }
                }

                currentDrag = null;
            }
        });

        function createItem() {
            const newDiv = document.createElement('div');

            newDiv.textContent = counter++;
            newDiv.classList.add('item');
            newDiv.draggable = true;

            return newDiv;
        }

        function getCurrentZone(from) {
            do {
                if (from.classList.contains('drop-zone')) {
                    return from;
                }
            } while (from = from.parentElement);

            return null;
        }
    });

// })();