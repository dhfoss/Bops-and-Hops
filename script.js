var alcohol;
var artist;
var drink;

$('#booze').on('submit', function(e) {
    e.preventDefault();
    alcohol = $(this).children('input').val().trim();

    for (i = 0; i < 4; i++) {
        $('#recipe' + i).children('ul').empty();
        $('#recipe' + i).children('h3').empty();
        $('#booze-picture').attr('src', '');
    }
    for (i = 0; i < 4; i++) {
        drinkDisplay(alcohol, i);
    }
    $('input').val('');
})


function drinkDisplay(alcohol, j) {
   
    // Cocktail (Favorite Alcolhol/Spirit)

    $.ajax ({
        url: 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + alcohol,
        method: 'GET'
    }).then(function(response) {

        var num = Math.floor(Math.random() * response.drinks.length);
        drink = response.drinks[num].strDrink;
        $('#recipe' + j).children('h3').text(drink);
        var imgSrc = response.drinks[num].strDrinkThumb;
            if (j === 0) {
                $('#booze-picture').attr('src', imgSrc);
                $('#recipe' + j).attr('value', imgSrc);
            } else {
                $('#recipe' + j).attr('value', imgSrc);
            }

        $.ajax ({
            url: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + drink + '&list.php?i=list',
            method: 'GET'
        }).then(function(response) {
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
    });
}

// Event Listener that swaps the info in the card with the main drink
$('.uk-card').on('click', function(e) {
    var cardImg = $(this).attr('value');
    var cardh3 = $(this).children('h3').text();
    var cardul = $(this).children('ul').html();

    $(this).attr('value', $('#booze-picture').attr('src')  )
    $(this).children('h3').text($('#recipe0').children('h3').text())
    $(this).children('ul').html($('#recipe0').children('ul').html())

    $('#booze-picture').attr('src', cardImg);
    $('#recipe0').children('h3').text(cardh3);
    $('#recipe0').children('ul').html(cardul);
})

//========
// Artist
//========

$('#artist').on('submit', function(e) {
    e.preventDefault();
    artist = $(this).children('input').val().trim();

    artistDisplay(artist);
    $('input').val('');
})


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
            $('#albumName').text(album);                        //id needs to be defined in HTML
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
        })
    });
}