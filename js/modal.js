var $ = require('jquery');
let $modal = $('#modal');

module.exports = {
    toggle
};

function toggle() {
    $modal.fadeToggle();
}

$(document).ready(function() {
    $('#modal .close').click(function() {
        toggle();
    });
});