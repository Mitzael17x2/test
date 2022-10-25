import { createElement, resize } from "./modules/functions.js";
import { maskPhone } from "./modules/baseFunctionForm.js";
import { MiDropList_DE } from "./modules/MiDropList-DE.js";
import { MiTabs } from "./modules/MiTabs.js";

function openPopup(popup) {

    popup.style.opacity = 0;

    popup.style.display = 'block';

    setTimeout( () => {

        popup.style.opacity = 1;

    }, 50)

}

//heart_animation (favorite)

// const favoriesIcon = document.querySelectorAll('.product__favorite, .good__favorite');

// if(favoriesIcon.length) {

//     favoriesIcon.forEach( icon => icon.addEventListener('click', () => icon.classList.toggle('active')));

// }



//burger

const burger = document.querySelector('.header__burger');

if(burger) {

    const menu = document.querySelector('.header__menu');

    burger.addEventListener('click', () => {

        burger.classList.toggle('active');
        menu.classList.toggle('active');

        document.documentElement.classList.toggle('header-blocked');
        

    });

}

// burger nav

const header_refers = document.querySelectorAll('[data-header-refer]');

if(header_refers.length) {
    
    header_refers.forEach( refer => {

        const id = refer.dataset.headerRefer;
        const block = document.getElementById(id);
        const returnButton = block.querySelector('.submenu__close');

        refer.addEventListener('click', () => {

            hideShowBlock(refer, block)
        });

        returnButton.addEventListener('click', (event) => {

            event.stopPropagation();

            hideShowBlock(refer, block)
        });

    })

    function hideShowBlock(refer, block) {

        refer.classList.toggle('active');
        block.classList.toggle('active');

    }

}

//replace list of cities

const cityList = document.querySelector('#header_list_place');
const cityParentBlock = document.querySelector('[data-header-refer="header_list_place"]');
const cityContainerButton = cityParentBlock.closest('.header__containerButton');

resize( function() {

    if(document.documentElement.offsetWidth < 1024) {

        cityContainerButton.append(cityList);

        return;
    }

    cityParentBlock.append(cityList);

});

//ajax change city 

if(cityList) {

    const cityies = cityList.querySelectorAll('input[type="radio"]'); 
    const urlEditCity = cityList.dataset.linkToEdit;

    if(cityies.length) {

        cityies.forEach( city => {

            city.addEventListener('change', () => {

                if(!city.checked) return;

                const data = new FormData();

                data.append('change_city', true);

                data.append('cityId', city.value);

                fetch(urlEditCity, {
                    method: 'POST',
                    body: data
                })
                

            })

        })

    }

}


//catalogMenu

new MiDropList_DE('.headerCatalogMenu__list--hasChild', '.headerCatalogMenu__items', false,

{
    animation: 'none',
    event: 'click',
    duration: '250',
    protected: '0',
    timingFunction: 'linear',
    delay: '0',
    //changeListDuration: '500',
    waitOtherLists: false,
    //closeOtherLists: true,
    media: 1024,
},
{
    animation: 'growing',
    event: 'click',
    duration: '250',
    protected: '0',
    timingFunction: 'linear',
    delay: '0',
    //changeListDuration: '500',
    waitOtherLists: false,
    //closeOtherLists: true,
    media: 1,
})

//adress list

const headerAdressBlock = document.querySelector('.headerPlace');

if(headerAdressBlock) {

    const list = document.querySelector('.headerPlace__list');
    const button = headerAdressBlock.querySelector('button');

    button.addEventListener('click', changeCity);
    list.addEventListener('click', changeCity);

    function changeCity(event) {

        const selected = headerAdressBlock.querySelector('.headerPlace__selected')

        let label = event.target.closest('label')

        if(label) {

            console.log(selected);

            selected.innerHTML = label.innerHTML;

        }

        if(document.documentElement.offsetWidth >= 1024) {

            event.stopPropagation();

            headerAdressBlock.classList.toggle('active-list');
            list.classList.toggle('active-list');



        }
    
    }

}

// mask for phone input

document.querySelector('.tel') && maskPhone('.tel');

document.querySelector('.tel-with-code') && maskPhone('.tel-with-code', '(___) ___-__-__');

//focus input hint

const inputWrappers = document.querySelectorAll('.input-wrapper');

if(inputWrappers) {

    inputWrappers.forEach( wrapper => {

        const input = wrapper.querySelector('input');
            
        input.addEventListener('focus', () => wrapper.classList.add('active'));
        input.addEventListener('blur', () => wrapper.classList.remove('active'))

    });

}


//vh

let vh = window.innerHeight * 0.01;

document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {

  let vh = window.innerHeight * 0.01;
  
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});



//change image on hover
 
const headerCatalog = document.getElementById('header_catalog');

if(headerCatalog) {

    const refers = headerCatalog.querySelectorAll('[data-img]');
    const images = headerCatalog.querySelector('.headerCatalogMenu__images');

    if(refers.length) {


        refers.forEach( refer => {

            refer.addEventListener('pointerenter', () => {

                let wait = setTimeout(() => {

                    const src = refer.dataset.img;
                    const activeImg = images.querySelector('.active');
                    activeImg.classList.remove('active');
                    const img = activeImg.cloneNode(true);
    
                    img.querySelector('img').src = src;
    
                    images.append(img);
    
                    setTimeout( () => {
    
                        img.classList.add('active');
    
                    }, 50)
    
                    activeImg.addEventListener('transitionend', () => {
    
                        activeImg.remove();
    
                    }, {once: true});
    
                    activeImg.style.left = '150%';

                }, 500)


                refer.addEventListener('pointerleave', () => {

                    clearTimeout(wait);

                }, {once: true})


            });

        })

    }

}


//popup

const registrationPopup = document.querySelector('#registration_popup');

if(registrationPopup) {

    new MiTabs('.popup__nav--registration', '.popup__content--registration');

    //----backend

    const inputs = registrationPopup.querySelectorAll('input');
    const buttons = registrationPopup.querySelectorAll('button');

    blockFields();

    inputs.forEach( input => {

        input.addEventListener('input', blockFields)

    })


    function blockFields() {

        inputs.forEach( input => {

            const popupBody = input.closest('.popup__body');
            const button = popupBody.querySelector('button');
            const inputErrors = popupBody.closest('.popup').querySelectorAll('[data-error]');

            if(inputErrors.length) { 

                console.log(inputErrors);

                inputErrors.forEach( error => {
                    error.remove();
                })

            }

            if(input.id === 'popup_phone_for_regist') {

                const number = input.value.replace(/\D/g, '');

                if(number.length < 11) {

                    button.disabled = true;
                    button.style.cursor = 'default';
                    button.style.opacity = '.7';

                    return;

                }
                
                button.disabled = false;
                button.style.cursor = null;
                button.style.opacity = null;

                return;

            }

            if(input.id === 'popup_email') {

                const pattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

                if(!input.value.match(pattern)) {

                    button.disabled = true;
                    button.style.cursor = 'default';
                    button.style.opacity = '.7';

                    return;

                }
                
                button.disabled = false;
                button.style.cursor = null;
                button.style.opacity = null;

                return;

            }

        })

    }



    //------------
    
    buttons.forEach( button => {

        button.addEventListener('click', () => {

            const inputs = button.closest('.popup__body').querySelectorAll('input');
            const input = [...inputs].find( input => input.type !== 'hidden');

            if(input.id === 'popup_phone_for_regist') {

                const number = input.value.replace(/\D/g, '');
                const block = button.closest('.popup__body');
                const url = input.closest('[data-url]').dataset.url;

                if(number.length < 11) {

                    button.disabled = true;
                    button.style.cursor = 'default';
                    button.style.opacity = '.7';

                    return;

                }

                const data = new FormData();
                data.append('telephone', input.value);
                
                const codeInput = block.querySelector('#phone-code');

                if(codeInput) {

                    data.append('code', codeInput.value);

                }

                button.innerHTML = 'Загрузка..';
                button.disabled = true;

                fetch(url, {
                    method: 'POST',
                    body: data
                })
                .then( res => res.json())
                .then( res => {

                    button.disabled = false;

                    if(res.show_code_input) {

                    const code_html = `
                        <div data-code>
                            <label for="phone-code">Введите код</label>
                            <input name="code" type="text" class="input-field" id="phone-code">
                            <div style="cursor: pointer; margin-top: 5px" data-return>Поменять номер телефона</div>
                        </div>
                    `;

                    block.querySelector('[data-hide-block]').style.display = 'none';

                    button.insertAdjacentHTML('beforebegin', code_html);

                    block.querySelector('[data-return]').addEventListener('click', function() {

                        this.closest('[data-code]').remove();

                        block.querySelector('[data-hide-block]').style.display = null;

                        const parent_seconds_block = block.querySelector('[data-delay-block]');

                        if(parent_seconds_block) parent_seconds_block.remove();


                        button.innerHTML = 'Получить код';


                    })

                    button.innerHTML = 'Подтвердить';

                    button.closest('.popup__body').querySelector('[data-code]').querySelector('input').addEventListener('input', () => {

                        const popupBody = input.closest('.popup__body');
                        const inputErrors = popupBody.closest('.popup').querySelectorAll('[data-error]');
            
                        if(inputErrors.length) { 
                            
                            inputErrors.forEach( error => {
                                error.remove();
                            })
            
                        }
                        
                    })


                    if(res.delay) {
                        
                        function createHintDelay() {

                            const delay_block = document.createElement('div');
                            let seconds_before_send = res.delay;
                            delay_block.setAttribute('data-delay-block', '');
    
                            delay_block.style.fontSize = '12px';
                            delay_block.style.margin = '10px 0 0';
    
                            delay_block.innerHTML = `повторная отправка возможна через <span>${seconds_before_send}</span>`;
    
                            button.insertAdjacentElement('beforebegin', delay_block);
    
                            beginCount();
    
                            function beginCount() {
    
                                const parent_seconds_block = block.querySelector('[data-delay-block]');
                                const seconds_block = parent_seconds_block.querySelector('span');
                                     
                                
                                let interval = setInterval( () => {
    
                                    seconds_before_send--;
    
                                    seconds_block.innerHTML = seconds_before_send;
    
                                    if(res.delay - seconds_before_send >= 60) {
    
                                        clearInterval(interval);
    
                                        parent_seconds_block.style.color = "blue";
                                        parent_seconds_block.style.cursor = 'pointer';

                                        parent_seconds_block.innerHTML = 'Отправить еще раз';
    
                                        parent_seconds_block.onclick = () => {
    
                                            const data = new FormData();

                                            data.append('telephone', input.value);

                                            data.append('new_code', true);
                            
                                            button.innerHTML = 'Загрузка..';

                                            fetch(url, {
                                                method: 'POST',
                                                body: data
                                            })
                                            .then( res => {

                                                parent_seconds_block.remove();

                                                button.innerHTML = 'Подтвердить';

                                                createHintDelay();

                                            })


                                        }
    
    
                                    }
    
                                }, 1000)
    
                            }

                        }

                        createHintDelay();


                    }

                    }

                    if(res.success) {
                        
                        if(res.redirect) document.location.href = res.redirect;

                    }

                    if(res.error) {

                        const error = createElement('div', {
                            text: res.error,
                            callback(element) {
                                
                                element.dataset.error = 'true';
                                element.style.color = 'red';
                                element.style.fontSize = '12px';

                            }
                        })

                        button.innerHTML = 'Подтвердить'
                        
                        button.insertAdjacentElement('beforebegin', error);

                        button.addEventListener('click', () => {

                            error.remove();

                        }, {once:true});

                    }

                });

            }

            if(input.id === 'popup_email') {

                const block = button.closest('.popup__body');
                const url = input.closest('[data-url]').dataset.url;


                const data = new FormData();
                data.append('email', input.value);
                
                const codeInput = block.querySelector('#email-code');

                if(codeInput) {
                    
                    data.append('code', codeInput.value);

                }

                button.innerHTML = 'Загрузка..';
                button.disabled = true;

                fetch(url, {
                    method: 'POST',
                    body: data
                })
                .then( res => res.json())
                .then( res => {

                    button.disabled = false;

                    if(res.show_code_input) {

                    const code_html = `
                        <div data-code>
                            <label for="phone-code">Введите код</label>
                            <input name="code" type="text" class="input-field" id="email-code">
                            <div style="cursor: pointer; margin-top: 5px" data-return>Поменять email</div>
                        </div>
                    `;

                    block.querySelector('[data-hide-block]').style.display = 'none';

                    button.insertAdjacentHTML('beforebegin', code_html);


                    block.querySelector('[data-return]').addEventListener('click', function() {

                        this.closest('[data-code]').remove();

                        block.querySelector('[data-hide-block]').style.display = null;

                        button.innerHTML = 'Получить код';


                    })

                    button.innerHTML = 'Подтвердить';

                    }

                    if(res.success) {
                        
                        if(res.redirect) document.location.href = res.redirect;

                    }

                    if(res.error) {

                        const error = createElement('div', {
                            text: res.error,
                            callback(element) {

                                element.dataset.error = 'true';
                                element.style.color = 'red';
                                element.style.fontSize = '12px';

                            }
                        })

                        button.innerHTML = 'Подтвердить'
                        
                        button.insertAdjacentElement('beforebegin', error);

                        button.addEventListener('click', () => {

                            error.remove();

                        }, {once:true});

                    }

                });

            }



        });

    })

}


const popups = document.querySelectorAll('.popup');

if(popups.length) {

    popups.forEach(popup => {
        
        popup.addEventListener('click', (event) => {

            const target = event.target;

            if(event.target.closest('.popup__close') || event.target.classList.contains('popup')) {

                popup.style.opacity = '0';

                popup.addEventListener('transitionend', () => {

                    popup.style.display = 'none';

                }, {once:true});

            };


        })

    })

}


const buttonPopus = document.querySelectorAll('[data-popup]');

if(buttonPopus.length) {

    buttonPopus.forEach( button => {

        button.addEventListener('click', (event) => {

            event.preventDefault();
            
            const popup = document.getElementById(button.dataset.popup);

            openPopup(popup);

            return false;

        })

    })

}



//header changes

const header = document.querySelector('header');

if(header) {

    const burger_adaptive = 1024;

    let headerHeight = header.offsetHeight;
    const socials = header.querySelector('.header__socials');
    const menu = header.querySelector('.header__menu');
    const buttonContainer = header.querySelector('[data-replace]');
    const headerContent = header.querySelector('.header');
    const initialContainerOfCatalogMenu = headerContent.lastElementChild.querySelector('.header__menuWrapper');
    const headerLogo = headerContent.querySelector('.header__logo');

    window.addEventListener('scroll', headerScroll)

    resize(function() {

        if(document.documentElement.offsetWidth < burger_adaptive) {

            menu.style.display = null;
            socials.style.display = null;
            headerLogo.style.margin = null;

            initialContainerOfCatalogMenu.prepend(buttonContainer);

            headerHeight = header.offsetHeight;

            headerScroll();

            return;
        }


    })

    function headerScroll() {

        if(!header.classList.contains('header-scrolling') && document.documentElement.scrollTop > headerHeight + 300) {

            header.style.transform = 'translateY(calc(-100%)';

            header.setAttribute('data-scrolling', 'true');


            setTimeout( () => {

                document.documentElement.style.paddingTop = headerHeight + 'px';
                
                if(document.documentElement.offsetWidth >= burger_adaptive) {

                    menu.style.display = 'none';
                    socials.style.display = 'none';
                    headerLogo.style.margin = '0 0 0 -185px';

                    headerContent.firstElementChild.prepend(buttonContainer);
    
                }

                header.classList.add('header-scrolling');
                header.style.transform = 'translateY(0%)';

                
            }, 50)

        }

        if(header.classList.contains('header-scrolling') && document.documentElement.scrollTop < headerHeight + 300) {

            header.style.transform = 'translateY(-100%)';
            header.removeAttribute('data-scrolling')

            header.addEventListener('transitionend', () => {

                if(header.dataset.scrolling) return;

                header.classList.remove('header-scrolling');
                document.documentElement.style.paddingTop = null;
                header.style.transform = null;

                if(document.documentElement.offsetWidth >= burger_adaptive) {

                    menu.style.display = null;
                    socials.style.display = null;
                    headerLogo.style.margin = null;
    

                    initialContainerOfCatalogMenu.prepend(buttonContainer);
    
                }

            }, {once:true});

        }
    }

}

