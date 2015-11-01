function Gauge()
{
  
  
  
/***configuration + default values*************************************/    
  

  var label = "Gauge",
      units = "[%]",
      
      size = 150,
      radius =  size * 0.97 / 2;
      cx =  size / 2,
      cy =  size / 2,
      
      min = 0,
      max =  100,
      range =  max -  min,
      /*
      majorTicks = 5,
      minorTicks = 2,
      */
      greenColor 	= "#109618",
      yellowColor = "#FF9900",
      redColor 	= "#DC3912",
      
      transitionDuration = 0,
      
      angle = 270,
      rotate = ((360-angle)/2)-180,
      rangeAngle = 270,
      rotateRange =((360-rangeAngle)/2)-180,
      
      yellowZones = [{ "from": min + range*0.75, "to": min + range*0.9 }],
			redZones = [{ "from": min + range*0.9, "to": max }],
			greenZones = [{ "from": min, "to": min + range*0.75 }],
      
      updateScales = function (){
        scales = d3.scale.linear().domain([min, max]).range([0.01*(2*Math.PI)*(rangeAngle/360),0.99*(2*Math.PI)*(rangeAngle/360)]);
        return scales;
      }
      
      scales = updateScales();
     
     
       
/**********************************************************************/  
  function my(selection) {
    
    
    
/***helper functions***************************************************/        
    
    drawBand = function(body,start, end, color)
    {
      if (0 >= end - start) return;
      //valueToRadians(start)
      body.append("svg:path")
            .style("fill", color)
            .attr("d", d3.svg.arc()
              .startAngle(scales(start))
              .endAngle(scales(end))
              .innerRadius(0.65 * radius)
              .outerRadius(0.85 * radius))
            .attr("transform", function() { return "translate(" + cx + ", " + cy + ") rotate("+rotateRange+")" });
    }
    
    valueToPoint = function(value, factor)
    {
      return {"x": cx - radius * factor * Math.cos(scales(value)),
            "y": cy - radius * factor * Math.sin(scales(value))};
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

      
/*****The Circle********************************************************/          
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
      
      if(angle>250){
        ty1 = cy / 2 + fontSize*1.1;
        ty2 = cy / 2 + fontSize*3.33;
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
      
      majorTickArc = d3.svg.arc()
            .innerRadius(innerRadius1*0.88)
            .outerRadius(innerRadius1*0.98)
            .startAngle(function(d) {
                    return scales(d);
            }) 
            .endAngle(function(d) {
                    return scales(d);
            });
      minorTickArc = d3.svg.arc()
          .innerRadius(innerRadius1*0.92)
          .outerRadius(innerRadius1*0.98)
          .startAngle(function(d) {
                  return scales(d);
          }) 
          .endAngle(function(d) {
                  return scales(d);
          });
      
      body.append("svg:g").attr("transform", "translate(" + cx + "," + cy + ") rotate("+rotateRange+")")
          .selectAll(".minorTick")
          .data(minorTick).enter().append("svg:path")
          .attr("d",function(d) {return minorTickArc(d);})
          .attr("class", "majorTick")
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .attr("fill", "none");
      
      body.append("svg:g").attr("transform", "translate(" + cx + "," + cy + ") rotate("+rotateRange+")")
          .selectAll(".majorTick")
          .data(majorTick).enter().append("svg:path")
          .attr("d",function(d) {return majorTickArc(d);})
          .attr("class", "majorTick")
          .attr("stroke", "black")
          .attr("stroke-width", 2)
          .attr("fill", "none");
      
      
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
    
      
      
      
/**********************************************************************/
      buildPointerPath = function(value)
      {
        var delta = range / 13;
        
        var head = valueToPoint2(value, 0.85);
        var head1 = valueToPoint2(value - delta, 0.12);
        var head2 = valueToPoint2(value + delta, 0.12);
        
        var tailValue = value - (range * (1/(270/360)) / 2);
        var tail = valueToPoint2(tailValue, 0.28);
        var tail1 = valueToPoint2(tailValue - delta, 0.12);
        var tail2 = valueToPoint2(tailValue + delta, 0.12);
        
        return [head, head1, tail2, tail, tail1, head2, head];
        
        function valueToPoint2(value, factor)
        {
          var point = valueToPoint(value, factor);
          point.x -= cx;
          point.y -= cy;
          return point;
        }
      }
      
      var pointerContainer = body.append("svg:g").attr("class", "pointerContainer");
		
      var midValue = (min + max) / 2;
      
      var pointerPath = buildPointerPath(midValue);
      
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
            .attr("y", cy+(innerRadius2)*Math.cos(radianHalfAngle)-((innerRadius2-innerRadius1)*Math.cos(radianHalfAngle)))
            .attr("x", cx-(radius)*Math.sin(radianHalfAngle))
            .attr("width", 2*(radius)*Math.sin(radianHalfAngle))
            .attr("height", (innerRadius2-innerRadius1)*Math.cos(radianHalfAngle))
            .style("fill", "#e0e0e0");
            
        body.append("svg:rect")
            .attr("y", cy+radius*Math.cos(radianHalfAngle)-((radius-innerRadius2)*Math.cos(radianHalfAngle)))
            .attr("x", cx-radius*Math.sin(radianHalfAngle))
            .attr("width", 2*radius*Math.sin(radianHalfAngle))
            .attr("height", (radius-innerRadius2)*Math.cos(radianHalfAngle))
            .style("fill", "#ccc");
            
        body.append("svg:line")
            .style("stroke-width", "0.5px")
            .style("stroke", "#000")
            .attr("y1", cy+radius*Math.cos(radianHalfAngle))
            .attr("x1", cx-radius*Math.sin(radianHalfAngle))
            .attr("y2", cy+radius*Math.cos(radianHalfAngle))
            .attr("x2", cx-radius*Math.sin(radianHalfAngle)+2*(radius)*Math.sin(radianHalfAngle)); 
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
