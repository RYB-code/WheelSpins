(function(root) {
  'use strict';

  function _merge(obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
  }

  var PrizeWheel = function(options) {
    var _this = this,
        defaults,
        s,
        ctx,
        canvas;

    defaults = {
      el: '#wheel',
      members: ['Prize 1', 'Prize 2', 'Prize 3', 'Prize 4', 'Prize 5'],
      colors: ['#FF007F', '#FF6600', '#FFCC00', '#00FF00', '#00BFFF'],
      radius: 310,
      textRadius: 200 // Added to fix text positioning
    };

    // Merge defaults with user options
    s = _merge(defaults, options);

    // Calculate dimensions
    s.width = s.height = s.radius * 2;
    s.insideRadius = s.width / 5;
    s.outsideRadius = s.width / 3 - 10;
    s.arc = (2 * Math.PI) / s.members.length; // Correct arc calculation

    // Initialize canvas
    this.draw = function() {
      canvas = document.querySelector(s.el);
      if (!canvas) {
        console.error("Canvas element not found");
        return;
      }
      canvas.width = s.width;
      canvas.height = s.height;
      ctx = canvas.getContext('2d');

      // Draw the wheel
      ctx.clearRect(0, 0, s.width, s.height);
      for (var i = 0; i < s.members.length; i++) {
        var angle = s.startAngle + i * s.arc;
        ctx.fillStyle = s.colors[i];
        ctx.beginPath();
        ctx.arc(s.width / 2, s.height / 2, s.outsideRadius, angle, angle + s.arc, false);
        ctx.arc(s.width / 2, s.height / 2, s.insideRadius, angle + s.arc, angle, true);
        ctx.stroke();
        ctx.fill();

        // Draw text
        ctx.save();
        ctx.fillStyle = "black";
        ctx.translate(s.width / 2 + Math.cos(angle + s.arc / 2) * s.textRadius, s.height / 2 + Math.sin(angle + s.arc / 2) * s.textRadius);
        ctx.rotate(angle + s.arc / 2 + Math.PI / 2);
        ctx.fillText(s.members[i], -ctx.measureText(s.members[i]).width / 2, 0);
        ctx.restore();
      }
    };

    // Spin the wheel
    this.spin = function(callback) {
      var spinDuration = 3000; // 3 seconds
      var startTime = Date.now();
      var startAngle = 0;
      var endAngle = startAngle + 360 * 5 + Math.random() * 360; // Random end angle

      function animate() {
        var currentTime = Date.now();
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / spinDuration, 1);
        var angle = startAngle + (endAngle - startAngle) * progress;
        s.startAngle = angle * Math.PI / 180;
        _this.draw();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          var selectedIndex = Math.floor((360 - (angle % 360)) / (360 / s.members.length));
          callback(s.members[selectedIndex]);
        }
      }

      animate();
    };

    return {
      init: this.draw,
      spin: this.spin
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
