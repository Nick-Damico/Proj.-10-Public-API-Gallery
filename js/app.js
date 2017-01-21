$(document).ready(function() {

    //  todo.
    //1. ** Style jqHXR.fail() msg block <span id="#failMsg">

    ////////////////////////////////////////
    //  Global Variables
    ////////////////////////////////////////

    //  Both AJAX API Requests are made at page load The HTML fomatted by callback functions are then stored in these variables and called on event 'click' of navigation tab.

    var photoHTML = '';
    var albumHTML = '';
    var Authorname = '';

    var $searchContainer = $('.search-container');

    //  AJAX status messages for, Done(successful), Fail(not successful), Always(success or failure);
    var doneMsg = 'Request successfully completed';
    var failMsg = 'Sorry, Request did not complete';
    var alwaysMsg = 'Request Status : ';


    ////////////////////////////////////////
    //  LightBox Options
    ////////////////////////////////////////
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true
    })

    ////////////////////////////////////////
    //  AJAX REQUEST FOR FLICKR PUBLIC API
    ////////////////////////////////////////

    //  URL for AJAX JSON Request
    var flickrURL = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

    //  DATA for AJAX Request
    var flickrData = {
        tags: 'sunset',
        format: 'json'
    };

    //  Callback for AJAX Request
    function flickrCallback(data) {
        var photoLink = '';
        photoHTML = '';
        $.each(data.items, function(i, photo) {
            if (i <= 8) {
                photoLink = photo.media.m;
                photoLink = photoLink.replace('_m', '');
                // photoLink = photoLink.text().replace('_m', '');
                photoHTML += '<div class="img-box sm-col-50 md-col-1-3">';
                //  Build anchor tag
                photoHTML += '<a href="' + photoLink + '"';
                photoHTML += ' data-lightbox="image-' + 1 + '"';
                photoHTML += ' data-title="' + photo.title + '"';
                photoHTML += ' title="' + photo.date_taken + '">';
                // photoHTML += ' data-title="Photo-' + i + '">';
                //  Build img tag
                photoHTML += '<img src="' + photo.media.m + '"';
                photoHTML += ' alt="' + photo.title + '">';
                //  Close a tag
                photoHTML += '</a>';
                //  Close div tag
                photoHTML += '</div>';
                Authorname = photo.author;
            }
        }); //  End of Loop
        $('#contentRow').html(photoHTML);
    }; // End of Function


    //  .getJSON 'GET' Request returns JSON format
    function requestFlickr(data) {
        $.getJSON(flickrURL, data, flickrCallback);
    }

    //  Call requestFlickr(data) on page load.
    requestFlickr(flickrData);



    //////////////////////////////////////////
    //  AJAX REQUEST FOR SPOTIFY PUBLIC API
    //////////////////////////////////////////

    //  URL for AJAX JSON Request
    var spotifyURL = "https://api.spotify.com/v1/search";

    //  DATA for AJAX Request
    var spotifyData = {
        q: 'Pink Floyd',
        type: 'album',
        limit: 9
    };

    //  Callback for AJAX Request
    function spotifyCallback(data) {
        albumHTML = '';
        $.each(data.albums.items, function(i, album) {
            albumHTML += '<div class="img-box sm-col-50 md-col-1-3">';
            //  Build anchor tag
            albumHTML += '<a href="' + album.images[0].url + '"';
            albumHTML += ' data-lightbox="image-' + 1 + '"';
            albumHTML += ' data-title="' + album.name + '">';
            //  Build img tag
            albumHTML += '<img src="' + album.images[1].url + '"';
            albumHTML += ' alt="' + album.name + '">';
            //  Close a tag
            albumHTML += '</a>';
            //  Close div tag
            albumHTML += '</div>';
        }); //  End of Loop
        $('#contentRow').html(albumHTML);
    }; // End of Function

    //  .getJSON 'GET' Request returns JSON format
    function requestSpotify(data) {
        $.getJSON(spotifyURL, data, spotifyCallback);
    }

    //  Call requestSpotify(data) on page load.
    requestSpotify(spotifyData);



    ////////////////////////////////////////
    //  EVENT HANDLERS  (Navigation)
    ////////////////////////////////////////

    ///////////////////////
    //  ADD INPUT / SEARCH
    ///////////////////////

    // WHEN FLICKR / SPOTIFY TAB IS CLICKED input and submit button id and placeholder text updated.
    function buildSearchFilterHTML(idName, placeHoldText) {
        var searchFilterHTML = '';
        //  input search
        searchFilterHTML += '<input type="search" id="searchApi"';
        searchFilterHTML += ' name="searchAPI" placeholder="' + placeHoldText + '" />';
        searchFilterHTML += ' <button type="submit" id="' + idName + '" name="submitBtn">Search</button>';
        $searchContainer.html(searchFilterHTML);
    }



    //  FLICKR-LINK NAV 'CLICK'
    $('.flickr-link').on('click', function(e) {
        //  Prevent page load
        e.preventDefault();
        //  Append flickr specific html input and button
        buildSearchFilterHTML('flickrSubmitBtn', 'Search')
        //  Content replace with stored formatted HTML from API request.
        $('#contentRow').fadeOut('slow', function() {
            $(this).html(photoHTML)
                .fadeIn('slow');
        });
        //  Hide Title, Update Title, then Show Title
        $('.main-title').fadeOut('slow', function() {
            $(this).html('Flickr API Photo Feed');
        }).fadeIn('slow');

        $('#main-content').fadeOut('slow', function() {
            $(this).removeClass('spotify-main')
                .addClass('flickr-main')
                .fadeIn('slow');
        });
    });



    //  SPOTIFY-LINK NAV 'CLICK'
    $('.spotify-link').on('click', function(e) {
        //  Prevent page load
        e.preventDefault();
        //  Append html
        buildSearchFilterHTML('spotifySubmitBtn', 'Album')

        //  Content replace with stored formatted HTML from API request.
        $('#contentRow').fadeOut('slow', function() {
            $(this).html(albumHTML).fadeIn('slow');
        });
        //  Hide Title, Update Title, then Show Title
        $('.main-title').fadeOut('slow', function() {
            $(this).html('Spotify API Album Feed');
        }).fadeIn('slow');

        $('#main-content').fadeOut('slow', function() {
            $(this).removeClass('flickr-main')
                .addClass('spotify-main')
                .fadeIn('slow');
        });
    });


    ///////////////////////////////////////////
    //  EVENT HANDLERS  (Search/ Filter/ Sort)
    ///////////////////////////////////////////

    $(document).on('click', '#flickrSubmitBtn', function(e) {
        // Prevent Default
        e.preventDefault();
        // input search element
        var $input = $(this).prev();
        //  Capture user search term
        if ($input.val() !== '') {
            searchData = $input.val();
            //  Build request data
            var requestData = {
                tags: searchData,
                format: 'json'
            };
            //  Request Flickr AJAX
            requestFlickr(requestData);
        }

    });


    $(document).on('click', '#spotifySubmitBtn', function(e) {
        // Prevent Default
        e.preventDefault();
        // input search element
        var $input = $(this).prev();
        //  Checks if search is 'empty'
        if ($input.val() !== '') {
            //  Capture user search term
            searchData = $input.val();
            //  Build request data
            var requestData = {
                format: 'json',
                q: searchData,
                type: 'album',
                limit: 9
            };
            //  Request Flickr AJAX
            requestSpotify(requestData);
        }
    });




}); //  END of ready
