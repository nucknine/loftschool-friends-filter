/* globals VK, Handlebars */

(function() {
    'use strict';

// svg4everybody();

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
        return callAPI('friends.get', { fields: 'city, country, photo_100' });
    })
    .then(friends => {
        const template = document.querySelector('#user-template').textContent;
        const render = Handlebars.compile(template);
        const html = render(friends);
        const results = document.querySelector('#js-results');

        results.innerHTML = html;
    }).then(() => {        
        let currentDrag;        

        document.addEventListener('click', e => {
            if (e.target.parentElement.classList.contains('icon-plus')) {                
                const item = e.target.parentElement.parentElement;
                const filterZone = document.getElementById('js-filter-zone');

                filterZone.insertBefore(item, filterZone.lastElementChild);
                e.target.setAttribute('xlink:href', '/assets/img/sprites/sprite.svg#times');
                e.target.parentElement.classList.add('icon-times');
                e.target.parentElement.classList.remove('icon-plus');
            } else if (e.target.parentElement.classList.contains('icon-times')) {
                e.target.setAttribute('xlink:href', '/assets/img/sprites/sprite.svg#plus');
                const item = e.target.parentElement.parentElement;                              
                const resultZone = document.getElementById('js-results');

                resultZone.insertBefore(item, resultZone.lastElementChild);
                e.target.parentElement.classList.add('icon-plus');
                e.target.parentElement.classList.remove('icon-times');
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
                zone.insertBefore(currentDrag.node, e.target.nextElementSibling);
                               
                currentDrag = null;
            }
        });

        function getCurrentZone(from) {
            do {
                if (from.classList.contains('main__drop-zone')) {
                    return from;
                }
            } while (from = from.parentElement);

            return null;
        }
    });
})();