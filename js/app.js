$(document).ready(function() {

    ////////////////////////////////////////
    //  Global Variables
    ////////////////////////////////////////

    //  Both AJAX API Requests are made at page load The HTML fomatted by callback functions are then stored in these variables and called on event "click" of navigation tab.

    var photoHTML = "";
    var albumHTML = "";
    var Authorname = "";

    var $searchContainer = $('.search-container');
    var $contentDiv = $('#contentRow');
    var $mainTitle = $('.main-title');
    var $mainContent = $('#main-content');
    var $mainWrapper = $('#mainContentWrapper');
    ////////////////////////////////////////
    //  AJAX REQUEST FOR FLICKR PUBLIC API
    ////////////////////////////////////////

    // $contentDiv.hide();

    //  URL for AJAX JSON Request
    var flickrURL = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

    //  DATA for AJAX Request
    var flickrData = {
        tags: 'sunset',
        format: 'json'
    };

    //  Callback for AJAX Request
    function flickrCallback(data) {
        //  Anchor href full size photo for lightbox
        var photoLink = "";
        //  HTML to build gallery of API results
        photoHTML = "";
        $.each(data.items, function(i, photo) {
            if (i <= 8) {
                photoLink = photo.media.m;
                photoLink = photoLink.replace('_m', "");
                // photoLink = photoLink.text().replace('_m', "");
                photoHTML += '<div class="img-box sm-col-50 md-col-1-3">';
                //  Build anchor tag
                photoHTML += '<a href="' + photoLink + '"';
                photoHTML += ' data-lightbox="image-' + 1 + '"';
                photoHTML += ' data-title="' + photo.title + '"';
                photoHTML += ' data-date="' + photo.date_taken + '"';
                photoHTML += ' data-author="' + photo.author + '">';
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
        $contentDiv.html(photoHTML).fadeIn();
    } // End of Function


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
        albumHTML = "";
        $.each(data.albums.items, function(i, album) {
            albumHTML += '<div class="img-box sm-col-50 md-col-1-3">';
            //  Build anchor tag
            albumHTML += '<a href="' + album.images[0].url + '"';
            albumHTML += ' data-lightbox="image-' + 1 + '"';
            albumHTML += ' data-title="' + album.name + '"';
            albumHTML += ' data-artist="' + album.artists[0].name + '">';
            //  Build img tag
            albumHTML += '<img src="' + album.images[1].url + '"';
            albumHTML += ' alt="' + album.name + '">';
            //  Close a tag
            albumHTML += '</a>';
            //  Close div tag
            albumHTML += '</div>';
        }); //  End of Loop
        $contentDiv.html(albumHTML);
    } // End of Function

    //  .getJSON 'GET' Request returns JSON format
    function requestSpotify(data) {
        $.getJSON(spotifyURL, data, spotifyCallback);
    }



    ////////////////////////////////////////
    //  Navigation Tabs
    ////////////////////////////////////////

    // WHEN FLICKR / SPOTIFY TAB IS CLICKED input and submit button id and placeholder text updated for correct API.
    function buildSearchFilterHTML(idName, placeHoldText, firstBtnId, firstBtnText, secondBtnId, secondBtnText) {
        var searchFilterHTML = "";
        //  input search HTML
        searchFilterHTML += '<input type="search" id="searchApi"';
        searchFilterHTML += ' name="searchAPI" placeholder="' + placeHoldText + '" />';
        searchFilterHTML += ' <button type="submit" id="' + idName + '" name="submitBtn">Search</button>';
        //  Append search HTML to #searchContainer div
        $searchContainer.html(searchFilterHTML);
        // //  Update Sort buttons for correct API
        $('.btn-sort-1').attr('id', firstBtnId).fadeOut(function() {
            $(this).text(firstBtnText).fadeIn();
        });

        $('.btn-sort-2').attr('id', secondBtnId).fadeOut(function() {
            $(this).text(secondBtnText).fadeIn();
        });

    }


    //  FLICKR-LINK NAV "click"
    $('.flickr-link').on("click", function(e) {
        //  Prevent page load
        e.preventDefault();
        //  Append flickr specific html input and button
        buildSearchFilterHTML('flickrSearchBtn', 'Search', 'sortDate', 'Sort Date', 'sortTitle', 'Sort Title');
        //  Content replace with stored formatted HTML from API request.
        $contentDiv.fadeOut('slow', function() {
            $(this).html(photoHTML)
                .fadeIn('slow');
        });
        //  Hide Title, Update Title, then Show Title
        $('.main-title span').fadeOut('slow', function() {
            $(this).removeClass('spotify').addClass('flickr').html('Flickr');
        }).fadeIn('slow');

        $mainWrapper.fadeOut('slow', function() {
            $(this).removeClass('spotify-inner')
                .addClass('flickr-inner')
                .fadeIn('slow');
            $('#main-content').addClass('flickr-main').removeClass('spotify-main');
        });
    });


    //  SPOTIFY-LINK NAV "click"
    $('.spotify-link').on("click", function(e) {
        //  Call requestSpotify(data)
        requestSpotify(spotifyData);
        //  Prevent page load
        e.preventDefault();
        //  Append html
        buildSearchFilterHTML('spotifySearchBtn', 'Album/ Artist', 'sortAlbum', 'Sort Album', 'sortArtist', 'Sort Artist');

        //  Content replace with stored formatted HTML from API request.
        $contentDiv.fadeOut('slow', function() {
            $(this).html(albumHTML).fadeIn('slow');
        });
        //  Hide Title, Update Title, then Show Title
        $('.main-title span').fadeOut('slow', function() {
            $(this).removeClass('flickr').addClass('spotify').html('Spotify');
        }).fadeIn('slow');

        $mainWrapper.fadeOut('slow', function() {
            $(this).removeClass('flickr-inner')
                .addClass('spotify-inner')
                .fadeIn('slow');
            $('#main-content').addClass('spotify-main').removeClass('flickr-main');
        });
    });


    ////////////////////////////////////////
    //  Search input
    ////////////////////////////////////////

    //  flickr search input btn
    $(document).on("click", '#flickrSearchBtn', function(e) {
        var searchData;
        // Prevent Default
        e.preventDefault();
        // input search element
        var $input = $(this).prev();
        //  Capture user search term
        if ($input.val() !== "") {
            searchData = $input.val();
            //  Build request data
            var requestData = {
                tags: searchData,
                format: 'json'
            };
            //  Request Flickr AJAX
            requestFlickr(requestData);
        }
        $input.val("");

    });

    //  spotify search input btn
    $(document).on("click", '#spotifySearchBtn', function(e) {
        var searchData;
        // Prevent Default
        e.preventDefault();
        // input search element
        var $input = $(this).prev();
        //  Checks if search is 'empty'
        if ($input.val() !== "") {
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
        $input.val("");
    });



    ///////////////////////////////////////////
    //  EVENT HANDLERS  ( Sort Buttons )
    ///////////////////////////////////////////

    //  function for sorting gallery items.

    function sorting(dataType) {
        var contentA;
        var contentB;
        //  Anchor element References stored
        var $anchors = $('#contentRow div').find('a');
        //  Anchor elements Sorted by attribute 'data-name' from low to high.
        var arr = $anchors.sort(function(a, b) {
            if (typeof a === 'number' && typeof b === 'number') {
                contentA = parseInt($(a).attr(dataType));
                contentB = parseInt($(b).attr(dataType));
            } else {
                contentA = $(a).attr(dataType);
                contentB = $(b).attr(dataType);
            }
            //  Returns numerically sorted array of anachors
            return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
        });
        //  Iterates through divs nested in #contentRow container appending each of the sorted anchors in order.
        $('#contentRow div').hide().each(function(index) {
            $(this).append(arr[index]);
        }).fadeIn('slow');
    }



    ////////////////////////////////////////
    //  Sort and Compare click events
    ////////////////////////////////////////

    $(document).on("click", '#sortDate', function() {
        //  call to sorting, function argument sorts items by attribute data-date
        sorting('data-date');
    });

    $(document).on("click", '#sortTitle', function() {
        //  call to sorting, function argument sorts items by attribute data-title
        sorting('data-title');
    });

    $(document).on("click", '#sortAlbum', function() {
        //  call to sorting, function argument sorts items by attribute data-title (album title)
        sorting('data-title');
    });

    $(document).on("click", '#sortArtist', function() {
        //  call to sorting, function argument sorts items by attribute data-artist
        sorting('data-artist');
    });



}); //  END of ready
