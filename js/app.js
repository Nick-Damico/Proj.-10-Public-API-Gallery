$(document).ready(function() {

  ////////////////////////////////////////
  //  Global Variables
  ////////////////////////////////////////

  //  Both AJAX API Requests are made at page load The HTML fomatted by callback functions are then stored in these variables and called on event 'click' of navigation tab.

  var photoHTML = '';
  var albumHTML = '';
  var Authorname = '';

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

  var flickrURL = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

  var flickrData = {
    tags  : 'sunset',
    format  : 'json'
  };

  function flickrCallback(data) {
    var photoLink = '';
    $.each(data.items, function(i, photo) {
      if(i <= 8) {
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
  };  // End of Function

  $.getJSON( flickrURL, flickrData, flickrCallback );


  //////////////////////////////////////////
  //  AJAX REQUEST FOR SPOTIFY PUBLIC API
  //////////////////////////////////////////
  var spotifyURL = "https://api.spotify.com/v1/search";
  var spotifyData = {
           q: 'Pink Floyd',
           type: 'album',
           limit: 9
         };
         function spotifyCallback(data) {
           console.log(data);
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
          //  $('#contentRow').html(albumHTML);
         };  // End of Function


  $.getJSON( spotifyURL, spotifyData, spotifyCallback );


  ////////////////////////////////////////
  //  EVENT HANDLERS
  ////////////////////////////////////////

  //  FLICKR-LINK NAV 'CLICK'
  $('.flickr-link').on('click', function(e) {
    //  Prevent page load
    e.preventDefault();
    //  Content replace with stored formatted HTML from API request.
    $('#contentRow').fadeOut('slow', function() {
      $(this).html(photoHTML).fadeIn('slow');
    });
    //  Hide Title, Update Title, then Show Title
    $('.main-title').fadeOut('slow',function(){
      $(this).html('Flickr API Photo Feed');
    }).fadeIn('slow');
    $('#main-content').fadeOut('slow',function(){
      $(this).removeClass('spotify-main').addClass('flickr-main').fadeIn('slow');
    });
  });

  //  SPOTIFY-LINK NAV 'CLICK'
  $('.spotify-link').on('click', function(e){
    //  Prevent page load
    e.preventDefault();
    //  Content replace with stored formatted HTML from API request.
    $('#contentRow').fadeOut('slow', function() {
      $(this).html(albumHTML).fadeIn('slow');
    });
    //  Hide Title, Update Title, then Show Title
    $('.main-title').fadeOut('slow', function() {
      $(this).html('Spotify API Album Feed');
    }).fadeIn('slow');
    $('#main-content').fadeOut('slow',function(){
      $(this).removeClass('flickr-main').addClass('spotify-main').fadeIn('slow');
    });
  });


}); //  END of ready
