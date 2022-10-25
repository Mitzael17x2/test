import { MiTabs } from "./modules/MiTabs.js";
import { MiDropList_DE } from "./modules/MiDropList-DE.js";

const tab = new MiTabs('.cabinet__nav', '.cabinet__content');


//spoilers

if(document.querySelector('.purchase')) {

    new MiDropList_DE('.purchase', '.purchase__wrapper', false,
    {
        animation: 'growing',
        event: 'click',
        duration: '250',
        protected: '0',
        timingFunction: 'linear',
        delay: '0',
        //changeListDuration: '500',
        waitOtherLists: false,
        closeOtherLists: false,
    });

}


//send from

const main_form = document.querySelector('#about_you_form');

if(main_form) {

    const email_input = main_form.querySelector('input[name="email"]');
    const initial_email_value = email_input.value;

    const popupEmail = document.querySelector('#confirm-email-popup')
    const readonlyEmail = email_input.hasAttribute('readonly');

    const confirmEmailButton = document.querySelector('#confirm-email-button');
    const emailCodeInput = document.querySelector('#popup_confirm_email_input');

    let flagSubmit = false;

    confirmEmailButton.addEventListener('click', () => {

        const data = new FormData();

        data.append('email', email_input.value);
        data.append('code', emailCodeInput.value);

        confirmEmailButton.innerHTML = 'Загрузка..';

        fetch(main_form.action, {
            method: 'post',
            body: data 
        })
        .then( res => res.json())
        .then( res => {

            if(res.success) {

                flagSubmit = true;

                main_form.submit();

            }

            if(res.error) {

                emailCodeInput.value = res.error;

                emailCodeInput.addEventListener('focus', () => {

                    emailCodeInput.value = '';

                }, {once:true})

                confirmEmailButton.innerHTML = 'Оправить';

            }

        });
    })

    main_form.addEventListener('submit', (event) => {

        if(flagSubmit || readonlyEmail || initial_email_value === email_input.value) return;
        
        event.preventDefault();

        openPopup(popupEmail);

        return false;

    })

    
    function openPopup(popup) {

        popup.style.opacity = 0;
    
        popup.style.display = 'block';
    
        setTimeout( () => {
    
            popup.style.opacity = 1;
    
        }, 50)
    

        //------------


        const data = new FormData();

        data.append('email', email_input.value);
        data.append('check_email', true);

        fetch(main_form.action, {
            method: 'post',
            body: data 
        })
        .then( res => res.json())
        .then( res => {

            if(res.error) {

                alert(res.error);

            }

        })

    }


}

