$(document).ready(function() {


  ////////////////////////////////////////
  //  AJAX REQUEST FOR FLICKR PUBLIC API
  ////////////////////////////////////////
  var flickrURL = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

  var flickrData = {
    tags  : 'mountains',
    format  : 'json'
  };

  function flickrCallback(data) {
    var photoHTML = '';
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
        photoHTML += ' data-title="Photo-' + i + '">';
        //  Build img tag
        photoHTML += '<img src="' + photo.media.m + '"';
        photoHTML += ' alt="' + photo.title + '">';
        //  Close a tag
        photoHTML += '</a>';
        //  Close div tag
        photoHTML += '</div>';
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
           q: 'Kanye',
           type: 'album'
         };
         function spotifyCallback(data) {
           console.log(data.albums.items);
           var albumHTML = '';

           $.each(data.albums.items, function(i, album) {
             console.log('loop');
               albumHTML += '<div class="img-box sm-col-50 md-col-1-3">';
               //  Build anchor tag
               albumHTML += '<a href="' + album.images[0].url + '"';
               albumHTML += ' data-lightbox="image-' + 1 + '"';
               albumHTML += ' data-title="Photo-' + i + '">';
               //  Build img tag
               albumHTML += '<img src="' + album.images[1].url + '"';
               albumHTML += ' alt="' + album.name + '">';
               //  Close a tag
               albumHTML += '</a>';
               //  Close div tag
               albumHTML += '</div>';
               console.log(albumHTML + 'hi');
           }); //  End of Loop
           $('#contentRow').html(albumHTML);
         };  // End of Function


  $.getJSON( spotifyURL, spotifyData, spotifyCallback );

}); //  END of ready
