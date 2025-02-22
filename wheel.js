(function(root) {
  'use strict';

  // Helper function to merge objects
  function _merge(obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
  }

  // PrizeWheel Class
  var PrizeWheel = function(options) {
    var _this = this,
        defaults,
        s,
        ctx,
        canvas;

    // Default settings
    defaults = {
      el: '#wheel', // Canvas element ID
      members: ['Prize 1', 'Prize 2', 'Prize 3', 'Prize 4', 'Prize 5'], // Prizes
      colors: ['#FF007F', '#FF6600', '#FFCC00', '#00FF00', '#00BFFF'], // Segment colors
      radius: 310, // Wheel radius
      textRadius: 200, // Distance from center to text
      insideRadius: 100 // Radius of the inner circle
    };

    // Merge defaults with user options
    s = _merge(defaults, options);

    // Calculate dimensions
    s.width = s.height = s.radius * 2; // Canvas width and height
    s.arc = (2 * Math.PI) / s.members.length; // Arc size for each segment

    // Draw the wheel
    this.draw = function() {
      canvas = document.querySelector(s.el);
      if (!canvas) {
        console.error("Canvas element not found");
        return;
      }
      canvas.width = s.width;
      canvas.height = s.height;
      ctx = canvas.getContext('2d');

      // Clear the canvas
      ctx.clearRect(0, 0, s.width, s.height);

      // Draw each segment
      for (var i = 0; i < s.members.length; i++) {
        var angle = s.startAngle + i * s.arc; // Angle for the current segment
        ctx.fillStyle = s.colors[i]; // Set segment color
        ctx.beginPath();
        ctx.arc(s.width / 2, s.height / 2, s.radius, angle, angle + s.arc, false); // Outer arc
        ctx.arc(s.width / 2, s.height / 2, s.insideRadius, angle + s.arc, angle, true); // Inner arc
        ctx.stroke();
        ctx.fill();

        // Draw text inside the segment
        ctx.save();
        ctx.fillStyle = "black";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.translate(s.width / 2 + Math.cos(angle + s.arc / 2) * s.textRadius, s.height / 2 + Math.sin(angle + s.arc / 2) * s.textRadius);
        ctx.rotate(angle + s.arc / 2 + Math.PI / 2);
        ctx.fillText(s.members[i], 0, 0);
        ctx.restore();
      }

      // Draw the red arrow
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.moveTo(s.width / 2 - 10, 10); // Arrow tip (left)
      ctx.lineTo(s.width / 2 + 10, 10); // Arrow tip (right)
      ctx.lineTo(s.width / 2, 30); // Arrow base
      ctx.closePath();
      ctx.fill();
    };

    // Spin the wheel
    this.spin = function(callback) {
      var spinDuration = 3000; // Spin duration (3 seconds)
      var startTime = Date.now(); // Start time
      var startAngle = 0; // Initial angle
      var endAngle = startAngle + 360 * 5 + Math.random() * 360; // Random end angle

      // Animation function
      function animate() {
        var currentTime = Date.now();
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / spinDuration, 1); // Progress (0 to 1)
        var angle = startAngle + (endAngle - startAngle) * progress; // Current angle
        s.startAngle = angle * Math.PI / 180; // Update wheel angle
        _this.draw(); // Redraw the wheel

        // Continue animation until progress is complete
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Calculate the selected prize
          var normalizedAngle = (360 - (angle % 360)) % 360; // Normalize angle to 0-360
          var prizeAngle = 360 / s.members.length; // Angle per prize
          var selectedIndex = Math.floor(normalizedAngle / prizeAngle); // Map angle to prize index
          callback(s.members[selectedIndex]); // Callback with the selected prize
        }
      }

      animate(); // Start the animation
    };

    // Public methods
    return {
      init: this.draw, // Initialize the wheel
      spin: this.spin // Spin the wheel
    };
  };

  // Export PrizeWheel
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = PrizeWheel;
    }
    exports.PrizeWheel = PrizeWheel;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return PrizeWheel;
    });
  } else {
    root.PrizeWheel = PrizeWheel;
  }
})(this);
