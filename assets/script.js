var alcohol;
var artist;
var drink;

reloadBopsAndHops();

$('form').on('submit', function(e) {
    e.preventDefault();
    alcohol = $('#beverageInput').val().trim();
    $('#artist-picture').removeAttr('src');
    $('#booze-picture').removeAttr('src');
    $('#drinkInstructions').text('');
    for (i = 0; i < 4; i++) {
        $('#recipe' + i).children('ul').empty();
        $('#recipe' + i).children('h3').empty();
    }
    for (i = 0; i < 4; i++) {
        drinkDisplay(alcohol, i);
    }
    artist = $('#artistInput').val().trim();
    artistDisplay(artist);
    $('input').val('');

    saveBopsAndHops();
})

function drinkDisplay(alcohol, j) {
    var url;
    if (alcohol.toLowerCase() === 'non alcoholic' || alcohol.toLowerCase() === 'non-alcoholic' || alcohol.toLowerCase() === 'nonalcoholic') {
        url = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic';
    } else {
        url = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + alcohol;
    }
    $.ajax ({
        url: url,
        method: 'GET'
    }).then(function(response) {
        var num = Math.floor(Math.random() * response.drinks.length);
        drink = response.drinks[num].strDrink;
        $('#recipe' + j).children('h3:last').text(drink);
        var imgSrc = response.drinks[num].strDrinkThumb;
            if (j === 0) {
                $('#booze-picture').attr('src', imgSrc);
            } else {
                $('#recipe' + j).attr('value', imgSrc);
            }
        $.ajax ({
            url: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + drink + '&list.php?i=list',
            method: 'GET'
        }).then(function(response) {
            var instructions = response.drinks[0].strInstructions;
            if (j === 0) {
                $('#drinkInstructions').text(instructions);
            } else {
                $('#recipe' + j).attr('data', instructions);
            }
            var ingridentArray = Object.values(response.drinks[0]);
                for (i = 21; i < 36; i++) {
                    if (ingridentArray[i] && ingridentArray[i+15]) {
                        $('<li>').text(ingridentArray[i+15] + " " + ingridentArray[i]).appendTo($('#recipe' + j).children('ul'));
                    }
                    else if (ingridentArray[i]) {
                        $('<li>').text(ingridentArray[i]).appendTo($('#recipe' + j).children('ul'));
                    }
                }
        });
    }).catch(function(){
        drink = "This drink is not available";
        $('#drinkID').text(drink);
    });
}

// Event Listener that swaps the info in the card with the main drink
$('.uk-card').on('click', function(e) {
    var cardImg = $(this).attr('value');
    var cardh3 = $(this).children('h3').text();
    var cardul = $(this).children('ul').html();
    var cardInstructions = $(this).attr('data');

    $(this).attr('value', $('#booze-picture').attr('src'));
    $(this).children('h3').text($('#recipe0').children('h3:last').text());
    $(this).children('ul').html($('#recipe0').children('ul').html());
    $(this).attr('data', $('#drinkInstructions').text());

    $('#booze-picture').attr('src', cardImg);
    $('#recipe0').children('h3:last').text(cardh3);
    $('#recipe0').children('ul').html(cardul);
    $('#drinkInstructions').text(cardInstructions);
});


// ==========================================
// Artist


$('#artist').on('submit', function(e) {
    e.preventDefault();
    artist = $(this).children('input').val().trim();

    artistDisplay(artist);
    $('input').val('');
})

// Saving previous search to Local Storage
function saveBopsAndHops() {
    localStorage.setItem("currentAlcohol", JSON.stringify(alcohol));
    localStorage.setItem("currentArtist", JSON.stringify(artist));
}


// Audio DB function
function artistDisplay(artist) {
    $.ajax ({
        url: 'https://theaudiodb.com/api/v1/json/1/discography.php?s=' + artist,
        method: 'GET'
    }).then(function(response) {
        var album = response.album[Math.floor(Math.random() * response.album.length)].strAlbum;
        $.ajax ({
            url: 'https://theaudiodb.com/api/v1/json/1/searchalbum.php?s=' + artist + '&a=' + album,
            method: 'GET'
        }).then(function(response) {
            var imgSrc = response.album[0].strAlbumThumb;
            if (!imgSrc) {
                $.ajax ({
                    url: 'https://theaudiodb.com/api/v1/json/1/search.php?s=' + artist,
                    method: 'GET'
                }).then(function(response) {
                    var imgSrc = response.artists[0].strArtistThumb;
                    $('#artist-picture').attr('src', imgSrc);
                })
            }
            $('#artist-picture').attr('src', imgSrc);
            // An <h3> tag with id="albumName" needs to be added below the Album Art img on the HTML
            $('#albumName').text(album);
        })
    }).catch(function(){
        album = "This artist is not available";
        $('#albumName').text(album);
    });
}

// Should be implemented when one button click submits both artist and alcohol - reloads local storage and runs function
function reloadBopsAndHops() {
    var storedArtist = localStorage.getItem("currentArtist");
    var storedAlcohol = localStorage.getItem("currentAlcohol");
    if (storedArtist !==  null && storedAlcohol !== null){
        alcohol = JSON.parse(storedAlcohol);
        artist = JSON.parse(storedArtist);
        for (i = 0; i < 4; i++) {
            drinkDisplay(alcohol, i);
        };
        artistDisplay(artist);
    }
}