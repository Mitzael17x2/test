export function validationCheck(form, excepts = []) {

    let patternEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let lengthPhone = 17;
    let elements = form.querySelectorAll('textarea, input');
    let validation = true;

    elements.forEach( element => {

        let type = element.getAttribute('type');

        switch (type) {

            case 'tel':

                if(element.value.length < lengthPhone) {
                    makeMistake(element);
                    validation = false;
                }

            break;

            case 'radio':

                let name = element.getAttribute('name');

                if(
                    ![...form.querySelectorAll(`input[name="${name}"]`)]
                    .find( radio => radio.checked)
                ) {
                    makeMistake(element.closest('.radio-container'));
                    validation = false;
                }

            break;

            case 'checkbox':

            break;

            default:

                if(element.classList.contains('email')) {

                    if(!element.value.match(patternEmail)) {
                        makeMistake(element);
                        validation = false;
                    }

                } else {
                        if(element.value.length < element.getAttribute('minlength') || element.value.length > element.getAttribute('maxlength')) {
                        makeMistake(element);
                        validation = false;
                    }
                }

            break;

        }

    })

    function makeMistake(element) {
        
        element.style.border = '1px solid red';
    
        element.addEventListener('focus', () => element.style.border = '', {once:true});
        element.addEventListener('click', () => element.style.border = '', {once:true});
    
    }

    return validation;
}

export function makeSearchFields(forms, {

    selector = 'input',
    limit = 10,
    extractCallback,
    buildCallback,
    chooseCallback,
    fillContentCallback = false,

}) {

    forms.forEach( form => {

        const fields = form.querySelectorAll(selector);

        fields.forEach( field => {

            const hint_block = field.parentElement.querySelector('.hints');
            let hints = hint_block.children;
            let active_index = 0;
            let query = '';
            
            buildHintBlocks({
                hint_block: hint_block, 
                hints: hints, 
                limit: limit
            });

            field.addEventListener('blur', (event) => {

                hint_block.parentElement.style.display = 'none';

                buildHintBlocks({
                        hint_block: hint_block, 
                        hints: hints, 
                        limit: 0
                });

            });

            hint_block.addEventListener('pointerdown', (event) => {

                const target = event.target.closest('.hint');

                if(!target) return false;

                chooseCallback({target: target});

            });

            field.addEventListener('keydown', function(event) {  

                if(event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Escape' || event.key === 'Enter') {

                    event.preventDefault();

                    active_index = chooseHint({
                        event: event,
                        hint_block: hint_block,
                        hints: hints,
                        field: field,
                        activeIndex: active_index,
                        query: query,
                    });
        
                    return false;

                }
        
                field.addEventListener('keyup', async () => {

                    query = this.value;  
        
                    if(query.length) {
            
                        const result = await extractCallback({query: query, input: field});
                            
                        let activeItem = hint_block.querySelector('.hint-active')
        
                        if(activeItem) activeItem.classList.remove('hint-active');
        
                        hint_block.scrollTop = 0;

                        if(hint_block && result?.suggestions?.length) {
        
                            hint_block.parentElement.style.display = 'block';
        
                            if(!result.suggestions) field.dispatchEvent(new Event('blur'));
        
                            if(hints.length !== result.suggestions.length) {
        
                                buildHintBlocks({
                                    hint_block: hint_block,
                                    hints: hints,
                                    limit: result.suggestions.length,
                                });
        
                            }
        
                            result.suggestions.forEach( (suggest, index) => {
        
                                if(fillContentCallback) {

                                    const fillContentData = {
                                        hint: hints[index],
                                        data: suggest
                                    }
    
                                    fillContentCallback(fillContentData);

                                    return;

                                }

                                hints[index].innerHTML = suggest.value;


        
                            });
            
                        } else {

                            field.dispatchEvent(new Event('blur'));

                        }
            

                    } else {

                        field.dispatchEvent(new Event('blur'));

                    }
                }, {once: true})
                
            });

        })

    });

    function chooseHint({event, hint_block, hints, field, activeIndex, query}) {
                
        if(hint_block.children.length) {

            let activeItem = hint_block.querySelector('.hint-active');

            chooseCallback({keyBoard: event.key, target: hints[activeIndex]});

            if(event.key) {

                switch (event.key) {

                    case 'ArrowUp':
    
                        activeItem = activeItem ? activeItem : hints[0];
    
                        activeIndex = [...hints].indexOf(activeItem) <= 0 ? null : --activeIndex;
    
                    break;
    
                    case 'ArrowDown':
                        
                        activeItem = activeItem ? activeItem : hints[hints.length - 1];
    
                        activeIndex = [...hints].indexOf(activeItem) === hints.length - 1 ? 0 : ++activeIndex;
    
                    break;
    
                    default: 
    
                    field.dispatchEvent(new Event('blur'));
                    
                    return false;
    
                    break;
    
                }

            } else {

                let target = event.target.closest('.hint');

                if(!target) return false;

                if(target.classList.contains('hint-active')) return false;

                activeIndex = [...hints].indexOf(target);

            }
            

            if(activeItem) activeItem.classList.remove('hint-active');

            if(activeIndex === null) {

                field.value = query;

                return false;

            };

            hints[activeIndex].classList.add('hint-active');

            field.value = hints[activeIndex].innerHTML;

            //===================================

            if(event.key) {

                if(hints[activeIndex].offsetTop > hint_block.offsetHeight - 30) hint_block.scrollTop = hints[activeIndex].offsetTop - hint_block.offsetHeight + hints[activeIndex].offsetHeight + 30;
                else if (hints[activeIndex].offsetTop <= hint_block.offsetHeight) hint_block.scrollTop = 0;
                

            }

            return activeIndex;

        }
    }

    function buildHintBlocks({ hint_block, hints, limit }) {

        if(hints.length) [...hints].forEach( hint => hint.remove());
        
        if(hint_block) {

            for(let i = 0; i < limit; i++) {
        
                const hint = buildCallback();

                hint.classList.add('hint');

                hint_block.append(hint);
                
            }
    
        }

    }

}


// export function phoneInput(forms) {

//     forms.forEach( form => {
//         [].forEach.call( form.querySelectorAll('.tel'), function(input) {
//             var keyCode;
//             function mask(event) {
//                 event.keyCode && (keyCode = event.keyCode);
//                 var pos = this.selectionStart;
//                 if (pos < 3) event.preventDefault();
//                 var matrix = "+7 (___)___-__-__",
//                     i = 0,
//                     def = matrix.replace(/\D/g, ""),
//                     val = this.value.replace(/\D/g, ""),
//                     new_value = matrix.replace(/[_\d]/g, function(a) {
//                         return i < val.length ? val.charAt(i++) || def.charAt(i) : a
//                     });
//                 i = new_value.indexOf("_");
//                 if (i != -1) {
//                     i < 5 && (i = 3);
//                     new_value = new_value.slice(0, i)
//                 }
//                 var reg = matrix.substr(0, this.value.length).replace(/_+/g,
//                     function(a) {
//                         return "\\d{1," + a.length + "}"
//                     }).replace(/[+()]/g, "\\$&");
//                 reg = new RegExp("^" + reg + "$");
//                 if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
//                 if (event.type == "blur" && this.value.length < 5)  this.value = ""
//             }

//             input.addEventListener("input", mask, false);
//             input.addEventListener("focus", mask, false);
//             input.addEventListener("blur", mask, false);
//             input.addEventListener("keydown", mask, false);

//             input.dispatchEvent(new Event('input'));
        
//           });
//     })

// };



export function maskPhone(selector, masked = '+7 (___) ___-__-__') {
	const elems = document.querySelectorAll(selector);

	function mask(event) {
		const keyCode = event.keyCode;
		const template = masked,
			def = template.replace(/\D/g, ""),
			val = this.value.replace(/\D/g, "");
		let i = 0,
			newValue = template.replace(/[_\d]/g, function (a) {
				return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
			});
		i = newValue.indexOf("_");
		if (i !== -1) {
			newValue = newValue.slice(0, i);
		}
		let reg = template.substr(0, this.value.length).replace(/_+/g,
			function (a) {
				return "\\d{1," + a.length + "}";
			}).replace(/[+()]/g, "\\$&");
		reg = new RegExp("^" + reg + "$");
		if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
			this.value = newValue;
		}
		if (event.type === "blur" && this.value.length < 5) {
			this.value = "";
		}

	}

	for (const elem of elems) {
		elem.addEventListener("input", mask);
		elem.addEventListener("focus", mask);
		elem.addEventListener("blur", mask);
	}
	
}