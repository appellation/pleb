import './guilds';

const handler = StripeCheckout.configure({
    key: 'pk_test_rlCDbylenoAVfNfNuXylxRxG',
    image: './logo.svg',
    locale: 'auto',
    token: token => {
        console.log(token);
        const form = $('form.payment-form');
        console.log(form);
        form.append(`<input type='hidden' name='token' value='${token.id}'>`);
        form.submit();
    }
});

$(document).ready(() => {
    $('.donate-button').click(function(e) {
        const amount = $('input[name=\'amount\']').val();
        if(!amount) return e.preventDefault();

        modalClose.apply(this);
        handler.open({
            name: 'Will Nelson',
            amount: amount * 100,
            description: 'Donation'
        });

        e.preventDefault();
    });

    $('a.donate-modal').click(() => {
        $('div.donate-modal').addClass('is-active')
    });

    $('.modal-close').click(function() {
        modalClose.apply(this);
    });

    function modalClose() {
        $(this).parents('.modal').removeClass('is-active');
    }
});