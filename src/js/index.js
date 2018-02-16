'use strict'

class Data {
    constructor() {
        this.url = 'https://jsonplaceholder.typicode.com/users';

        this.step = 2;
        this.end = 2;
        this.userLength = 10;

        this.statusChecked = '';

        this.statusSortId = '';
        this.statusSortName = '';
        this.statusSortUserName = '';
        this.statusSortEmail = '';

        this.userArr = [];
    }

    initUserArr() {
        this.userArr = [];

        JSON.parse(localStorage.getItem('etalonUserArr')).forEach((elem,index)=>{
            if(index<this.end) {
                this.userArr[index] = elem;   /* dont use push because we need rewrite arr  */
            }
        });
    }

}

class Render {
    constructor(data) {
        this.data = data;
        this.renderUsers = document.querySelector('.renderUsers');
    }

    renderTable() {
        this.cleanTable();

        this.data.userArr.forEach((elem,index) => {
            if (index<this.data.end){
                let template = `<th scope="col"><input type="checkbox"></th> <th scope="row">${elem.id}</th> <td>${elem.name}</td> <td>${elem.username}</td> <td>${elem.email}</td><td>${elem.phone}</td>`;
                this.renderUsers.insertAdjacentHTML('beforeEnd', template)
            }
        });

        this.renderChacked();
    }

    renderChacked() {
        let checkboxCollection = document.querySelectorAll('input[type=checkbox]');
        let arrCheckbox = [...checkboxCollection];

        arrCheckbox.forEach((elem)=>{
            elem.checked = this.data.statusChecked;
        });
    }

    cleanTable() {
        this.renderUsers.innerHTML = '';
    }

    scrollTable(value) {
        setTimeout(()=>{document.body.scrollIntoView(value)},500);
    }

    showCoincidence(elem) {
        elem.style.backgroundColor = 'PowderBlue';
    }

    whiteBackground() {
        let allHtml = document.querySelectorAll('tbody th,td');
        let arrAllHtml = [...allHtml];
        arrAllHtml.forEach((elem)=>{
            elem.style.backgroundColor = 'white';
        });
    }
}

class Listener {
    constructor(data, render) {
        this.btnNext = document.querySelector('.next');
        this.btnPrev = document.querySelector('.prev');

        this.mainCheckbox = document.querySelector('.mainCheckbox');

        this.searchInfo = document.querySelector('.searchInfo');

        this.sortId = document.querySelector('.sortId');
        this.sortName = document.querySelector('.sortName');
        this.sortUserName = document.querySelector('.sortUserName');
        this.sortEmail = document.querySelector('.sortEmail');

        this.data = data;
        this.render = render;
        this.promise = new Promise(
            (resolve, reject) => {
                let response = new XMLHttpRequest();
                response.open('GET', this.data.url, false);
                response.send();
                if (response.status == '200') {
                    resolve(response.responseText);
                } else {
                    reject(response.status);
                }
            });
    }

    initApp() {
        this.promise
            .then(result => {
                localStorage.setItem('etalonUserArr', result);

                this.data.initUserArr();
                this.render.renderTable();

                this.initButton();
                this.initCheckBox();
                this.initSort();
                this.initSearch();
            })
            .catch(result => console.log(result));
    }

    initButton() {
        this.btnNext.addEventListener('click', () => {
            this.data.end = this.data.end + this.data.step;
            this.data.end > this.data.userLength ? this.data.end = this.data.userLength : this.data.end;

            this.data.initUserArr();

            this.data.statusSortId == true ? this.sort('id') : this.data.statusSortId;
            this.data.statusSortName == true ? this.sort('name') : this.data.statusSortName;
            this.data.statusSortUserName == true ? this.sort('username') : this.data.statusSortUserName;
            this.data.statusSortEmail == true ? this.sort('email') : this.data.statusSortEmail;

            this.render.renderTable();
            this.render.scrollTable(false);
        });

        this.btnPrev.addEventListener('click', () => {
            this.data.end = this.data.end - this.data.step;
            this.data.end < this.data.step ? this.data.end = this.data.step : this.data.end;

            this.data.initUserArr();

            this.data.statusSortId == true ? this.sort('id') : this.data.statusSortId;
            this.data.statusSortName == true ? this.sort('name') : this.data.statusSortName;
            this.data.statusSortUserName == true ? this.sort('username') : this.data.statusSortUserName;
            this.data.statusSortEmail == true ? this.sort('email') : this.data.statusSortEmail;

            this.render.renderTable();
            this.render.scrollTable(true);
        });
    }

    initCheckBox() {
        this.mainCheckbox.addEventListener('change', () => {
            this.data.statusChecked = !this.data.statusChecked;

            this.render.renderChacked();
        });
    }

    initSort() {
        this.sortId.addEventListener('click', (e)=>{
            e.preventDefault();
            this.data.statusSortId =! this.data.statusSortId;

            if (this.data.statusSortId){
                this.data.statusSortName = '';
                this.data.statusSortUserName = '';
                this.data.statusSortEmail = '';
            }

            this.sort('id');
        });

        this.sortName.addEventListener('click', (e) => {
            e.preventDefault();
            this.data.statusSortName =! this.data.statusSortName;

            if (this.data.statusSortName){
                this.data.statusSortId = '';
                this.data.statusSortUserName = '';
                this.data.statusSortEmail = '';
            }

            this.sort('name');
        });

        this.sortUserName.addEventListener('click', (e) => {
            e.preventDefault();
            this.data.statusSortUserName =! this.data.statusSortUserName;

            if (this.data.statusSortUserName){
                this.data.statusSortId = '';
                this.data.statusSortName = '';
                this.data.statusSortEmail = '';
            }

            this.sort('username');
        });

        this.sortEmail.addEventListener('click', (e) => {
            e.preventDefault();
            this.data.statusSortEmail =! this.data.statusSortEmail;

            if (this.data.statusSortEmail){
                this.data.statusSortId = '';
                this.data.statusSortName = '';
                this.data.statusSortUserName = '';
            }

            this.sort('email');
        });
    }

    sort(type) {
        this.data.userArr.sort((a, b) => {
            let elemA;
            let elemB;

            switch (type) {
                case 'id':
                    elemA = a.id;
                    elemB = b.id;
                    break;
                case 'name':
                    elemA = a.name.toUpperCase();
                    elemB = b.name.toUpperCase();
                    break;
                case 'username':
                    elemA = a.username.toUpperCase();
                    elemB = b.username.toUpperCase();
                    break;
                case 'email':
                    elemA = a.email.toUpperCase();
                    elemB = b.email.toUpperCase();
            }

            if (elemA < elemB) {
                return -1;
            } else if (elemA > elemB) {
                return 1;
            } else {
                return 0;
            }
        });

        this.render.renderTable();
    }

    initSearch() {
        this.searchInfo.addEventListener('input', () => {
            this.render.whiteBackground();
        });

        this.searchInfo.onkeyup = (event) => {
            if (event.keyCode == 13) {
                let allHtml = document.querySelectorAll('tbody th,td');
                let arrAllHtml = [...allHtml];

                if (this.searchInfo.value != '') {
                    let pattern = new RegExp(this.searchInfo.value.trim(), 'i'); //!!

                    arrAllHtml.forEach((elem) => {
                        if (elem.innerHTML.search(pattern) > -1) {  //!!
                            this.render.showCoincidence(elem);
                        }
                    });
                }
            }
        }
    }
}

const data = new Data();
const render = new Render(data);
const listener = new Listener(data,render);

listener.initApp();