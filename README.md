## Catpcha Solver

A captcha solver for vtu website.


## Usage - Desktop

* Install CJS chrome extension from [here](https://chrome.google.com/webstore/detail/custom-javascript-for-web/ddbjnfjiigjmcpcpkmhogomapikjbjdk).
* Open the results page of VTU website.
* Open the CJS extension and paste the below code in the editor.
* Click on Save.

```javascript
javascript: (function() {
    var script = document.createElement('script');
    script.src = "//cdn.jsdelivr.net/gh/LakshmanKishore/captchaSolver@v1.0.0/solver.min.js";
    document.body.appendChild(script);
    script.onload = function() {
        console.log("Captcha Solver initialized!")
    }
})();
```



## Usage - Mobile

* Create a book mark with some name.
* Paste the above code in the URL section and save it.
* Open the results page in mobile and in the url bar type the name of the book mark and select the bookmark popped.
* The captcha would be solved.



## Demo

![](./captcha_solve_eg.gif)