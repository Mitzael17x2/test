import { MiTabs } from "./modules/MiTabs.js";
import { MiDropList_DE } from "./modules/MiDropList-DE.js";


//-------

const cartDeliverTab = new MiTabs('.order__nav', '.order__tabBody');

const inputGift = document.querySelector('.gift_checkbox');

if(inputGift) {


    const container = document.querySelector('.options__packingContainer');

    inputGift.addEventListener('change', showPacknig);

    showPacknig();

    function showPacknig() {

        if(inputGift.checked) {

            container.style.height = 'auto';

            let height = container.offsetHeight + 'px';

            container.style.height = 0;

            setTimeout( () => {

                container.style.height = height;

            }, 50)

            return;

        }

        container.style.height = '0';

    }

}

//-------


const cityList = document.querySelector('.order__cities');

if(cityList) {

    const citiesList = new MiDropList_DE('.order__cities', '.order__listCities', false, {
        animation: 'opacity',
        event: 'click',
        duration: '250',
        protected: '0',
        timingFunction: 'linear',
        delay: '0',
        waitOtherLists: false,
        closeOtherLists: false,
    })

    const inputs = cityList.querySelectorAll('input');
    const selectedCity = cityList.querySelector('.order__selectedCity');

    if(inputs.length) {

        inputs.forEach( input => {

            input.addEventListener('change', () => {

                const value = input.closest('.order__city').querySelector('label').innerHTML;
                
                selectedCity.querySelector('span').innerHTML = value;
                
                citiesList.hide(cityList, true);

            });

        })

    }

    const openDefaultList = document.querySelector('[data-openlist-default]');

    if(openDefaultList) {

        document.addEventListener('DOMContentLoaded', () => {
            openDefaultList.dispatchEvent(new Event('click'));
        })

    }

}


//------

if(document.querySelector('.courierDeliver__spoiler')) {

    new MiDropList_DE('.courierDeliver__spoiler', '.courierDeliver__list', false, {
        animation: 'opacity',
        event: 'click',
        duration: '150',
        protected: '0',
        timingFunction: 'linear',
        delay: '0',
        waitOtherLists: false,
        closeOtherLists: false,
    })

}