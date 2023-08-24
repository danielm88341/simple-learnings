(function () {
  let preTag = document.getElementById("donut");

  // Angles, Radius, and Constants
  let A = 1;
  let B = 1;
  let R1 = 1;
  var R2 = 2;
  var K1 = 150;
  var K2 = 5;

  // Function to render ASCII frame
  function renderAsciiFrame() {
    let b = []; // array to stay acii chars
    let z = []; // Array to store depth values

    let width = 280; // Width of frame
    let height = 160; // Height of frame

    A += 0.07; // Increment angle A
    B += -0.001; // Increment angle B
    let cA = Math.cos(A),
      sA = Math.sin(A),
      cB = Math.cos(B),
      sB = Math.sin(B);

    // Initialize arrays with default angles
    for (let k = 0; k < width * height; k++) {
      // set default ascii chars
      b[k] = k % width === width - 1 ? "\n" : " ";
      // set default depth
      z[k] = 0;
    }

    // Generate the ascii frame
    for (let j = 0; j < 6.28; j += 0.07) {
      let ct = Math.cos(j), // Cos of j
        st = Math.sin(j); // Cos of j
      for (let i = 0; i < 6.28; i += 0.02) {
        let sp = Math.sin(i), // Sin i
          cp = Math.cos(i), // Cos i
          h = ct + 2, // Height calculation
          // Distance calculation
          D = 1 / (sp * h * sA + st * cA + 5),
          // Temporary var
          t = sp * h * cA - st - sA;

        // Calculate coords of acii char
        var x = Math.floor(
          width / 2 + (width / 4) * D * (cp * h * cB - t * sB)
        );
        var y = Math.floor(
          height / 2 + (height / 4) * D * (cp * h * sB + t * sB)
        );

        // Calculate the index of the arr
        var o = x + width * y;
        // Calculate the ascii char index
        var N = Math.floor(
          8 *
            ((st * sA - sp * ct * cA) * cB -
              sp * ct * sA -
              st * cA -
              cp * ct * sB)
        );

        // Update ascii char and depth if conditions are met
        if (y < height && y >= 0 && x >= 0 && x < width && D > z[o]) {
          z[o] = D;
          // Update ascii char based on index
          b[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0];
        }
      }
    }

    // Update html element with the ascii frame
    preTag.innerHTML = b.join("");

    // Constraints and curiosities
    A = A > 720 ? 1 : A;
    B = B > 720 ? 1 : B;
  }

  // Function to start animation
  function startAsciiAnimation() {
    // start by calling render every 50 ms
    window.asciiIntervalId = setInterval(renderAsciiFrame, 50);
  }

  renderAsciiFrame(); // Render initial ascii frame
  // Add event listener to the start of the animation when the page is loaded
  if (document.all) {
    // for older versions of internet explorer
    window.attachEvent("onload", startAsciiAnimation);
  } else {
    // for modern browsers
    window.addEventListener("load", startAsciiAnimation, false);
  }

  // Add event listener to update ascii frame when window is resized
  window.addEventListener("resize", renderAsciiFrame);
})();
