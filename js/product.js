import { resize } from "./modules/functions.js";
import Swiper from 'swiper/bundle';
import { MiDropList_DE } from "./modules/MiDropList-DE.js";

//slider

const slider = document.querySelector('.good__slider');

if(slider) {

    //slider logic

    let swiper;

    resize( function() {


        if(document.documentElement.offsetWidth >= 1024 && swiper) {

            swiper.destroy(true, true);

            swiper = null;

            return;

        }

        if(document.documentElement.offsetWidth < 1024 && !swiper) {

            swiper = createSwiper();

            return;

        }

    })

    //hover effects

    const slides = slider.querySelectorAll('.good__slide');
    const mainImgContainer = document.querySelector('.good__img');
    
    if(slides.length) {

        let timerTransition;
        let timerScale;

        slides.forEach( slide => {
            
            slide.addEventListener('pointerenter', () => {

                const activeImg = slider.querySelector('.good__slide.active');

                if(activeImg && slide.classList.contains('active')) return false;

                if(activeImg) activeImg.classList.remove('active');

                clearTimeout(timerTransition);
                clearTimeout(timerScale);

                slide.classList.add('active');

                const src = slide.querySelector('img').src;
                const img = mainImgContainer.querySelector('img');

                img.src = src;

                mainImgContainer.style.transition = null;

                mainImgContainer.style.transform = 'scale(0)';

                timerTransition = setTimeout( () => {

                    mainImgContainer.style.transition = '.7s transform';

                }, 20);



                timerScale = setTimeout( () => {

                    mainImgContainer.style.transform = 'scale(1)';

                }, 50)
                

            })

        });

    }

    if(mainImgContainer) {

        mainImgContainer.addEventListener('pointerenter', () => {

            const img = mainImgContainer.querySelector('img');
            const [ width, height ] = [img.offsetWidth, img.offsetHeight];

            const [perX, perY] = [mainImgContainer.offsetWidth / 100, mainImgContainer.offsetHeight / 100];

            img.style.width = width * 2 + 'px';
            img.style.height = height * 2 + 'px';

            img.style.maxWidth = 'none';
            img.style.maxHeight = 'none';

            mainImgContainer.addEventListener('pointermove', moveImg);


            mainImgContainer.addEventListener('pointerleave', () => {

                mainImgContainer.removeEventListener('pointermove', moveImg);

                img.style.width = null;
                img.style.height = null;
    
                img.style.maxWidth = null;
                img.style.maxHeight = null;

                img.style.left = null;
                img.style.top = null;


            }, {once: true});

            function moveImg(event) {

                const [pointerX, pointerY] = [ event.clientX, event.clientY];
                const { left, top } = mainImgContainer.getBoundingClientRect();
                const [x, y] = [pointerX - left, pointerY - top];
    
                img.style.left = (x / perX) * -1 + '%';
                img.style.top = (y / perY) * -1 + '%';
                
            }

        });

    }

    //----------

    function createSwiper() {

        let swiper = new Swiper('.good__slider', {

            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
    
        });

        return swiper;

    }

}

//spoilers

const spoiler = document.querySelector('.goodSpoiler');

if(spoiler) {

    new MiDropList_DE('.goodSpoiler', '.goodSpoiler__content', false, {
        event: 'click',
        animation: 'growing',
        duration: '400',
        delay: '0',
        protected: '0',
        closeOtherLists: false,
    })

}


//recently watched product slider

const recentlyWatchedSlider = document.querySelector('.watches__slider');

if(recentlyWatchedSlider) {

    let swiper;

    resize( function() {


        if(document.documentElement.offsetWidth >= 1024 && swiper) {

            swiper.destroy(true, true);

            swiper = null;

            return;

        }

        if(document.documentElement.offsetWidth < 1024 && !swiper) {

            swiper = createSwiper();

            return;

        }

    })

    function createSwiper() {

        let swiper = new Swiper('.watches__slider', {

            simulateTouch: true,
            spaceBetween: 20,
            slidesPerView: 2,
            slidesPerGroup: 2,
        
            breakpoints: {
                600: {
                    slidesPerGroup: 3,
                    slidesPerView: 3,
        
                },
                1024: {
                    spaceBetween: 20,
                }
            }
        
        });

        return swiper;
        

    }



}



//relocate watches section

const watchBlock = document.querySelector('.watches');
const watchSection = document.querySelector('#watches');
const goodSlider = document.querySelector('.good__slider');

if(watchBlock) {

    resize(function() {

        if(document.documentElement.offsetWidth < 1024) {

            watchSection.querySelector('.container').append(watchBlock);

            return;
        }

        goodSlider.append(watchBlock);
        

    });

}


//bell

const goodKnow = document.querySelector('.good__know');

if(goodKnow) {

    goodKnow.addEventListener('click', () => {

        goodKnow.classList.toggle('active');

    })

}
