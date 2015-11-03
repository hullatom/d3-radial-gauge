function Gauge()
{
  
  
  
/***configuration + default values*************************************/    
  

  var label = "Gauge";
  var units = "[%]";
      
  var size = 150;
  var radius =  size * 0.97 / 2;
  var cx =  size / 2;
  var cy =  size / 2;
      
  var min = 0;
  var max =  100;
  var range =  max -  min;

  var greenColor 	= "#109618";
  var yellowColor = "#FF9900";
  var redColor 	= "#DC3912";

  var angle = 270;
  var angleRad = angle*Math.PI/180;
  var rotate = ((360-angle)/2)-180;
  var rangeAngle = 270;
  var rotateRange = ((360-rangeAngle)/2)-180;
      
  var yellowZones = [{ "from": min + range*0.75, "to": min + range*0.9 }];
  var redZones = [{ "from": min + range*0.9, "to": max }];
  var greenZones = [{ "from": 25, "to": 50 }];
      
  var updateScales = function (){
        scales = d3.scale.linear().domain([min, max]).range([0.01*(2*Math.PI)*(rangeAngle/360),0.99*(2*Math.PI)*(rangeAngle/360)]);
        return scales;
      };
      
  var scales = updateScales();
     
     
       
/**********************************************************************/  
  function my(selection) {
    // generate chart here; `d` is the data and `this` is the element
    //d3.select(this).text("hello");
    
    
/***helper functions***************************************************/        
    
    drawBand = function(body,start, end, color)
    {
      if (0 >= end - start) return;
      body.append("svg:path")
            .style("fill", color)
            .attr("d", d3.svg.arc()
              .startAngle(scales(start))
              .endAngle(scales(end))
              .innerRadius(0.65 * radius)
              .outerRadius(0.85 * radius))
            .attr("transform", function() { return "translate(" + cx + ", " + cy + ") rotate("+rotateRange+")" });
    }
    
    /* Convert angle and distance from center to x,y coordinates 
     * 
     * angle in radians relative to axis
     * distance in px from center
     * */
    convertPolarAxis = function(angle, distace)
    {
      
      var rotateRads = (rotateRange*2)*Math.PI/360;
      
      return {"x": cx + distace * Math.sin(angle+rotateRads),
            "y": cy - distace * Math.cos(angle+rotateRads)};
    }
    /* Convert angle and distance from center to x,y coordinates 
     * 
     * angle in radians relative to outer circle
     * distance in px from center
     * */
    convertPolar = function(angle, distace)
    {
      var rotateRads = (rotate)*Math.PI/180;
      
      return {"x": cx + distace * Math.sin(angle+rotateRads),
            "y": cy - distace * Math.cos(angle+rotateRads)};
    }
    
    
/***draw outer circle**************************************************/
    
    var innerRadius1 = 0.88*radius,
        innerRadius2 = 0.91*radius,
        radianHalfAngle = ((360-angle)/360)*Math.PI
    
    
    selection.each(function(d, i) {
      // generate chart here; `d` is the data and `this` is the element
      //d3.select(this).text("hello");
            
      body = d3.select(this)
                  .append("svg:svg")
                  .attr("class", "gauge")
                  .attr("width", size);
      
      if(angle<180) body.attr("height", size/2);
      else body.attr("height", size/2 + radius*Math.cos(radianHalfAngle)+(radius-innerRadius1));

      
/*****Outer Circle*****************************************************/          
      body.append("svg:path")
          .style("fill", "#ccc")
          .attr("d", d3.svg.arc()
                    .startAngle(0)
                    .endAngle((Math.PI*2)*(angle/360))
                    .innerRadius(innerRadius2)
                    .outerRadius(radius))
          .attr("transform", function() { return "translate(" + cx + ", " + cy + ") rotate("+rotate+")" });
      
      body.append("svg:path")
					.style("stroke", "#000")
					.style("stroke-width", "0.5px")
          .attr("d", d3.svg.arc()
                    .startAngle(0)
                    .endAngle((Math.PI*2)*(angle/360))
                    .innerRadius(radius)
                    .outerRadius(radius))
          .attr("transform", function() { return "translate(" + cx + ", " + cy + ") rotate("+rotate+")" });
         
      body.append("svg:path")
					.style("fill", "#e0e0e0")
          .attr("d", d3.svg.arc()
                    .startAngle(0)
                    .endAngle((Math.PI*2)*(angle/360))
                    .innerRadius(innerRadius1)
                    .outerRadius(innerRadius2))
          .attr("transform", function() { return "translate(" + cx + ", " + cy + ") rotate("+rotate+")" });

      
/*****Draw color zones*************************************************/    
  
      for (var index in greenZones)
      {
        drawBand(body,greenZones[index].from, greenZones[index].to, greenColor);
      }
      
      for (var index in yellowZones)
      {
        drawBand(body,yellowZones[index].from, yellowZones[index].to, yellowColor);
      }
      
      for (var index in redZones)
      {
        drawBand(body,redZones[index].from, redZones[index].to, redColor);
      }   
      
      
         
/*****Label + units****************************************************/      
      var fontSize = Math.round(size / 10);
      
      ty1 = cy / 2 + fontSize*0.4;
      ty2 = cy / 2 + fontSize*1.2;
      
      if(angle>249){
        ty1 = cy / 2 + fontSize*1.1;
        ty2 = cy / 2 + fontSize*3.7;
      }
      
      body.append("svg:text")
						.attr("x", cx)
						.attr("y", ty1)
						.attr("dy", fontSize / 2)
						.attr("text-anchor", "middle")
						.text(label)
						.style("font-size", fontSize*0.9 + "px")
						.style("fill", "#333");
      
      
      body.append("svg:text")
						.attr("x", cx)
						.attr("y", ty2)
						.attr("dy", (fontSize-1) / 2)
						.attr("text-anchor", "middle")
						.text(units)
						.style("font-size", fontSize*0.7 + "px")
						.style("fill", "#333");



/*****Axis*************************************************************/      

      majorTick = scales.ticks(4);
      minorTick = scales.ticks(majorTick.length*5);
      
      body.selectAll(".minorTick")
          .data(minorTick).enter().append("svg:line")
          .attr("x1",function(d) {return convertPolarAxis(scales(d),innerRadius1*0.92).x;}) 
          .attr("y1",function(d) {return convertPolarAxis(scales(d),innerRadius1*0.92).y;}) 
          .attr("x2",function(d) {return convertPolarAxis(scales(d),innerRadius1*0.98).x;}) 
          .attr("y2",function(d) {return convertPolarAxis(scales(d),innerRadius1*0.98).y;}) 
          .attr("class", "minorTick")
          .attr("stroke", "black")
          .attr("stroke-width", 1);
      
      body.selectAll(".majorTick")
          .data(majorTick).enter().append("svg:line")
          .attr("x1",function(d) {return convertPolarAxis(scales(d),innerRadius1*0.88).x;}) 
          .attr("y1",function(d) {return convertPolarAxis(scales(d),innerRadius1*0.88).y;}) 
          .attr("x2",function(d) {return convertPolarAxis(scales(d),innerRadius1*0.98).x;}) 
          .attr("y2",function(d) {return convertPolarAxis(scales(d),innerRadius1*0.98).y;}) 
          .attr("class", "majorTick")
          .attr("stroke", "black")
          .attr("stroke-width", 2);

     
      var axLabelradius = innerRadius1*0.60;
      
      var axLabel = body.append("g")
          .attr("class", "axLabel")
          .selectAll("g")
          .data(majorTick)
          .enter().append("g")
          .attr("transform", function(d) { return "translate(" + cx + "," + cy + ") rotate(" + (-90+rotateRange+(scales(d)*(180/Math.PI))) + ")"; });

      axLabel.append("g").append("text")
          .attr("x", axLabelradius)
          .style("fill", "#4a4a4a")
          .style("text-anchor","middle")
          .style("font-size",fontSize*0.6)
          .attr("transform", function(d) { return "rotate("+(-(-90+rotateRange+(scales(d)*(180/Math.PI))))+" "+axLabelradius +",0)"; })
          .text(function(d) { return d; });
    
      
      
      
/***THE POINTER********************************************************/
    buildPointerPath = function(value)
      {
        var delta = range / 13;
        
        var head = convertPolarAxis(scales(value), 0.85*radius);
        var head1 = convertPolarAxis(scales(value - delta), 0.12*radius);
        var head2 = convertPolarAxis(scales(value + delta), 0.12*radius);
        
        var tailValue = scales(value) - Math.PI;
        var tail = convertPolarAxis((tailValue), 0.28*radius);
        var tail1 = convertPolarAxis(tailValue - scales(delta), 0.12*radius);
        var tail2 = convertPolarAxis(tailValue + scales(delta), 0.12*radius);
        
        return [head, head1, tail2, tail, tail1, head2, head];
        
      }
      
      var pointerContainer = body.append("svg:g").attr("class", "pointerContainer");
		
      //var midValue = (min + max) / 2;
      
      var pointerPath = buildPointerPath(d);
      
      var pointerLine = d3.svg.line()
                    .x(function(d) { return d.x })
                    .y(function(d) { return d.y })
                    .interpolate("basis");
      
      pointerContainer.selectAll("path")
                .data([pointerPath])
                .enter()
                  .append("svg:path")
                    .attr("d", pointerLine)
                    .style("fill", "#dc3912")
                    .style("stroke", "#c63310")
                    .style("fill-opacity", 0.7)

    var fontSize = Math.round(size / 10);
		
    if(angle > 249)
    body.append("svg:text")
									.attr("class","value")
                  .attr("x", cx)
									.attr("y", cy + 2.2*fontSize)
									.attr("dy", fontSize / 2)
									.attr("text-anchor", "middle")
									.style("font-size", fontSize + "px")
									.style("fill", "#000")
									.style("stroke-width", "0px")
                  .text(d);

/*****The Center*******************************************************/  
    
      body.append("svg:path")
					.style("stroke", "#666")
          .style("fill", "#4684EE")
          .style("opacity", 1)
          .attr("d", d3.svg.arc()
                    .startAngle(0)
                    .endAngle(angle == 180 ? (Math.PI):(Math.PI*2))
                    .innerRadius(0)
                    .outerRadius(0.12 * radius))
          .attr("transform", function() { return "translate(" + cx + ", " + cy + ") rotate(-90)" });
      
/*****GAME with the BOTTOM*********************************************/                
      
      //TO-DO angle<180
      if(angle>180){

        body.append("svg:rect")
            .attr("y", convertPolar(0,innerRadius2).y-(innerRadius2-innerRadius1))
            .attr("x", convertPolar(0,innerRadius2).x)
            .attr("width", convertPolar(angleRad,innerRadius2).x-convertPolar(0,innerRadius2).x)
            .attr("height", (innerRadius2-innerRadius1))
            .style("fill", "#e0e0e0");

        body.append("svg:rect")
            .attr("y", convertPolar(0,radius).y-(radius-innerRadius2)*Math.cos(radianHalfAngle))
            .attr("x", convertPolar(0,radius).x)
            .attr("width", convertPolar(angleRad,radius).x-convertPolar(0,radius).x)
            .attr("height", (radius-innerRadius2)*Math.cos(radianHalfAngle))
            .style("fill", "#ccc");
            
        body.append("svg:line")
            .style("stroke-width", "0.5px")
            .style("stroke", "#000")
            .attr("y1", convertPolar(0,radius).y)
            .attr("x1", convertPolar(0,radius).x)
            .attr("y2", convertPolar(angleRad,radius).y)
            .attr("x2", convertPolar(angleRad,radius).x); 
      }
      if(angle==180){
        
        body.append("svg:rect")
            .attr("y", cy-0.2)
            .attr("x", 0.03*size/2)
            .attr("width", 2*(radius))
            .attr("height", (radius-innerRadius2))
            .style("fill", "#ccc");
        
       body.append("svg:rect")
            .attr("y", cy-0.2)
            .attr("x", 0.03*size/2+(radius-innerRadius2))
            .attr("width", 2*(radius-(radius-innerRadius2)))
            .attr("height", (innerRadius2-innerRadius1))
            .style("fill", "#e0e0e0");
          
        body.append("svg:line")
            .style("stroke-width", "0.5px")
            .style("stroke", "#000")
            .attr("y1", cy+radius*Math.cos(radianHalfAngle)+(radius-innerRadius2)-0.2)
            .attr("x1", cx-radius*Math.sin(radianHalfAngle))
            .attr("y2", cy+radius*Math.cos(radianHalfAngle)+(radius-innerRadius2)-0.2)
            .attr("x2", cx-radius*Math.sin(radianHalfAngle)+2*(radius)*Math.sin(radianHalfAngle));
        
        body.append("svg:line")
            .style("stroke-width", "0.5px")
            .style("stroke", "#000")
            .attr("y1", cy+radius*Math.cos(radianHalfAngle)-0.2)
            .attr("x1", cx-radius*Math.sin(radianHalfAngle))
            .attr("y2", cy+radius*Math.cos(radianHalfAngle)+(radius-innerRadius2)-0.2)
            .attr("x2", cx-radius*Math.sin(radianHalfAngle));
        
        body.append("svg:line")
            .style("stroke-width", "0.5px")
            .style("stroke", "#000")
            .attr("y1", cy+radius*Math.cos(radianHalfAngle)-0.2)
            .attr("x1", cx-radius*Math.sin(radianHalfAngle)+2*(radius)*Math.sin(radianHalfAngle))
            .attr("y2", cy+radius*Math.cos(radianHalfAngle)+(radius-innerRadius2)-0.2)
            .attr("x2", cx-radius*Math.sin(radianHalfAngle)+2*(radius)*Math.sin(radianHalfAngle));
      }
      
    });
  }
/**********************************************************************/

  
  
/***accessors**********************************************************/    
  my.size = function(value) {
    if (!arguments.length) return size;
    size = value;
    radius =  size * 0.97 / 2;
    return my;
  };

  my.min = function(value) {
    if (!arguments.length) return min;
    min = value;
    updateScales();
    return my;
  };

  my.max =  function(value) {
    if (!arguments.length) return max;
    max = value;
    updateScales();
    return my;
  };
  
  my.angle =  function(value) {
    if (!arguments.length) return angle;
    if (value > 360 ) value = 360;
    if (value < rangeAngle) my.rangeAngle(value);
    angle = value;
    angleRad = angle*Math.PI/180;
    rotate = ((360-angle)/2)-180;
    return my;
  };

  my.rangeAngle =  function(value) {
    if (!arguments.length) return rangeAngle;
    if (value > 360 ) value = 360;
    if (value > angle) my.angle(value);
    rangeAngle = value;
    rotateRange = ((360-rangeAngle)/2)-180;
    updateScales();
    return my;
  };

  my.greenColor 	= function(value) {
    if (!arguments.length) return greenColor;
    greenColor = value;
    return my;
  };

  my.yellowColor = function(value) {
    if (!arguments.length) return yellowColor;
    yellowColor = value;
    return my;
  };

  my.redColor 	= function(value) {
    if (!arguments.length) return redColor;
    redColor = value;
    return my;
  };

  my.transitionDuration = function(value) {
    if (!arguments.length) return transitionDuration;
    transitionDuration = value;
    return my;
  };
  
  my.label = function(value) {
    if (!arguments.length) return label;
    label = value;
    return my;
  };
  
  my.units = function(value) {
    if (!arguments.length) return units;
    units = value;
    return my;
  };
  
  my.yellowZones = function(value) {
    if (!arguments.length) return yellowZones;
    for (var index in value) if (value[index].from < min ) value[index].from = min;
    for (var index in value) if (value[index].to > max ) value[index].to = max;
    yellowZones = value;
    return my;
  };
  
  my.redZones = function(value) {
    if (!arguments.length) return redZones;
    for (var index in value) if (value[index].from < min ) value[index].from = min;
    for (var index in value) if (value[index].to > max ) value[index].to = max;
    redZones = value;
    return my;
  };
  
  my.greenZones = function(value) {
    if (!arguments.length) return greenZones;
    for (var index in value) if (value[index].from < min ) value[index].from = min;
    for (var index in value) if (value[index].to > max ) value[index].to = max;
    greenZones = value;
    return my;
  };  
  
  return my;
}
