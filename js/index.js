import Swiper from 'swiper/bundle';

function changeInfo(event) {

    const trigger = event.target.closest('.interactiveGallery__trigger');

    if(!trigger || trigger.classList.contains('active')) return false;

    
    const data = interactiveGallery_data[trigger.dataset.trigger];
    
    const slide = trigger.closest('.interactiveGallery__slide');
    const info = slide.querySelector('.interactiveGallery__info');

    const activeTrigger = slide.querySelector('.interactiveGallery__trigger.active');

    const img = info.querySelector('.interactiveGallery__itemImg').firstElementChild;
    const title = info.querySelector('.interactiveGallery__itemTitle');
    const name = info.querySelector('.interactiveGallery__itemName');
    const price = info.querySelector('.interactiveGallery__price');


    if(activeTrigger) activeTrigger.classList.remove('active');

    trigger.classList.add('active');
    
    img.src = data.img;
    title.innerHTML = data.title;
    name.innerHTML = data.name;
    price.innerHTML = data.price;
    info.firstElementChild.onclick = () => {document.location=data.refer};

}

//Галерея с выбором

const interactiveGallery = document.querySelector('.interactiveGallery');

if(interactiveGallery) {


    new Swiper('.interactiveGallery', {

        navigation: {

			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',

		},

        simulateTouch: true,

		fadeEffect: {
			crossFade: true,
		},
        effect: "fade"

    });


    const slider_images = interactiveGallery.querySelectorAll('.interactiveGallery__img');

    if(slider_images) {

        slider_images.forEach( img => {

            img.addEventListener('click', changeInfo);

        })

    }

}

//Карусель новинок

const productCarousel = document.querySelector('.productCarousel');

if(productCarousel) {

    new Swiper('.productCarousel__carousel', {

        simulateTouch: true,
        spaceBetween: 30,
        slidesPerView: 'auto',

        breakpoints: {
            991: {
                spaceBetween: 60,

            },
            1250: {
                spaceBetween: 60,
                navigation: {

                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
        
                },
            }
        }

    });

}


