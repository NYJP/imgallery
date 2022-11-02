/* CSS for album editing page */


var upload = document.getElementById('upload'); /* Upload button for images */
var uploadstatus = document.getElementById('uploadstatus'); /* Status on number of images uploaded */
var uploadedfiles = document.getElementById('files'); /* Images in the file input element */
var display = document.getElementById('display'); /* display section for images */
var submitbtn = document.getElementById('submit');
var imagesdata = [];
var statusmsg = '';
var no_images = document.getElementById('no_images');
var albumtitle = document.getElementById('title');
var submitstatus = document.getElementById('submitstatus'); /* Status for if the file can be submitted */
var inputs = document.getElementsByClassName('textstyles'); /* All style related input elements */

/* Preload the existing images (if any) in the album */
for (var i=0; i<display.childElementCount; i++){
  /* Upload the URL of the image into the array for image data */
  imagesdata.push(document.getElementById('image' + String(i)).value);
  /* Update the number of uploads shown in the upload status element */
  uploadstatus.innerHTML = String(imagesdata.filter(filt).length) + ' images uploaded!';
  updatesubmitstatus();
}

/* What to do when new images are uploaded */
upload.onclick = function(){
  statusmsg = ' images uploaded!';
  var files = uploadedfiles.files;
  for (var i=0; i<files.length; i++){
    toDataURL(URL.createObjectURL(files[i]), function(imagedata){
      /* Check for duplicates */
      if (!imagesdata.includes(imagedata)){
        imagesdata.push(imagedata);
      }else{
        statusmsg = ' images uploaded! (duplicates are excluded)'; 
        /* Duplicates detected, updates the upload status element */
      }
    });
  }
  updatesubmitstatus();
  uploadstatus.innerHTML = 'Loading...';
  /* Set time interval to allow program to process, and to avoid some images being not fully uploaded */
  setTimeout(displayimg,Math.max(files.length*15,100)); 
}

/* Loads all the image icon elements */
function displayimg(){
  for (var i=0; i<imagesdata.length; i++){
    if (document.getElementById(String(i)) == null && !imagesdata[i] == ''){
      /* Check that the image url has not been deleted */

      /* Main element */
      var img = document.createElement('div');
      img.style.backgroundImage = 'url(' + imagesdata[i] + ')';
      /* Display the image as the element background */
      img.classList = 'displayimg';
      img.id = i;

      /* Attached delete button */
      var del = document.createElement('button');
      del.classList = 'displaydel';
      del.innerHTML = 'x';
      img.appendChild(del);
      del.setAttribute('onclick', "delimg(this)");
      
      /* Attached hidden text input field, so that the form data includes image urls */
      var imgdata = document.createElement('input');
      imgdata.type = 'text';
      imgdata.style.display = 'none';
      imgdata.name = 'image' + i;
      imgdata.value = imagesdata[i];
      img.appendChild(imgdata);

      /* Attached caption div */
      var cap = document.createElement('input');
      cap.type = 'text';
      cap.classList = 'captions';
      cap.placeholder = 'Caption for above image (optional)';
      cap.name = 'caption' + i;
      img.appendChild(cap);

      display.appendChild(img);
    }
  }
  
  /* Update upload status element */
  uploadstatus.innerHTML = String(imagesdata.filter(filt).length) + statusmsg;
  updatesubmitstatus();
}

/* Deleting an image (through the delete button) */
function delimg(tobedel){
  var img = tobedel.parentNode; 
  /* Since 'tobedel' refers to the delete button, the whole image element is its parent */
  imagesdata.splice(parseInt(img.id),1,'');
  /* Replace the data of that image with a blank null */
  uploadstatus.innerHTML = String(imagesdata.filter(filt).length) + ' images uploaded!';
  img.parentNode.removeChild(img);
  /* Remove the whole image element from display  */
  updatesubmitstatus();
}

/* Filter function to remove blank or null (deleted) image urls from the image data array  */
function filt(x){
  return x != '';
};

/* Convers the image data into a url, and passes it into the 'cb' callback function  */
function toDataURL(url,cb) {
  var request = new XMLHttpRequest();
  request.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      cb(reader.result);
    }
    reader.readAsDataURL(request.response);
  };
  request.open('GET', url);
  request.responseType = 'blob';
  request.send();
}

/* Checks if conditions meet the criteria such that the submit button can be unlocked */
function updatesubmitstatus(){
  if (!imagesdata.filter(filt).length == 0 && checkstyles()){
    /* If there are images loaded, and style inputs are valid, unlock submission */
    no_images.value = imagesdata.filter(filt).length;
    submitbtn.disabled = false;
    submitstatus.innerHTML = '';
  }else if (!checkstyles()){
    /* If style inputs invalid, lock submission and display on submit status element */
    no_images.value = imagesdata.filter(filt).length;
    submitbtn.disabled = true;
    submitstatus.innerHTML = 'One of the colour style input values are invalid';
  }else{
    /* If no images uploaded, lock submission */
    submitbtn.disabled = true;
    submitstatus.innerHTML = '';
  }
}

/* Checks if conditions meet the criteria such style inputs are valid */
function checkstyles(){
  var result = true; /* Flag for validity */
  for (var i=0; i<inputs.length; i++){
    /* Check if value is not 'none' */
    if (inputs[i].value != 'none'){
      /* Splits the value into array of red blue and green values */
      var rgb = inputs[i].value.split(',');
      /* Check if all 3 values are valid (>=0 and <=255) */
      if (!(rgb.length == 3 && parseInt(rgb[0]) >= 0 && parseInt(rgb[0]) <= 255 && parseInt(rgb[1]) >= 0 && parseInt(rgb[1]) <= 255 && parseInt(rgb[2]) >= 0 && parseInt(rgb[2]) <= 255)) result = false;
    }
  }
  return result;
}
