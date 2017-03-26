import './guilds';

const handler = StripeCheckout.configure({
    key: 'pk_test_rlCDbylenoAVfNfNuXylxRxG',
    image: './logo.svg',
    locale: 'auto',
    token: token => {
        const form = $('form.payment-form');
        form.append(`<input type='hidden' name='token' value='${token.id}'>`);
        form.submit();
    }
});

$(document).ready(() => {
    $('.donate-button').click(function(e) {
        e.preventDefault();

        const amount = $('input[name=\'amount\']').val();
        if(!amount) return;

        modalClose.apply(this);

        handler.open({
            name: 'Will Nelson',
            amount: amount * 100,
            description: 'Donation'
        });
    });

    $('a.donate-modal').click(() => {
        $('div.donate-modal').addClass('is-active')
    });

    $('.modal-close').click(modalClose);
    $('.modal-background').click(modalClose);

    function modalClose() {
        $(this).parents('.modal').removeClass('is-active');
    }
});