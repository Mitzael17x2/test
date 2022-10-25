import noUiSlider from 'nouislider';
import { createElement, resize } from "./modules/functions.js";

//Сортировка

const sortButton = document.querySelector('.catalogMenu__sort');

if(sortButton) {

    const sortList = document.querySelector('.catalogMenu__sortList');


    sortButton.addEventListener('click', () => {


        sortButton.classList.toggle('active');
        sortList.classList.toggle('active');

        document.documentElement.classList.add('sort-blocked');


    });

    sortList.addEventListener('click', (event) => {
            
        if(event.target !== sortList) return false;

        document.documentElement.classList.remove('sort-blocked');

        sortButton.classList.remove('active');
        sortList.classList.remove('active');

    })

}

//Открытие/скрытие фильтра

const filterButton = document.querySelector('.catalogMenu__filter');
const filterShowButton = document.querySelector('.filters__showProducts');


if(filterButton) {

    const filtersMenu = document.querySelector('.catalogMenu__filters');
    const filterClose = document.querySelector('.filters__close');
    const filter_resets_buttons = document.querySelectorAll('.filters__reset');


    filterButton.addEventListener('click', openCloseFilterMenu);
    filterClose.addEventListener('click', openCloseFilterMenu);
    filterShowButton.addEventListener('click', openCloseFilterMenu);

    filter_resets_buttons.forEach(button => {

        button.addEventListener('click', () => {

            resetFilters(button);

        })

    })



    function openCloseFilterMenu() {

        filterButton.classList.toggle('active');
        filtersMenu.classList.toggle('active');
        document.documentElement.classList.toggle('filter-blocked');

    }
    

}

//Навигация по фильтру

const filterNavButtons = document.querySelectorAll('[data-filter-refer]');

if(filterNavButtons) {

    filterNavButtons.forEach(button => {

        button.addEventListener('click', (event) => {

            
            if(document.documentElement.clientWidth > 1023 && button.closest('.filters__checkbox--refer')) return false;

            const checkbox = event.target.closest('.filters__checkbox--refer')

            if(checkbox && (event.target.closest('input') || event.target.closest('label'))) return false;

            const id = button.dataset.filterRefer;
            const block = document.getElementById(id);

            block.classList.toggle('active');
            button.classList.add('filters__disappItem');

        })


    });

}

//Диапозон цены

const rangeSlider = document.querySelector('#range_slider');

let startValueRange = document.getElementById('input_minPrice').value;

startValueRange = +startValueRange ? +startValueRange : +rangeSlider.dataset.min;

let endValueRange = document.getElementById('input_maxPrice').value;

endValueRange = +endValueRange ? +endValueRange : +rangeSlider.dataset.max;

noUiSlider.create(rangeSlider, {
    start: [+startValueRange, +endValueRange],
    connect: true,
    step: 1,
    range: {
        'min': [+rangeSlider.dataset.min],
        'max': [+rangeSlider.dataset.max]
    }
});


const inputs = [document.getElementById('input_minPrice'), document.getElementById('input_maxPrice')];
const rangePrices = inputs;


rangeSlider.noUiSlider.on('update', function(values, handle) {

    let value = Math.round(values[handle])

    let copy_value = `${(+value).toLocaleString()}`.replace(',', ' ');

    rangePrices[handle].value = copy_value + rangeSlider.dataset.currency;

    const own_hint = rangePrices[handle].parentElement.querySelector('.filters__hintClose');

    showHideButtonsOfFiltes();


    if(!own_hint && !(rangePrices[handle].max == value || rangePrices[handle].min == value)) {

        createFilter(rangePrices[handle].parentElement, rangePrices[handle].value, 'price');

        return;

    }


    if(own_hint && (value == rangePrices[handle].max || value == rangePrices[handle].min )) {

        deleteFilter(rangePrices[handle].parentElement, '', 'price');

        return;
    }

    let idBlock = rangePrices[handle].closest('.filters__block').id;
    const filterItem = document.querySelector(`.filters__item[data-filter-refer="${idBlock}"]`);
    const hint = filterItem.querySelector('.filters__hint');


    if(hint) {

        let type = rangePrices[handle].max ? 'data-maxPrice' : 'data-minPrice';


        if(type === 'data-maxPrice' && (value == rangePrices[1].max)) {

            checkEmptyHint(hint);

            return

        };
        if(type === 'data-minPrice' && value == rangePrices[0].min && own_hint) {

            checkEmptyHint(hint);

            return;
        }

        value = rangePrices[handle].max ? ' до ' + rangePrices[handle].value : 'от ' + rangePrices[handle].value;
    

        let hint_text_block = hint.querySelector(`[${type}]`);

        if(hint_text_block) {
            hint_text_block.innerHTML = value;
        }

    }


})

const setRangeSlider = (index, value) => {
    let arr = [null, null]
    arr[index] = value;

    rangeSlider.noUiSlider.set(arr);
};


inputs.forEach( (input, index) => {

    input.addEventListener('change', (event) => {

        let value = input.value.replace(rangeSlider.dataset.currency, '');
        value = value.replace(' ', '');

        setRangeSlider(index, value);     

    });

});


//Скрыть блок фильтра

const return_buttons = document.querySelectorAll('.filters__return');

if(return_buttons) {

    return_buttons.forEach ( button => {

        button.addEventListener('click', () => {

            const block = button.closest('.filters__block');
            const referButton = document.querySelector(`[data-filter-refer="${block.id}"]`);
            block.classList.remove('active');
    
            referButton.classList.remove('filters__disappItem')
            
        })

    })

}

//UI выбранные фильтры

const filters_parameters = [document.querySelectorAll('.filters__radio'), document.querySelectorAll('.filters__checkbox')]

const minInputRange = document.getElementById('input_minPrice');
const maxInputRange = document.getElementById('input_maxPrice');

if(filters_parameters) {

    const priceFilters = [...filters_parameters[1]].filter( (input, index) => input.closest('.range__checkboxs'));
    filters_parameters[1] = [...filters_parameters[1]].filter( input => !input.closest('.range__checkboxs'));


    filters_parameters.forEach( (arr, index) => {

        if(index === 0) {

            arr.forEach( radio => {

                const input = radio.querySelector('input');

                input.addEventListener('change', (event) => {

                    const label = radio.querySelector(`label[for="${input.id}"]`);
                    const value = label.innerHTML;

                    if(input.checked) {

                        createFilter(input, value, 'radio');

                    }




                });

                if(input.checked) input.dispatchEvent(new Event('change'));

            })

            return;

        }

        arr.forEach( checkbox => {

            const input = checkbox.querySelector('input');

            checkbox.addEventListener('click', () => {

                if(document.documentElement.offsetWidth < 1024) return;

                input.checked = input.checked ? null : true;

                input.dispatchEvent(new Event('change'))

            })

            input.addEventListener('change', (event) => {

                const label = checkbox.querySelector(`label[for="${input.id}"]`);

                let value = label.querySelector('span').innerHTML;

                if(input.checked) {

                    createFilter(input, value);

                    checkbox.classList.add('active');


                } else {

                    deleteFilter(input, value);

                    checkbox.classList.remove('active');


                }

                let refer = input.closest('.filters__checkbox--refer');

                if(refer) {
                    
                    const child_block = document.getElementById(refer.dataset.filterRefer);
                    const child_inputs = child_block.querySelectorAll('input[type="checkbox"]');

                    wrapFilter(input);

                    if(input.checked) {

                        child_inputs.forEach( input => {

                            input.closest('.filters__checkbox').classList.add('active');

                            input.checked = true

                        });

                        return;

                    }

                    child_inputs.forEach( input => {

                        const checkbox = input.closest('.filters__checkbox');

                        input.checked = null

                        checkbox.classList.remove('active');
                        


                    });
                    

                }


                const parent = getParentBlock(input);

                if(parent) {

                    unwrapFilter(input);

                }

            });

            if(input.checked) {

                const refer = input.closest('.filters__checkbox--refer')

                if(refer) {

                    
                    input.dispatchEvent(new Event('change'));

                    return;

                }

                const parent = getParentBlock(input);

                if(parent && parent.querySelector('input').checked) return false;

                input.dispatchEvent(new Event('change'));

            };

        })


    })

    priceFilters.forEach( inputBlock => {

        inputBlock.addEventListener('change', (event) => {

            if(!inputBlock.querySelector('input[type="checkbox"]').checked) return false;

            const min = inputBlock.dataset.minsum;
            const max = inputBlock.dataset.maxsum;

            if(min) {

                minInputRange.value = min;

                minInputRange.dispatchEvent(new Event('change'));


            }

            if(max) {

                maxInputRange.value = max;

                maxInputRange.dispatchEvent(new Event('change'));

            }

        });

    }) 

}

function createFilter(input, value, type = 'checkbox') {

    if(type === 'price') {

        let idBlock = input.closest('.filters__block').id;

        const filterItem = document.querySelector(`.filters__item[data-filter-refer="${idBlock}"]`);

        let filter_hint = filterItem.querySelector('.filters__hint') || document.querySelector(`.filters__item[data-filter-item="${idBlock}"]`);

        console.log(filter_hint)

        if(!filter_hint) {
            filter_hint = createElement('div', {
    
                classes: ['filters__hint'],
                text: `<span style="padding-right: 5px" data-minPrice></span><span data-maxPrice></span>`,
        
                callback(element) {
                    
                    element.dataset.filterItem = idBlock;

                    element.append(createElement('div', {
        
                        classes: ['filters__hintClose'],
        
                        callback(element) {
        
                            element.addEventListener('click', (event) => {
        
                                event.stopPropagation();
        
                                const block = document.getElementById(idBlock);
                                const inputs = block.querySelectorAll('input');
                                const hint = element.closest('.filters__hint');
        
                                inputs.forEach(input => input.checked = null);
        
                                filterItem.classList.remove('has-filters');

                                let min_close_icon = minInputRange.parentElement.querySelector('.filters__hintClose');
                                let max_close_icon = maxInputRange.parentElement.querySelector('.filters__hintClose');

                                min_close_icon && min_close_icon.dispatchEvent(new Event('click'));
                                max_close_icon && max_close_icon.dispatchEvent(new Event('click'));

                                hint.remove();

                                showHideButtonsOfFiltes();
    
        
                            });
                        }
                    }));
                }
    
            });
        }

        let input_field = input.querySelector('input');
        let type = input_field.max ? 'data-maxPrice' : 'data-minPrice';
        let hint_text_block = filter_hint.querySelector(`[${type}]`);
        value = input_field.max ? ' до ' + value : 'от ' + value;

        if(hint_text_block) {

            hint_text_block.innerHTML = value;

        }

        filterItem.classList.add('has-filters');

        filterItem.append(filter_hint);

        moveFilters();


        const close_icon = createElement('div', {
    
            classes: ['filters__hintClose'],

            callback(element) {

                element.addEventListener('click', (event) => {

                    event.stopPropagation();

                    const input = element.parentElement.querySelector('input');

                    input.value = input.max ? input.max : input.min;

                    const hint = filterItem.querySelector('.filters__hint');

                    if(hint) {

                        if(input.max) {

                            hint.children[1].innerHTML = '';


                        } else {

                            hint.firstElementChild.innerHTML = '';

                        }

                    }

                    input.dispatchEvent(new Event('change'));

                });
            }
        })

        input.append(close_icon);

        showHideButtonsOfFiltes();

        return;
    }

    let idBlock;

    let parent = getParentBlock(input);

    if(parent) {

        const parent_input = parent.querySelector('input[type="checkbox"]');
        const parent_value = parent.querySelector(`label[for="${parent_input.id}"]`).querySelector('span').innerHTML;

        if(parent_input.checked) deleteFilter(parent_input, parent_value);


        idBlock = parent.closest('.filters__block').id;

    } else {

       idBlock = input.closest('.filters__block').id;

    }

    const desktopContainer = document.querySelector('.filters__choosenFilters');
    const filterItem = document.querySelector(`.filters__item[data-filter-refer="${idBlock}"]`);
    let filter_hint = filterItem.querySelector('.filters__hint') || desktopContainer.querySelector(`.filters__hint[data-filter-item="${idBlock}"]`);

    if(type === 'radio') {

        if(filter_hint) {

            filter_hint.querySelector('span').innerHTML = value;
            filter_hint.querySelector('div').dataset.inputRefer = input.id;

            return;
        }

        filter_hint = createElement('div', {

            classes: ['filters__hint'],
            text: `<span>${value}</span>`,

            callback(element) {
                
                element.dataset.filterItem = idBlock;

                element.append(createElement('div', {
                    classes: ['filters__hintClose'],
                    callback(element) {

                        element.dataset.inputRefer = input.id;

                        element.addEventListener('click', (event) => {

                            event.stopPropagation();

                            const input = document.querySelector(`input#${element.dataset.inputRefer}`);

                            input.checked = null;

                            const hint = element.closest('.filters__hint');

                            hint.remove();
                            
                            filterItem.classList.remove('has-filters');

                            showHideButtonsOfFiltes();

                        });
                    }
                }));
            }
        });

        filterItem.append(filter_hint);

        filterItem.classList.add('has-filters');

        moveFilters();

        showHideButtonsOfFiltes();

        return;

    }

    if(type === 'checkbox') {
        
        if(filter_hint) {

            const span = filter_hint.querySelector('span');
    
            span.innerHTML = span.innerHTML + ', ' + value;
    
            return;
        }
    
        filter_hint = createElement('div', {
    
            classes: ['filters__hint'],
            text: `<span>${value}</span>`,
    
            callback(element) {
                
                element.dataset.filterItem = filterItem.dataset.filterRefer;

                element.append(createElement('div', {
    
                    classes: ['filters__hintClose'],
    
                    callback(element) {
    
                        element.addEventListener('click', (event) => {
    
                            event.stopPropagation();
    
                            const block = document.getElementById(idBlock);
                            const inputs = block.querySelectorAll('input');
                            const hint = element.closest('.filters__hint');
    
                            inputs.forEach(input => {

                                const checkbox = input.closest('.filters__checkbox');

                                if(checkbox) checkbox.classList.remove('active');

                                input.checked = null
                            });
    
                            hint.remove();
    
                            filterItem.classList.remove('has-filters');

                            showHideButtonsOfFiltes();
    
                        });
                    }
                }));
            }

        });
    
        filterItem.append(filter_hint);
    
        filterItem.classList.add('has-filters');

        moveFilters();

        showHideButtonsOfFiltes();
    }


}

function deleteFilter(input, value, type = 'usual') {

    if(type === 'price') {

        input.querySelector('.filters__hintClose').remove();

        const blockId = input.closest('.filters__block').id;
        const refer = document.querySelector(`[data-filter-refer="${blockId}"]`);
        const hint = refer.querySelector('.filters__hint');

        if(hint) {

            let type = input.querySelector('#input_maxPrice') ? 'data-maxprice' : 'data-minprice';

            hint.querySelector(`[${type}]`) && hint.querySelector(`[${type}]`).remove();

            if(!hint.querySelector('span')) {

                hint.remove()

                refer.classList.remove('has-filters');

            };



        }
         

        showHideButtonsOfFiltes();

        return;

    }

    let idBlock;

    let parent = getParentBlock(input);
    
    if(parent) {

        idBlock = parent.dataset.filterRefer;

        parent.classList.remove('active')

        const child_filters_container = document.getElementById(idBlock);

        const child_inputs = child_filters_container.querySelectorAll('input[type="checkbox"]');

        if(input.closest('.filters__checkbox--refer')) {

            child_inputs.forEach( input => {

                input.checked = null;
    
            });

        }


        showHideButtonsOfFiltes();
        
        idBlock = parent.parentElement.closest('.filters__block').id;

    } 
    else {
        idBlock = input.closest('.filters__block').id;
    }


    const filterItem = document.querySelector(`.filters__item[data-filter-refer="${idBlock}"]`);

    if(!filterItem) return false;

    const filter_hint = filterItem.querySelector('.filters__hint') || document.querySelector(`.filters__hint[data-filter-item="${idBlock}"]`);
   
    if(!filter_hint) return;

    const span = filter_hint.querySelector('span');

    let arr = span.innerHTML.split(', ');

    arr = arr.filter( item => item !== value);

    if(arr.length === 0) {

        filterItem.classList.remove('has-filters')

        filter_hint.remove();
        
        showHideButtonsOfFiltes();

        return;

    }

    span.innerHTML = arr.join(', ');

}

function getParentBlock(input) {

    const filter_block = input.closest('.filters__block');

    const parent = document.querySelector(`.filters__checkbox--refer[data-filter-refer="${filter_block.id}"]`);

    if(parent) return parent;

    return false;

}

function unwrapFilter(input) {

    const parent = getParentBlock(input);
    const parent_input = parent.querySelector('input[type="checkbox"]');


    if(!parent_input.checked) return;

    const block = input.closest('.filters__block');
    const inputs = block.querySelectorAll('input:checked');

    parent_input.checked = null;
    

    deleteFilter(parent_input, parent.querySelector('label').querySelector('span').innerHTML);


    if(inputs) {

        inputs.forEach( input => {

            const checkbox = input.closest('.filters__checkbox')

            let value = checkbox.querySelector('label').querySelector('span').innerHTML;

            createFilter(input, value);

        })

    }

}

function wrapFilter(input) {

    const child_id = input.closest('.filters__checkbox--refer').dataset.filterRefer;
    const child_block = document.getElementById(child_id);
    let inputs_checked = child_block.querySelectorAll('input:checked');
    


    inputs_checked.forEach( input => {

        const checkbox = input.closest('.filters__checkbox');

        let value = checkbox.querySelector('label').querySelector('span').innerHTML;

        deleteFilter(input, value);

    })


    const checkbox = input.closest('.filters__checkbox');

    const inputs = child_block.querySelectorAll('input[type="checkbox"]');
    

    if(inputs.length === inputs_checked.length && !checkbox.querySelector('input[type="checkbox"]').checked) {

        checkbox.classList.remove('active');

    } else {

        checkbox.classList.add('active');

    }

    return;


}

function checkEmptyHint(hint) {

    if(hint.firstElementChild.innerHTML === '' && hint.children[1].innerHTML === '') {
       
        hint.querySelector('.filters__hintClose').dispatchEvent(new Event('click'));

    }

}

function showHideButtonsOfFiltes() {
    
    const filter = document.querySelector('.filters');
    const filter_wrapper = filter.querySelector('.filters__wrapper');
    const inputs = filter.querySelectorAll('input:checked');
    const filter_resets_buttons = filter.querySelectorAll('.filters__reset.active');

    filter_resets_buttons.forEach( button => button.classList.remove('active'));

    const priceBlock = filter.querySelector('#filter-price-block');

    if(inputs.length || priceBlock.querySelector('.filters__hintClose')){

        filterShowButton.classList.add('active');
        filter_wrapper.classList.add('padding-add')

        if(inputs.length) {
            inputs.forEach( input => {

                let block = input.closest('.filters__block');
    
                while(true) {
    
                    block.querySelector('.filters__reset').classList.add('active');
    
                    block = block.parentElement.closest('.filters__block');
    
                    if(!block) break;
                }
    
    
            })
        }

        if(priceBlock.querySelector('.filters__hintClose')) {

            priceBlock.querySelector('.filters__reset').classList.add('active');

        }

        filter.querySelector('.filters__reset').classList.add('active');

        return;

    }


    filter_wrapper.classList.remove('padding-add')
    filterShowButton.classList.remove('active');

}

function resetFilters(button) {

    let block = button.closest('.filters__block') || button.closest('.filters');

    block.querySelectorAll('input:checked').forEach( input => {

        input.checked = null;

        input.dispatchEvent(new Event('change'));

    });

    block.querySelectorAll('.filters__hintClose').forEach( closeButton => closeButton.dispatchEvent(new Event('click')));
    
    if(!block.parentElement.closest('.filters__block') && !block.classList.contains('filters')) {

        const id = block.id;

        block = block.closest('.filters');

        block = block.querySelector(`[data-filter-refer="${id}"]`);

        const close_button = block.querySelector('.filters__hintClose');

        if(close_button) close_button.dispatchEvent(new Event('click'))
 
    }

}

function moveFilters() {


    const filterMenu = document.querySelector('.filters');
    const desktopContainer = document.querySelector('.filters__choosenFilters');
    const hints = filterMenu.querySelectorAll('.filters__hint');

    if(document.documentElement.offsetWidth >= 1024 ) {

        hints.forEach( hint => {

            if(hint.dataset.filterItem === 'filter-price-block') return;

            desktopContainer.append(hint);

        })
        
        return;

    }

    hints.forEach( hint => {


        const block = document.querySelector(`[data-filter-refer="${hint.dataset.filterItem}"]`);
        
        if(hint.dataset.filterItem === 'filter-price-block') return;

        
        block.append(hint);

    });

}

resize( () => {moveFilters()} );

//-----------------------


