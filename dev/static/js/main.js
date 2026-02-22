import IMask from 'imask';

const maskOptions = {
  mask: '+{7}(000)000-00-00'
};

const phoneInput = document.querySelector('#phone');
if (phoneInput) {
  IMask(phoneInput, maskOptions);
}