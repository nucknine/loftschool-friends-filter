/* globals VK, Handlebars, svg4everybody */

(function() {
    'use strict';

    svg4everybody();    

    VK.init({
        apiId: 6487685
    });

    function loadState() {
        let data = JSON.parse(storage.data);
        
        renderFriends(data.rightItems, filterZone);
        renderFriends(data.leftItems);
    }

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
    
    const resultZone = document.getElementById('js-results');
    const filterZone = document.getElementById('js-filter-zone');
    let storage = localStorage;

    function renderFriends (friends, zone=resultZone) {
        let template;

        zone.innerHTML = '';

        if (zone == resultZone) {
            template = document.querySelector('#template-left').textContent;
        } else {
            template = document.querySelector('#template-right').textContent;
        }
        
        const render = Handlebars.compile(template);
        const html = render(friends);

        zone.innerHTML = html;
    }

    auth()
    .then(() => {
        return callAPI('friends.get', { fields: 'city, country, photo_100' });
    })
    .then(response => {
        if (storage.data) {
            loadState();
        } else {
            renderFriends(response);   
        }             

        return response;
    }).then((response) => {        
        let currentDrag;

        document.addEventListener('click', e => {
            if (e.target.parentElement.classList.contains('icon-plus')) {                
                const item = e.target.parentElement.parentElement;
                                
                toggleIcon(e.target);                

                filterZone.insertBefore(item, filterZone.lastElementChild);
                
            } else if (e.target.parentElement.classList.contains('icon-times')) {                
                const item = e.target.parentElement.parentElement;                              
                
                toggleIcon(e.target);
                resultZone.insertBefore(item, resultZone.lastElementChild);
                
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

                toggleIcon(currentDrag.node.querySelector('use'));
                zone.insertBefore(currentDrag.node, e.target.nextElementSibling);
                               
                currentDrag = null;
            }
        });
        
        document.addEventListener('input', (e) => {
            const { value } = e.target;
            let filtered = {
                items: []
            }
            
            if (e.target.id == 'js-input-left') {
                filtered.items = response.items.filter( friend => {
                    const fullName = `${friend.first_name} ${friend.last_name}`;
    
                    return fullName.includes(value);
                });
                
                renderFriends(filtered);
            } else {

                let data = JSON.parse(storage.data);

                if (data.rightItems != []) {
                    filtered.items = filterList(data.rightItems, value);
                    renderFriends(filtered, filterZone);
                }
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
        
        function toggleIcon(target) {
            if (target.parentElement.classList.contains('icon-plus')) {
                target.setAttribute('xlink:href', '/assets/img/sprites/sprite.svg#times');
                target.parentElement.classList.add('icon-times');
                target.parentElement.classList.remove('icon-plus');                
            } else if (target.parentElement.classList.contains('icon-times')) {
                target.setAttribute('xlink:href', '/assets/img/sprites/sprite.svg#plus');
                target.parentElement.classList.add('icon-plus');
                target.parentElement.classList.remove('icon-times');                              
            }     
            saveState();
        }

        function filterList (arr, value) {
            const result = arr.filter( friend => {                    
                const fullName = `${friend.first_name} ${friend.last_name}`;
                
                return fullName.includes(value);        
            });
            
            return result;
        }

        function saveState() {
            let rightZoneItems = [];
            let leftZoneItems = [];
            
            for (let i = 0; filterZone.children.length > i; i++) {
                let item = {
                    first_name: '',
                    last_name: '',
                    photo_100: ''
                };
    
                item.photo_100 = filterZone.children[i].querySelector('.main__img').getAttribute('src');
                [item.first_name, item.last_name] = filterZone.children[i].querySelector('.main__name').textContent.split(' ');
                                        
                rightZoneItems.push(item);
            }

            for (let i = 0; resultZone.children.length > i; i++) {
                let item = {
                    first_name: '',
                    last_name: '',
                    photo_100: ''
                };
    
                item.photo_100 = resultZone.children[i].querySelector('.main__img').getAttribute('src');
                [item.first_name, item.last_name] = resultZone.children[i].querySelector('.main__name').textContent.split(' ');
                                        
                leftZoneItems.push(item);
            }

            storage.data = JSON.stringify({
                leftItems: leftZoneItems
            });
        }        
    });
})();