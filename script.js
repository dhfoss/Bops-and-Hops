var alcohol;
var artist;



$('#booze').on('submit', function(e) {
    e.preventDefault();
    alcohol = $(this).children('input').val().trim();
    console.log(alcohol);
    drinkDisplay(alcohol);
    $('input').val('');
})






function drinkDisplay(alcohol) {
   
    // Cocktail (Favorite Alcolhol/Spirit)
    $.ajax ({
        url: 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + alcohol,
        method: 'GET'
    }).then(function(response) {
        var num = Math.floor(Math.random() * response.drinks.length);
        var drink = response.drinks[num].strDrink;
        console.log(drink);

        var imgSrc = response.drinks[num].strDrinkThumb;
        $('#booze-picture').attr('src', imgSrc);

    });

    // This is for looking up the specific drink above
    $.ajax ({
        url: 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + drink,
        method: 'GET'
    }).then(function(response) {
        for (i=0; i<4; i++) {
            $('#drinkName'+i).text(drink);                    //The id needs to be defined 
            for (i=1; i<16; i++){
                var ingredient = response.drinks[0].strIngredient + i;
                
                console.log(ingredient);
                if(ingredient) {
                    $("<li>").text(ingredient).appendTo("ul");       //Ingredient ul column

                }
            
            }   


            for (i=1; i<16; i++){
                var measure = response.drinks[0].strMeasure + i;
                
                console.log(measure);
                if(measure) {
                    $("<li>").text(measure).appendTo("ul");       //Measure ul column

                }
            
            }   
        }
        
    }
    )
}



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