/* JS for album viewing in the double column format */


images = document.getElementsByClassName('images');
captions = document.getElementsByClassName('caption');
width = document.documentElement.clientWidth;
height = document.documentElement.clientHeight;

/* Sorting into the portrait or landscape classes depending on if the width of the image is larger than or smaller than its height */
for (var i=0; i<images.length; i++){
  if (images[i].width > images[i].height) images[i].classList.add('land');
  else{
    images[i].classList.add('port');
    resizeimg();
  }
}

/* Dynamic postioning and resizing when window size changes */
window.addEventListener('resize', resizeimg);

function resizeimg(){
  width = document.documentElement.clientWidth;
  height = window.innerHeight;

  /* When the window height is larger than window width, all images must be formatted in landscape mode (This is because of there being two columns, so images have half the width to be formatted into). Else re-sort all images by their height and width */
  if (height > width){
    for (var i=0; i<images.length; i++){
      images[i].classList = 'images land';
      images[i].style.margin = '5%';
    }
  }else{
    for (var i=0; i<images.length; i++){
      if (images[i].width < images[i].height) images[i].classList = 'images port';
    }
    
    /* This is to ensure that portrait images are centered (width wise) in the columns */
    width = document.documentElement.clientWidth/2;
    for (var i=0; i<images.length; i++){
      if (images[i].classList.contains('port')){
        images[i].style.marginLeft = String((width - images[i].width)/2 + 'px');
        images[i].style.marginRight = String((width - images[i].width)/2 + 'px');
      }
    }
  }

  /* This ensures that captions for images are centered (height wise) next to their respective images */
  for (var i=0; i<captions.length; i++){
    captions[i].style.marginTop =  String((images[i].height - captions[i].offsetHeight)/2 + 'px');
    captions[i].style.marginBottom =  String((images[i].height - captions[i].offsetHeight)/2 + 'px');
  }
}