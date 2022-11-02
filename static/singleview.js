/* JS for album viewing in the single column format */


images = document.getElementsByClassName('images');
width = document.documentElement.clientWidth;
height = window.innerHeight;

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
  /* When the window height is larger than window width by a certain amount, all images must be formatted in landscape mode (The factor of 1.2 was used to compensate for the portion of the window width used for margins). Else re-sort all images by their height and width */
  if (height/1.2 > width){
    for (var i=0; i<images.length; i++){
      images[i].classList = 'images land';
    }
  }else{
    for (var i=0; i<images.length; i++){
      if (images[i].width < images[i].height) images[i].classList = 'images port';
    }
  }
}