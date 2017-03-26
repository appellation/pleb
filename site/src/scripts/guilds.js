$(document).ready(() => {
    $('.guildLink').click(handleGuildChange);
});

function handleGuildChange() {
    toggleActive.apply(this);
    showData.apply(this);
}

function toggleActive() {
    $(this).parents('.menu').find('a.is-active').removeClass('is-active');
    $(this).children('a').addClass('is-active');
}

function showData() {
    const guildID = $(this).data('id');
    const guildData = $(`.guild-${guildID}`).html();
    $('.guildData').html(guildData);
}