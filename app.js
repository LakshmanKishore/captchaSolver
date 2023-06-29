// Find the image element with the 'alt' attribute
var imageWithAlt = document.querySelector('img[alt]');

// Create the preprocessed image element
var preprocessedImage = document.createElement('img');
preprocessedImage.id = 'preprocessed-image';
preprocessedImage.src = 'preprocessed-image'; // Replace with the path or URL to your preprocessed image

// Insert the preprocessed image element as a sibling after the image with 'alt'
imageWithAlt.parentNode.insertBefore(preprocessedImage, imageWithAlt.nextSibling)

// Create a new canvas element
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

function preprocessCaptcha(imageElement, characterColor) {

  // Set the canvas size to match the image dimensions
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;

  // Draw the image on the canvas
  context.drawImage(imageElement, 0, 0);

  // Get the pixel data from the canvas
  var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  var pixels = imageData.data;

  // Preprocess the image
  for (var i = 0; i < pixels.length; i += 4) {
    var r = pixels[i];
    var g = pixels[i + 1];
    var b = pixels[i + 2];

    // Check if the pixel matches the character color
    if (r === characterColor && g === characterColor && b === characterColor) {
      // Set the pixel to black
      pixels[i] = 0;
      pixels[i + 1] = 0;
      pixels[i + 2] = 0;
    } else {
      // Set the pixel to transparent
      pixels[i + 3] = 0;
    }
  }

  // Dilate the characters
  imageData = dilate(imageData, 1);

  // Update the canvas with the preprocessed pixel data
  context.putImageData(imageData, 0, 0);

  // Return the preprocessed image as a data URL
  return canvas.toDataURL();
}

// Dilation function
function dilate(imageData, dilationFactor) {
  var pixels = imageData.data;
  var width = imageData.width;
  var height = imageData.height;

  var dilatedData = context.createImageData(width, height);

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var index = (y * width + x) * 4;

      // Check if the pixel is black (character pixel)
      if (pixels[index] === 0 && pixels[index + 1] === 0 && pixels[index + 2] === 0) {
        // Set the neighboring pixels to black as well
        for (var dy = -dilationFactor+1; dy <= dilationFactor; dy++) {
          for (var dx = -dilationFactor+1; dx <= dilationFactor; dx++) {
            var nx = x + dx;
            var ny = y + dy;

            if (nx >= 0 && ny >= 0 && nx < width && ny < height) {
              var nIndex = (ny * width + nx) * 4;
              dilatedData.data[nIndex] = 0;
              dilatedData.data[nIndex + 1] = 0;
              dilatedData.data[nIndex + 2] = 0;
              dilatedData.data[nIndex + 3] = 255;
            }
          }
        }
      }
    }
  }

  return dilatedData;
}

// Example usage
var imageElement = document.querySelector('img[alt]');
var characterColor = 102; // Adjust this value to match the character color (hex: #666666)

// Preprocess the image
var preprocessedDataURL = preprocessCaptcha(imageElement, characterColor);

// Display the preprocessed image
var preprocessedImageElement = document.getElementById('preprocessed-image');
preprocessedImageElement.src = preprocessedDataURL;


// var scriptElement = document.createElement('script');
// scriptElement.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js';
// document.head.appendChild(scriptElement);


var worker = new Tesseract.createWorker();

async function start(){
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    tessedit_char_blacklist: ' '
  });
  const { data } = await worker.recognize(preprocessedImage);
  console.log("Data:",data.text.replace(/\s/g, ''));
  await worker.terminate();
}

start()

// Initialize Tesseract.js with the configuration options
// Tesseract.recognize(preprocessedImage)
//   .then(function(result) {
//     // Extracted text
//     var extractedText = result.text;

//     // Display the extracted text
//     console.log(extractedText);
//   })
//   .catch(function(error) {
//     // Error handling
//     console.error(error);
//   });
