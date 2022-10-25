/*export function isWebp() {
    function testWebp(callback) {
        let webP = new Image();
        webP.onload = webP.onerror = function () {
            callback(webP.height == 2);
        };
        // webp.src = 
    }

    testWebp(function (support) {
        let className = support === true ? 'webp' : 'no-webp';
        document.documentElement.classList.add(className);
    });
}*/

export function support_format_webp()
{
 let elem = document.createElement('canvas');

 if (!!(elem.getContext && elem.getContext('2d'))) {
  document.documentElement.classList.add('webp');
 } else {
  document.documentElement.classList.add('no-webp');
 }
}

export function resize(callback) {
    callback();
    window.addEventListener('resize', callback);
}

export function patternInput() {

    Array.prototype.forEach.call(document.body.querySelectorAll("*[data-mask]"), applyDataMask);

    function applyDataMask(field) {
        var mask = field.dataset.mask.split('');
        
        // For now, this just strips everything that's not a number
        function stripMask(maskedData) {
            function isDigit(char) {
                return /\d/.test(char);
            }
            return maskedData.split('').filter(isDigit);
        }
        
        // Replace `_` characters with characters from `data`
        function applyMask(data) {
            return mask.map(function(char) {
                if (char != '_') return char;
                if (data.length == 0) return char;
                return data.shift();
            }).join('')
        }
        
        function reapplyMask(data) {
            return applyMask(stripMask(data));
        }
        
        function changed() {   
            var oldStart = field.selectionStart;
            var oldEnd = field.selectionEnd;
            
            field.value = reapplyMask(field.value);
            
            field.selectionStart = oldStart;
            field.selectionEnd = oldEnd;
        }
        
        field.addEventListener('click', changed)
        field.addEventListener('keyup', changed)
    }

}

export function createElement(selector, { classes = [], text = '', callback = false } = {}) {

    const element = document.createElement(selector);
    element.classList.add(...classes);
    element.innerHTML = text;

    callback && callback(element);

    return element;
}

export function determineBrowser() {
      
      
    const userAgent = navigator.userAgent;

    let match = userAgent.match(/(opera|chrome|brave|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    let temp;


    if (/trident/i.test(match[1])) {
        temp = /\brv[ :]+(\d+)/g.exec(userAgent) || []

        return 'IE';
    }

    if (match[1] === 'Chrome') {
        temp = userAgent.match(/\b(OPR|Edge)\/(\d+)/)

        if (temp !== null) {
            return 'Opera'
        }

        temp = userAgent.match(/\b(Edg)\/(\d+)/)

        if (temp !== null) {
            return 'Edge';
        }
    }

    if(navigator.brave) return 'Brave'

    match = match[1] ? match[1] : navigator.appName;
    

    return match[0].toUpperCase() + match.slice(1);

}