'use strict';

angular.module('mrWebdesignApp')
  .controller('FSGCtrl', function ($scope) {
/*
 *  Mike Robertson
*/

//------------------------------------------------------------------------------------------------------------
//  Canvas setup
//------------------------------------------------------------------------------------------------------------

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 500;
canvas.class = 'fsgContainer';
var prevNumParticles = 0;
$('#gameContainer').append(canvas);
//document.body.appendChild(canvas);



//------------------------------------------------------------------------------------------------------------
//  Object constructors, object lists, and object related vars/timers
//------------------------------------------------------------------------------------------------------------
//------------------------------------object lists
var particleList = [];

//------------------------------------pixel grid
var pixArray = new Array(canvas.width+1);
for (var i = 0; i < canvas.width+1; i++) {
    pixArray[i] = new Array(canvas.height+1);
}


//------------------------------------timers



//------------------------------------Particle class
function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.xVel = 0;
    this.yVel = 0;
    this.color = 'AAAAAA';
    this.type = 'None';
    this.flammable = false;
    this.onFire = false;
    this.fireProof = false;
}

Particle.prototype.checkParticle = function(x, y) {
    if ((x > 0 && x < canvas.width + 1 && y > 0 && y < canvas.height + 1) && pixArray[x][y]) {
        return true;
    }       
    return false;
};

Particle.prototype.update = function() {
    if(this.xVel !== 0 || this.yVel !== 0) {
        this.move();
    }
};

Particle.prototype.move = function() {
    if (!this.checkParticle(this.x + this.xVel, this.y + this.yVel)) {
        delete pixArray[this.x][this.y];
        this.x += this.xVel;
        this.y += this.yVel;
        if (!(this.x < 0 || this.x > canvas.width + 1 || this.y < 0 || this.y > canvas.height + 1)) {
            pixArray[this.x][this.y] = this;
        }
        return true;
    }
    return false;
};

Particle.prototype.nextAvailable = function(left, right, yChange) {
    var leftX = this.x;
    var rightX = this.x;
    var y = this.y;
    while (left || right) {
        if(left) {
            leftX -= 1;
            if (leftX > 0) {
                if(!this.checkParticle(leftX, y + yChange)) {
                    for(var x = this.x - 1; x > leftX; x--) {
                        if(this.checkParticle(x, y)) {
                            left = false;
                        }
                    }
                    if(left) {
                        return leftX;
                    }
                }
                // else if(this.checkParticle(leftX, y)
            }
            else {
                left = false;
            }
        }
        if(right) {
            rightX += 1;
            if (rightX <= canvas.width) {
                if(!this.checkParticle(rightX, y + yChange)) {
                    for(var n = this.x + 1; n < rightX; n++) {
                        if(this.checkParticle(n, y)) {
                            right = false;
                        }
                    }
                    if(right) {
                        return rightX;
                    }
                }
            }
            else {
                right = false;
            }
        }
    }
    return this.x;
    
};

Particle.prototype.nextAvailableUp = function(left, right, yChange) {
    var leftX = this.x;
    var rightX = this.x;
    var y = this.y;
    while (left || right) {
        if(left) {
            leftX -= 1;
            if (leftX > 0) {
                if(!this.checkParticle(leftX, y + yChange)) {
                    for(var x = this.x - 1; x > leftX; x--) {
                        if(this.checkParticle(x, y)) {
                            left = false;
                        }
                    }
                    if(left) {
                        return leftX;
                    }
                }
                // else if(this.checkParticle(leftX, y)
            }
            else {
                left = false;
            }
        }
        if(right) {
            rightX += 1;
            if (rightX <= canvas.width) {
                if(!this.checkParticle(rightX, y + yChange)) {
                    for(var n = this.x + 1; n < rightX; n++) {
                        if(this.checkParticle(n, y)) {
                            right = false;
                        }
                    }
                    if(right) {
                        return rightX;
                    }
                }
            }
            else {
                right = false;
            }
        }
    }
    return this.x;
    
};


Particle.prototype.waterUnderneath = function(x, y) {
    if (pixArray[x][y] && pixArray[x][y].type === 'Water') {
        return true;
    }
    return false;
};

Particle.prototype.waterSwap = function(x, y) {
    var temp = pixArray[x][y];
    pixArray[this.x][this.y] = temp;
    pixArray[x][y] = this;
    
    var tempX = this.x;
    var tempY = this.y;
    
    this.x = temp.x;
    this.y = temp.y;
    
    temp.x = tempX;
    temp.y = tempY; 
    
    /* var temp = pixArray[x][y];
    pixArray[x][y] = this;
    
    var found = false;
    
    var tempX = this.x;
    var tempY = this.y;
    var count = -1;
    while(tempY + count > 0 && !found) {
        tempX = temp.nextAvailableUp(true, true, count);
        if (tempX !== tempX)
            found = true;
        else
            count--;
    }
    if (found) {
        tempY += count;
    }
    
    delete pixArray[this.x][this.y];
    pixArray[tempX][tempY] = temp;
    
    this.x = temp.x;
    this.y = temp.y;
    
    temp.x = tempX;
    temp.y = tempY;      */
};

Particle.prototype.allSurroundingParticles = function() {
    var surrounding = [];
    for(var x = this.x - 1; x <= this.x + 1; x++) {
        for(var y = this.y - 1; y <= this.y + 1; y++) {
            if (this.checkParticle(x, y) && (this.x !== x || this.y !== y)) {
                surrounding.push(pixArray[x][y]);
            }
        }
    }
    return surrounding;
};

//------------------------------------Wall class
function Wall(x, y) {
    Particle.call(this, x, y);  //call Particle constructor
    this.type = 'Wall';
    this.fireProof = true;
}

Wall.prototype = Object.create(Particle.prototype);
Wall.prototype.constructor = Wall;

//------------------------------------Wax class
function Wax(x, y) {
    Particle.call(this, x, y);  //call Particle constructor
    this.type = 'Wax';
    this.color = 'EAF5A4';
    this.flammable = true;
}

Wax.prototype = Object.create(Particle.prototype);
Wax.prototype.constructor = Wax;

//------------------------------------Plant class
function Plant(x, y) {
    Particle.call(this, x, y);  //call Particle constructor
    this.type = 'Plant';
    this.color = '00FF00';
    this.flammable = true;
}

Plant.prototype = Object.create(Particle.prototype);
Plant.prototype.constructor = Plant;


//------------------------------------Sand class
function Sand(x, y) {
    Particle.call(this, x, y);
    this.color = 'E5F57F';
    this.yVel = 1; //gravity
    this.type = 'Sand';
}

Sand.prototype = Object.create(Particle.prototype);
Sand.prototype.constructor = Sand;

Sand.prototype.move = function() {
    if (!this.checkParticle((this.x + this.xVel), (this.y + this.yVel))) {
        delete pixArray[this.x][this.y];
        this.x += this.xVel;
        this.y += this.yVel;
        if (!(this.x < 0 || this.x > canvas.width + 1 || this.y < 0 || this.y > canvas.height + 1)) {
            pixArray[this.x][this.y] = this;
        }
    }
    else {
        if(this.waterUnderneath(this.x + this.xVel, this.y + this.yVel)) {
            this.waterSwap(this.x + this.xVel, this.y + this.yVel); 
        }
        else {
            var left, right = false;
            if (this.x - 1 > 0 && (!this.checkParticle(this.x - 1, this.y + this.yVel) || this.waterUnderneath(this.x - 1, this.y + this.yVel))) {
                left = true;
            }
            if (this.x + 1 < canvas.width && (!this.checkParticle(this.x + 1, this.y + this.yVel) || this.waterUnderneath(this.x + 1, this.y + this.yVel))) {
                right = true;
            }
            if (left && right) {
                if (Math.random() >= 0.5) {
                    if(this.waterUnderneath(this.x - 1, this.y + this.yVel)) {
                        this.waterSwap(this.x - 1, this.y + this.yVel);
                    }
                    else {
                        delete pixArray[this.x][this.y];
                        this.x -= 1;
                        this.y += this.yVel;
                        if (!(this.x < 0 || this.x > canvas.width + 1 || this.y < 0 || this.y > canvas.height + 1)) {
                            pixArray[this.x][this.y] = this;
                        }
                        return true;
                    }
                }
                else {
                    if(this.waterUnderneath(this.x + 1, this.y + this.yVel)) {
                        this.waterSwap(this.x + 1, this.y + this.yVel);
                    }
                    else {
                        delete pixArray[this.x][this.y];
                        this.x += 1;
                        this.y += this.yVel;
                        if (!(this.x < 0 || this.x > canvas.width + 1 || this.y < 0 || this.y > canvas.height + 1)) {
                            pixArray[this.x][this.y] = this;
                        }
                        return true;    
                    }               
                }
            }
            else if (left) {
                if(this.waterUnderneath(this.x - 1, this.y + this.yVel)) {
                    this.waterSwap(this.x - 1, this.y + this.yVel);
                }
                else {
                    delete pixArray[this.x][this.y];
                    this.x -= 1;
                    this.y += this.yVel;
                    
                    if (!(this.x < 0 || this.x > canvas.width + 1 || this.y < 0 || this.y > canvas.height + 1)) {
                        pixArray[this.x][this.y] = this;
                    }
                    return true;
                }       
            }
            else if (right) {
                if(this.waterUnderneath(this.x + 1, this.y + this.yVel)) {
                    this.waterSwap(this.x + 1, this.y + this.yVel);
                }
                else {
                    delete pixArray[this.x][this.y];
                    this.x += 1;
                    this.y += this.yVel;
                    
                    if (!(this.x < 0 || this.x > canvas.width + 1 || this.y < 0 || this.y > canvas.height + 1)) {
                        pixArray[this.x][this.y] = this;
                    }
                    return true;
                }           
            }
        }
    }
    return false;
};

Sand.prototype.waterSwap = function(x, y) {
    var temp = pixArray[x][y];
    pixArray[this.x][this.y] = temp;
    pixArray[x][y] = this;
    
    var tempX = this.x;
    var tempY = this.y;
    
    this.x = temp.x;
    this.y = temp.y;
    
    temp.x = tempX;
    temp.y = tempY; 
    
    /* var temp = pixArray[x][y];
    pixArray[x][y] = this;
    
    var found = false;
    
    var tempX = this.x;
    var tempY = this.y;
    var count = -1;
    while(tempY + count > 0 && !found) {
        tempX = temp.nextAvailableUp(true, true, count);
        if (tempX !== tempX)
            found = true;
        else
            count--;
    }
    if (found) {
        tempY += count;
    }
    
    delete pixArray[this.x][this.y];
    pixArray[tempX][tempY] = temp;
    
    this.x = temp.x;
    this.y = temp.y;
    
    temp.x = tempX;
    temp.y = tempY;      */
};

//------------------------------------Water class
function Water(x, y) {
    Particle.call(this, x, y);
    this.color = '4655FA';
    this.yVel = 1; //gravity
    this.type = 'Water';
}

Water.prototype = Object.create(Particle.prototype);
Water.prototype.constructor = Water;

Water.prototype.move = function() {
    var surrounding = this.allSurroundingParticles();
    if (!this.checkParticle((this.x + this.xVel), (this.y + this.yVel))) {
        delete pixArray[this.x][this.y];
        this.x += this.xVel;
        this.y += this.yVel;
        if (!(this.x < 0 || this.x > canvas.width + 1 || this.y < 0 || this.y > canvas.height + 1)) {
            pixArray[this.x][this.y] = this;
        }
    }
    else if(pixArray[this.x][this.y + this.yVel].type === 'Steam') {
        this.waterSwap(this.x, this.y + this.yVel);
        return true;
    }
    else {
        if(surrounding.length > 0) {
            for(var i = 0; i < surrounding.length; i++) {
                if(surrounding[i].type === 'Plant') {
                    var nPlant = new Plant(this.x, this.y);
                    console.log(this.x + "," + this.y);
                    pixArray[this.x][this.y] = nPlant;
                    console.log('worked');
                    particleList.push(nPlant);
                    this.x = -1;
                    return true;
                }
            }
        }
        var left, right = false;
        if (this.x - 1 > 0 && !this.checkParticle(this.x - 1, this.y)) {
            left = true;
        }
        if (this.x + 1 < canvas.width && !this.checkParticle(this.x + 1, this.y)) {
            right = true;
        }
        var tempX = this.nextAvailable(left, right, this.yVel);
        if(tempX !== this.x) {
            delete pixArray[this.x][this.y];
            this.x = tempX;
            this.y += this.yVel;
            if (!(this.x < 0 || this.x > canvas.width + 1 || this.y < 0 || this.y > canvas.height + 1)) {
                pixArray[this.x][this.y] = this;
            }
            return true;
        }
    }
    return false;
};

//------------------------------------Acid class
function Acid(x, y) {
    Particle.call(this, x, y);
    this.color = '70FA7A';
    this.yVel = 1; //gravity
    this.type = 'Acid';
    this.life = 2;  //the particle will disappear once it has dissolved x particles
}

Acid.prototype = Object.create(Particle.prototype);
Acid.prototype.constructor = Acid;

Acid.prototype.move = function() {
    if (!this.checkParticle((this.x + this.xVel), (this.y + this.yVel))) {
        delete pixArray[this.x][this.y];
        this.x += this.xVel;
        this.y += this.yVel;
        if (!(this.x < 0 || this.x > canvas.width + 1 || this.y < 0 || this.y > canvas.height + 1)) {
            pixArray[this.x][this.y] = this;
        }
    }
    else if (pixArray[this.x + this.xVel][this.y + this.yVel].type !== 'Acid') {
        if (Math.random() > 0.5) {
            delete pixArray[this.x][this.y];
            this.x += this.xVel;
            this.y += this.yVel;
            this.life--;
            if(this.life <= 0) {
                pixArray[this.x][this.y].x = -1;
                delete pixArray[this.x][this.y];
                this.x = -1;
            }
            else if (!(this.x < 0 || this.x > canvas.width + 1 || this.y < 0 || this.y > canvas.height + 1)) {
                //mark that particle to delete from particleList
                pixArray[this.x][this.y].x = -1;
                pixArray[this.x][this.y] = this;
            }
        }
    }
    else {
        var left, right = false;
        if (this.x - 1 > 0 && !this.checkParticle(this.x - 1, this.y)) {
            left = true;
        }
        if (this.x + 1 < canvas.width && !this.checkParticle(this.x + 1, this.y)) {
            right = true;
        }
        var tempX = this.nextAvailable(left, right, this.yVel);
        if(tempX !== this.x) {
            delete pixArray[this.x][this.y];
            this.x = tempX;
            this.y += this.yVel;
            if (!(this.x < 0 || this.x > canvas.width + 1 || this.y < 0 || this.y > canvas.height + 1)) {
                pixArray[this.x][this.y] = this;
            }
            return true;
        }
    }
    return false;
};

//------------------------------------Fire class
function Fire(x, y) {
    Particle.call(this, x, y);
    this.color = 'FC7200';
    this.yVel = -1; //gravity
    this.type = 'Fire';
    this.life = 30; //it will last X update cycles
    this.startTimer = Timer;
    this.fireProof = true;
}

Fire.prototype = Object.create(Particle.prototype);
Fire.prototype.constructor = Fire;

Fire.prototype.move = function() {
    if (Timer - this.startTimer > this.life) {
        delete pixArray[this.x][this.y];
        this.x = -1;
    }
    else {
        var oldX = this.x;
        var oldY = this.y;
        var left, right, center = false;
        var rand = Math.random();
        if(rand < 0.333) {
            left = true;
        }
        else if(rand >= 0.333 && rand < 0.667) {
            center = true;
        }
        else if(rand >= 0.667) {
            right = true;
        }
        if (this.checkParticle((this.x + this.xVel), (this.y + this.yVel))) {
            center = false;
        }
        if (this.checkParticle((this.x + this.xVel + 1), (this.y + this.yVel))) {
            right = false;
        }
        if (this.checkParticle((this.x + this.xVel - 1), (this.y + this.yVel))) {
            left = false;
        }
        
        var surrounding = this.allSurroundingParticles();
        for(var i = 0; i < surrounding.length; i++) {
            var temp = surrounding[i];
            var nFire;
            if (temp.flammable && Math.random() > 0.9 && temp.y < this.y) {
                nFire = new Fire(temp.x, temp.y);
                pixArray[temp.x][temp.y] = nFire;
                particleList.push(nFire);
                temp.x = -1;
            }
            else if (temp.flammable && Math.random() > 0.8 && temp.y === this.y) {
                nFire = new Fire(temp.x, temp.y);
                pixArray[temp.x][temp.y] = nFire;
                particleList.push(nFire);
                temp.x = -1;            
            }
            else if (temp.flammable && Math.random() > 0.333 && temp.y > this.y) {
                nFire = new Fire(temp.x, temp.y);
                pixArray[temp.x][temp.y] = nFire;
                particleList.push(nFire);
                temp.x = -1;            
            }
            else if(temp.type !== 'Water' && !temp.fireProof && Math.random() > 0.95) {
                delete pixArray[temp.x][temp.y];
                temp.x = -1;
            }
            else if(temp.type === 'Water') {
                var tX = temp.x;
                var tY = temp.y;
                temp.x = -1;
                temp = new Steam(tX, tY);
                pixArray[temp.x][temp.y] = temp;
                particleList.push(pixArray[temp.x][temp.y]);
            }
            else if(temp.fireProof) {
                // var left, right = false;
                // if (this.x - 1 > 0 && !this.checkParticle(this.x - 1, this.y))
                // {
                //  left = true;
                // }
                // if (this.x + 1 < canvas.width && !this.checkParticle(this.x + 1, this.y))
                // {
                //  right = true;
                // }
                // var tempX = this.nextAvailable(left, right, this.yVel);
                // if(tempX != this.x)
                // {
                //  delete pixArray[this.x][this.y];
                //  this.x = tempX;
                //  this.y += this.yVel;
                //  if (!(this.x < 0 || this.x > canvas.width + 1 || this.y < 0 || this.y > canvas.height + 1))
                //      pixArray[this.x][this.y] = this;
                //  return true;
                // }
            }
        }
        
        
        if (left) {
            delete pixArray[this.x][this.y];
            this.x -= 1;
            this.y += this.yVel;
            if (this.x > 0 && this.x < canvas.width + 1 && this.y > 0 && this.y < canvas.height + 1) {
                pixArray[this.x][this.y] = this;
            }
            else {
                delete pixArray[oldX][oldY];
                this.x = -1;
            }
        }
        else if (center) {
            delete pixArray[this.x][this.y];
            // this.x += this.xVel;
            this.y += this.yVel;
            if (this.x > 0 && this.x < canvas.width + 1 && this.y > 0 && this.y < canvas.height + 1) {
                pixArray[this.x][this.y] = this;
            }               
            else {
                delete pixArray[oldX][oldY];
                this.x = -1;
            }
        
        }
        else if (right) {
            delete pixArray[this.x][this.y];
            this.x += 1;
            this.y += this.yVel;
            if (this.x > 0 && this.x < canvas.width + 1 && this.y > 0 && this.y < canvas.height + 1) {
                    pixArray[this.x][this.y] = this;
            }
            else {
                delete pixArray[oldX][oldY];
                this.x = -1;
            }       
        }
    }       
};

//------------------------------------Steam class
function Steam(x, y) {
    Particle.call(this, x, y);
    this.color = 'B3F5FC';
    this.yVel = -1; //gravity
    this.type = 'Steam';
    this.life = 150;    //it will last X update cycles
    this.startTimer = Timer;
    this.fireProof = true;
}

Steam.prototype = Object.create(Particle.prototype);
Steam.prototype.constructor = Steam;

Steam.prototype.move = function() {
    if (Timer - this.startTimer > this.life) {
        delete pixArray[this.x][this.y];
        var temp = new Water(this.x, this.y);
        pixArray[this.x][this.y] = temp;
        particleList.push(temp);
        this.x = -1;
    }
    else {
        var oldX = this.x;
        var oldY = this.y;
        var left, right, center = false;
        var rand = Math.random();
        if(rand < 0.333) {
            left = true;
        }
        else if(rand >= 0.333 && rand < 0.667) {
            center = true;
        }
        else if(rand >= 0.667) {
            right = true;
        }
        if (this.checkParticle((this.x + this.xVel), (this.y + this.yVel))) {
            center = false;
        }
        if (this.checkParticle((this.x + this.xVel + 1), (this.y + this.yVel))) {
            right = false;
        }
        if (this.checkParticle((this.x + this.xVel - 1), (this.y + this.yVel))) {
            left = false;
        }       
        
        if (left) {
            delete pixArray[this.x][this.y];
            this.x -= 1;
            this.y += this.yVel;
            if (this.x > 0 && this.x < canvas.width + 1 && this.y > 0 && this.y < canvas.height + 1) {
                pixArray[this.x][this.y] = this;
            }
            else {
                delete pixArray[oldX][oldY];
                this.x = -1;
            }
        }
        else if (center) {
            delete pixArray[this.x][this.y];
            // this.x += this.xVel;
            this.y += this.yVel;
            if (this.x > 0 && this.x < canvas.width + 1 && this.y > 0 && this.y < canvas.height + 1) {
                pixArray[this.x][this.y] = this;
            }               
            else {
                delete pixArray[oldX][oldY];
                this.x = -1;
            }
        
        }
        else if (right) {
            delete pixArray[this.x][this.y];
            this.x += 1;
            this.y += this.yVel;
            if (this.x > 0 && this.x < canvas.width + 1 && this.y > 0 && this.y < canvas.height + 1) {
                    pixArray[this.x][this.y] = this;
            }
            else {
                delete pixArray[oldX][oldY];
                this.x = -1;
            }       
        }
    }       
};

//------------------------------------game state variables
// var currentTool = 0;

var TypeEnum = Object.freeze( {
    'Wall': 0,
    'Sand': 1,
    'Water': 2,
    'Acid': 3,
    'Wax': 4,
    'Fire': 5,
    'Plant': 6,
    'KeyLookup': ['Wall', 'Sand', 'Water', 'Acid', 'Wax', 'Fire', 'Plant']
});

$scope.brushSize = 10;
$scope.numParticles = 0;

$scope.updateNumParticles = function(num) {
    $scope.numParticles = num;
};

var Timer = 0;

//------------------------------------------------------------------------------------------------------------
//  Input listeners
//------------------------------------------------------------------------------------------------------------
//------------------------------------handle inputs
var mouseXY = [];

// We want to get this and set it globally so that we only have to make a single call to get these values.
var tempMainCont = $('.container');
var paddingLeft = parseInt(tempMainCont.css('padding-left'));
var marginLeft = parseInt(tempMainCont.css('margin-left'));

var captureMouseCoords = function(e) {
    // is left mouse button down?
    if(e.which === 1) {
        
        mouseXY[0] = event.pageX - paddingLeft - marginLeft;
        mouseXY[1] = event.pageY - $('canvas').offset().top;
    }
    else {
        delete mouseXY[0];
        delete mouseXY[1];
    }
};

addEventListener('mousemove', function (e){captureMouseCoords(e);}, false);

addEventListener('mousedown', function (e) {
    // if(event.clientX > canvas.width || event.clientY > canvas.height
    //  || event.clientX < 0 || event.clientY < 0)
    // {
    //  if (currentTool < 5)
    //      currentTool++;
    //  else
    //      currentTool = 0;
    // }
    // else
    // {
        captureMouseCoords(e);
    // }
}, false);

// console.log(incSize);
// decSize.addEventListener('click', decBrushSize());
// incSize.addEventListener('click', incBrushSize());

// var keysDown = {};

// addEventListener('keydown', function (e) 
// {
//  keysDown[e.keyCode] = true;
// }, false);

// addEventListener('keyup', function (e) 
// {
//  delete keysDown[e.keyCode];
// }, false);



//------------------------------------------------------------------------------------------------------------
//  Setting and Resetting functions
//------------------------------------------------------------------------------------------------------------
//------------------------------------death reset
var start = function () {
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);
};


var createParticles = function(type, x, y) {   
    for (var i = 0 - $scope.brushSize; i < 0; i++) {
        for (var n = 0 - $scope.brushSize; n < 0; n++) { 
            if(!pixArray[x + i][y + n] && (/* i % 3 == 0 || n % 3 == 0 */ Math.random() > 0.333 || type === TypeEnum.Wall)) {
                var temp;
                
                if(type === TypeEnum.Sand) {
                    temp = new Sand(x + i, y + n);
                }
                else if(type === TypeEnum.Wall) {
                    temp = new Wall(x + i, y + n);
                }
                else if(type === TypeEnum.Water) {
                    temp = new Water(x + i, y + n);
                }
                else if (type === TypeEnum.Acid) {
                    temp = new Acid(x + i, y + n);
                }
                else if (type === TypeEnum.Wax) {
                    temp = new Wax(x + i, y + n);
                }
                else if (type === TypeEnum.Fire) {
                    temp = new Fire(x + i, y + n);
                }
                else if (type === TypeEnum.Plant) {
                    temp = new Plant(x + i, y + n);
                }
                else {
                    temp = new Wall(x + i, y + n);      
                }
                    
                particleList.push(temp);
                pixArray[x + i][y + n] = temp;
            }
        }
    }
};

//------------------------------------------------------------------------------------------------------------
//  Update Logic
//------------------------------------------------------------------------------------------------------------
var update = function ()  { 
    //is it undefined? if not, it means it is down
    if(mouseXY[0] && mouseXY[0] - $scope.brushSize > 0 && mouseXY[0] <= canvas.width && mouseXY[1] - $scope.brushSize  > 0 && mouseXY[1] <= canvas.height) {
        createParticles(parseInt($('#fsg-type-select').val(), 10), mouseXY[0], mouseXY[1]);
    }
    
    for (var i = 0; i < particleList.length; i++) {
        var temp = particleList[i];
        var tempX = temp.x;
        var tempY = temp.y;
        var tempType = temp.type;
        // + ', ' + particleList[i].x + ', ' + particleList[i].y);
        //remove particles from particle list if they cross boundary
        if(tempX > canvas.width + 1 || tempX < 0 || tempY > canvas.height + 1 || tempY < 0) {
            particleList.splice(i, 1);
        }
        else        
            if(tempType !== 'Wall' && (tempType !== 'Wax' && !temp.onFire && temp.YVel !== 0)) {
                temp.update();
            }
        
        //console.log(particleList[i].type + ', ' + particleList[i].x + ', ' + particleList[i].y);
    }
    Timer++;
};


//------------------------------------brush size function
// var changeBrushSize = function()
// {
//  if (38 in keysDown)
//  {
//      $scope.brushSize++;
//  }
//  if ($scope.brushSize != 0 && 40 in keysDown)
//  {
//      $scope.brushSize--;
//  }
// }

$scope.incBrushSize = function() {
    $scope.brushSize++;
    $('#fsg-brush-size').text($scope.brushSize);
};

$scope.decBrushSize = function() {
    $scope.brushSize--;
    $('#fsg-brush-size').text($scope.brushSize);
};

    
//------------------------------------------------------------------------------------------------------------
//  Render Logic
//------------------------------------------------------------------------------------------------------------
var render = function ()  {
    // var testing = new Array();
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particleList.length; i++) {
        context.fillStyle = '#' + particleList[i].color;
        context.fillRect(particleList[i].x, particleList[i].y, 1, 1);
        
        // testing.push(particleList[i].type + ':' + particleList[i].x + ', ' + particleList[i].y + '\n');
    }   
    // context.fillStyle = '#FF0000';
    // context.font = '10px Helvetica';
    // context.textBaseline = 'top';
    // for(var i = 0; i < testing.length; i++)
        // context.fillText(testing[i] + ' :: ' + particleList[i].checkParticle(particleList[i].x, particleList[i].y), 0, i * 10);
    // context.fillText('T: ' + TypeEnum.KeyLookup[currentTool] + ' | S: ' + $scope.brushSize + ' | #: ' + particleList.length, 0, 0);
    //$scope.updateNumParticles(particleList.length);
    //console.log($scope.numParticles);
    if(prevNumParticles !== particleList.length) {
        $('#num-particles').text(particleList.length + ' particles');
    }
    prevNumParticles = particleList.length;

};
    
//------------------------------------------------------------------------------------------------------------
//  Main method
//------------------------------------------------------------------------------------------------------------
var main = function () {
    var now = Date.now();
    update();
    render();
    
    then = now;
};
    
//------------------------------------------------------------------------------------------------------------
//  Starts the game and sets the game loop
//------------------------------------------------------------------------------------------------------------
// $('#fsg-inc-brush')[0].addEventListener('click', incBrushSize);
// $('#fsg-dec-brush')[0].addEventListener('click', decBrushSize);
// $('#fsg-brush-size').text($scope.brushSize);

start();
var then = Date.now();
setInterval(main, 25);
    



  });
