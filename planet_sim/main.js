let planetNumber = 1;
      
      // Toggle
      function toggleFunction() {
        let checkBox = document.getElementById("toggle");
        if (toggle.checked == true) {
          planets[planetNumber].locked = true;
        } else {
          planets[planetNumber].locked = false;
        }
      }
     
      // slider
      let slider1 = document.getElementById("myRange");
      let output1 = document.getElementById("value");

      output1.innerHTML = slider1.value / 100;

      slider1.oninput = function() {
        output1.innerHTML = this.value / 100;
        planets[planetNumber].radius =
          (planets[planetNumber].originalRadius * this.value) / 100;
      };

      let canvas = document.getElementById("canvas");
      console.log(canvas.width);
      canvas.width = window.innerWidth - 100;
      canvas.height = window.innerHeight - 100;
      const context = canvas.getContext("2d");
      let earth = document.createElement("IMG");
      let avalablePlanets = {
        earth: ["images/earth_sprite.png", 118, 1],
        sun: ["images/sun_sprite.png", 54, 1.5]
      };
      console.log(avalablePlanets);

      let planets = new Array();

      class Planet {
        constructor(
          _radius,
          _speed,
          _direction,
          _color,
          _locationX,
          _locationY,
          _locked,
          _type
        ) {
          this.radius = _radius;
          this.originalRadius = _radius;
          this.speed = _speed;
          this.direction = _direction;
          this.color = _color;
          this.locationX = _locationX;
          this.locationY = _locationY;
          this.locked = _locked;

          this.xVector = Math.cos(this.direction) * this.speed;
          this.yVector = Math.sin(this.direction) * this.speed;
          this.counter = 0;
          this.frame = 0;
          this.type = _type;
          this.opacity = 1

          for (let planet in avalablePlanets) {
            if (this.type == planet) {
              this.src = avalablePlanets[planet][0];
              this.planetImgNumber = avalablePlanets[planet][1];
              this.planetSizeMulitplier = avalablePlanets[planet][2];
            }
          }
        }

        drawPlanet() {
          // context.beginPath();
          // context.arc(this.locationX, this.locationY, this.radius, 0, 2 * Math.PI);
          // context.fillStyle = this.color;
          // context.strokeStyle = this.color;
          // context.fill();
          // context.stroke();
      
          image(
            this.src,
            this.planetImgNumber,
            this.radius * this.planetSizeMulitplier,
            this.locationX,
            this.locationY,
            this.frame,
            this.opacity
          );
          
          this.frame++;
        }

        updateVector() {
          for (let i = 0, len = planets.length; i < len; i++) {
            let wid = this.locationX - planets[i].locationX;
            let hig = this.locationY - planets[i].locationY;
            // Do no calculate your own position
            if (wid != 0 || hig != 0) {
              // the angle to the other planets
              if (wid < 0) {
                var angle = Math.atan(hig / wid);
              } else if (wid > 0) {
                var angle = Math.atan(hig / wid) - Math.PI;
              }

              // Converting the angle into +- one pi
              angle = lowerPI(angle);

              // The distance to the other planets
              let XdistanceSq = Math.pow(
                this.locationX - planets[i].locationX,
                2
              );
              let YdistanceSq = Math.pow(
                this.locationY - planets[i].locationY,
                2
              );
              let distance = Math.pow(XdistanceSq + YdistanceSq, 0.5);

              // Gravitational force formula
              let thisMass = (4 / 3) * Math.PI * Math.pow(this.radius, 3);
              let mass = (4 / 3) * Math.PI * Math.pow(planets[i].radius, 3);
              let gravForce = (thisMass * mass) / Math.pow(distance, 2) / 25000;

              // Adding vectors together

              // Adding vectors together
              let gravVectorY =
                Math.sin(angle) * gravForce * (1 / thisMass) * 4000;
              let gravVectorX =
                Math.cos(angle) * gravForce * (1 / thisMass) * 4000;

              // New vector
              let newVectorX = gravVectorX + this.xVector;
              let newVectorY = gravVectorY + this.yVector;

              // draw grav vector
              drawVector(
                this.locationX,
                this.locationY,
                gravVectorX * 100,
                gravVectorY * 100,
                "green"
              );

              // draw new vector
              drawVector(
                this.locationX,
                this.locationY,
                newVectorX,
                newVectorY,
                "red"
              );

              this.xVector = newVectorX;
              this.yVector = newVectorY;
            }
          }
        }

        move() {
          if (this.locked == false) {
            this.locationX = this.xVector / 100 + this.locationX;
            this.locationY = this.yVector / 100 + this.locationY;
          }
        }
      }

      function drawVector(
        planetLocX,
        planetLocY,
        vectorLocX,
        vectorLocY,
        color
      ) {
        context.beginPath();
        context.moveTo(planetLocX, planetLocY);
        context.lineTo(vectorLocX + planetLocX, vectorLocY + planetLocY);
        context.strokeStyle = color;
        context.fill();
        context.stroke();
      }

      function lowerPI(angle) {
        if (angle < Math.PI) {
          angle += 2 * Math.PI;
        }
        if (angle > Math.PI) {
          angle -= 2 * Math.PI;
        }
        return angle;
      }

      function movePlanets() {
        // Splitts in 2 parts to draw planets as soon as the canvas it cleared to avoid "blinking" of planets
        for (let i = 0, len = planets.length; i < len; i++) {
          planets[i].move();
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0, len = planets.length; i < len; i++) {
          planets[i].drawPlanet();
          planets[i].updateVector();
        }
        //context.clearRect(0, 0, canvas.width, canvas.height);
      }

      function resize() {
        // The canvas has to be resized when the window changes
        canvas.width = window.innerWidth - 100;
        canvas.height = window.innerHeight - 100;
        for (let i = 0, len = planets.length; i < len; i++) {
          planets[i].drawPlanet();
        }
      }

      function image(src, totalNumberOfFrames, size, x, y, frame, opacity) {
        let img = new Image();
        img.src = src;
        let height = size * 2;
        let width = size * 2;
        x = x - height / 2;
        y = y - width / 2;

        // ten images in the image (see the url above)
        let imageFrameNumber = frame; // This is changed to make the sprite animate
        let widthOfImage = img.width; // find the width of the image
        let heightOfImage = img.height; // find the height of the image
        let widthOfSingleImage = widthOfImage / totalNumberOfFrames; // The width of each image in the spirite

        imageFrameNumber++; // changes the sprite we look at
        imageFrameNumber = imageFrameNumber % totalNumberOfFrames; // Change this from 0 to 1 to 2 ... upto 9 and back to 0 again, then 1...
        context.globalAlpha = opacity;
        context.drawImage(
          img,
          imageFrameNumber * widthOfSingleImage,
          0, // x and y - where in the sprite
          widthOfSingleImage,
          heightOfImage, // width and height
          x,
          y, // x and y - where on the screen
          width,
          height // width and height
        );
      }

      function planetSelect(mouseData) {
        let x = mouseData.x;
        let y = mouseData.y;
        x = x - 130;
        y = y - 120;
        //console.log(mouseData)

        // only on canvas and only left click
        if (x > 0 && y > 0 && mouseData.button == 0) {
          // Making a clickable square
          for (let i = 0, len = planets.length; i < len; i++) {
            // Checks the location of the curser on the canvas
            if (
              planets[i].locationX - planets[i].radius * 1.5 < x &&
              planets[i].locationX + planets[i].radius * 1.5 > x
            ) {
              if (
                planets[i].locationY - planets[i].radius * 1.5 < y &&
                planets[i].locationY + planets[i].radius * 1.5 > y
              ) {
                  // detect click
                if (mouseData.buttons == 1) {
                  planetNumber = i;
                  document.getElementById("selectedPlanet").innerHTML =
                    planets[i].type;
                }

                // set the planets value on the slider when hovering
                if (planets[i].locked == true) {
                  document.getElementById("toggle").checked = true;
                } else {
                  document.getElementById("toggle").checked = false;
                }
                document.getElementById("myRange").value =
                  (planets[i].radius / planets[i].originalRadius) * 100;

                canvas.style.cursor = "pointer";

                planets[i].opacity = 0.5;  // changes opasity
                break;
              }
            } else {
              planets[i].opacity = 1;
              canvas.style.cursor = "default";

              // Defult the sliders
              document.getElementById("toggle").checked =
                planets[planetNumber].locked;
              document.getElementById("myRange").value =
                (planets[planetNumber].radius / planets[i].originalRadius) *
                100;
            }
          }
        }
      }

      let selected = false;
      let selectedPlanetType

      function selectedPlanet(planet){
          console.log(planet);
          selectedPlanetType = planet;
          //canvas.style.cursor = "none";
          selected = true;
          let planet3 = new Planet(
            20,
            30,
            -Math.PI,
            "white",
            -300,
            -300,
            true,
            selectedPlanetType
          );
          planets.push(planet3);
      }

      function placePlanet(data){
          let x =data.x;
          let y = data.y;
          planets[2].locationX = x- 130;
          planets[2].locationY = y- 100;
          if (data.buttons == 1){
              selected = false;
              planets[2].locked = false;
          }
        
      }

      function mouseListener(data){
        if(selected == false){
            planetSelect(data);
        } else{
            placePlanet(data);
        }
      }

      // radius, speed, direction, color, locationX, locationY, locked
      let planet1 = new Planet(
        20,
        80,
        -Math.PI,
        "white",
        200,
        100,
        false,
        "earth"
      );
      planets.push(planet1);

      let planet2 = new Planet(20, 20, 0, "yellow", 200, 200, true, "sun");
      planets.push(planet2);

      let planet3 = new Planet(
        10,
        40,
        Math.PI / 2,
        "red",
        50,
        50,
        false,
        "earth"
      );
      //planets.push(planet3)
        
      window.addEventListener("resize", resize, true);
      window.addEventListener("mousemove", mouseListener, true);
      window.addEventListener("mousedown", mouseListener, true);
      //movePlanets();
      let intervalTimer = setInterval(movePlanets, 10);