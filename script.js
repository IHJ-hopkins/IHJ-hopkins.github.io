$(document).ready(function(){

  var orange = '#ef9570';
  var blue = '#0000ff';
  var red = '#ff0000';
  var black = '#000000';
  var mapToggleClicked = [1, 0, 0, 1, 1];

  function getObjects(obj, key, val) {
          var objects = [];
          for (var i in obj) {
              if (!obj.hasOwnProperty(i)) continue;
              if (typeof obj[i] == 'object') {
                  objects = objects.concat(getObjects(obj[i], key, val));
              } else if (i == key && obj[key] == val) {
                  objects.push(obj);
              }
          }
          return objects;
      }

  // JSON REFRESH TIMER
  var previous = null;
    var current = null;
    setInterval(function() {
        $.getJSON("states.json", function(json) {
            current = JSON.stringify(json);            
            if (previous && current && previous !== current) {
                console.log('refresh');
                location.reload();
            }
            previous = current;
        });                       
    }, 2000);   

  // RESPONSIVENESS

  let windowHeight = $(window).height();
  let navHeight = 33;
  let bodyHeight = windowHeight - navHeight;
  
  $('.body-container').height(bodyHeight);
  $('.body-nongrid').height(bodyHeight);

  $(window).resize(function() {
    windowHeight = $(window).height();
    bodyHeight = windowHeight - 33;
    $('.body-container').height(bodyHeight);
    $('.body-nongrid').height(bodyHeight);
  });

  // MAP
  $("path, circle").hover(function(e) {
    $('#info-box').css('display','block');
    $('#info-box').html($(this).data('info'));
  });

  $("path, circle").mouseleave(function(e) {
    $('#info-box').css('display','none');
  });

  $(document).mousemove(function(e) {
    $('#info-box').css('top',e.pageY-$('#info-box').height()-30);
    $('#info-box').css('left',e.pageX-($('#info-box').width())/2);
  }).mouseover();

  var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if(ios) {
    $('a').on('click touchend', function() {
      var link = $(this).attr('href');
      window.open(link,'_blank');
      return false;
    });
  }

  // COVID TRACKER

  let inmateDeath = 1;
  let inmateCase = 92; 
  let staffDeath = 1;
  let staffCase = 336;

  $('#covidInmates').click(function(){
    $('#covidDeath').text(inmateDeath + ' deaths');
    $('#covidCase').text(inmateCase + ' cases');
    $('#covidInmates').css('color',orange);
    $('#covidStaff').css('color','#093350');
    $('#covidBoth').css('color','#093350');
  });

  $('#covidStaff').click(function(){
    $('#covidDeath').text(staffDeath + ' deaths');
    $('#covidCase').text(staffCase + ' cases');
    $('#covidStaff').css('color',orange);
    $('#covidInmates').css('color','#093350');
    $('#covidBoth').css('color','#093350');
  });

  $('#covidBoth').click(function(){
    $('#covidDeath').text(inmateDeath+staffDeath + ' deaths');
    $('#covidCase').text(inmateCase + staffCase + ' cases');
    $('#covidBoth').css('color',orange);
    $('#covidStaff').css('color','#093350');
    $('#covidInmates').css('color','#093350');
  });

  $('#covidDeath').text(inmateDeath+staffDeath + ' deaths');
  $('#covidCase').text(inmateCase+staffCase + ' cases');

  // PICK A STATE
  // $("input").keyup(function() {
  //     var value = $( this ).val();
  //     console.log(value);
  //   })
  // .keyup();

  // function displayVals() {
  //   var selectedState = $( "#selectState" ).val();
  //   console.log(selectedState);
  //   }
   
  // $("select").change(displayVals);
  // displayVals();

  // MAP ON CLICK

  $('path.map-state').on('click', function(e){
    e.preventDefault();
    let stateID = this.id;
      
    $.getJSON("states.json", function(data) {
      let stateList = data;
      let stateInfo = getObjects(stateList, 'ID', stateID);

      $('#stateName').text(stateInfo[0].name);
      $('#advocacyInfo').text(stateInfo[0].orgs)

    });
  });

  // STATS MAP
  $.getJSON("states.json", function(data) {
      let stateList = data;
      let caseNumIncarcerated = [];
      let caseNumCorrectional= [];
      let caseNumHealth= [];
      let deathNumIncarcerated = [];
      let deathNumCorrectional= [];
      let deathNumHealth= [];
      let stateIdList = [];
      for (var i = 0; i < 51; i++) {
        caseNumIncarcerated[i] = stateList.states[i].cases_incarcerated;
        caseNumCorrectional[i] = stateList.states[i].cases_correctional_staff;
        caseNumHealth[i] = stateList.states[i].cases_health_staff;
        deathNumIncarcerated[i] = stateList.states[i].deaths_incarcerated;
        deathNumCorrectional[i] = stateList.states[i].deaths_correctional_staff;
        deathNumHealth[i] = stateList.states[i].deaths_health_staff;
        stateIdList[i] = stateList.states[i].ID;  
      }
      console.log(deathNumCorrectional);

      let maxCaseIncarcerated = Math.max.apply(Math, caseNumIncarcerated);
      let maxCaseCorrectional = Math.max.apply(Math, caseNumCorrectional);
      let maxCaseHealth = Math.max.apply(Math, caseNumHealth);
      let maxDeathIncarcerated = Math.max.apply(Math, deathNumIncarcerated);
      let maxDeathCorrectional = Math.max.apply(Math, deathNumCorrectional);
      let maxDeathHealth = Math.max.apply(Math, deathNumHealth);
      let arrayMaxDeath = [maxCaseIncarcerated, maxCaseCorrectional, maxCaseHealth, maxDeathIncarcerated, maxDeathCorrectional, maxDeathHealth];
      console.log(arrayMaxDeath);

// MAP TOGGLES
    
    // TOGGLE SELECTOR
      $('#carceratedTog').click(function(){
        if (mapToggleClicked[0] == 1) {
          mapToggleClicked[0] = 0;
          $('#carceratedTog').css("color",black);
        }
        else {
          mapToggleClicked[0] = 1;
          $('#carceratedTog').css("color",orange);
        }
        console.log(mapToggleClicked);
      });

      $('#correctionalTog').click(function(){
        if (mapToggleClicked[1] == 1) {
          mapToggleClicked[1] = 0;
          $('#correctionalTog').css("color",black);
        }
        else {
          mapToggleClicked[1] = 1;
          $('#correctionalTog').css("color",orange);
        }
        console.log(mapToggleClicked);
      });

      $('#healthTog').click(function(){
        if (mapToggleClicked[2] == 1) {
          mapToggleClicked[2] = 0;
          $('#healthTog').css("color",black);
        }
        else {
          mapToggleClicked[2] = 1;
          $('#healthTog').css("color",orange);
        }
        console.log(mapToggleClicked);
      });
      $('#caseTog').click(function(){
        if (mapToggleClicked[3] == 1) {
          if (mapToggleClicked[4] == 1) {
            mapToggleClicked[3] = 0;
            $('#caseTog').css("color",black);
          }
        }
        else {
          mapToggleClicked[3] = 1;
          $('#caseTog').css("color",orange);
        }
        console.log(mapToggleClicked);
      });

      $('#deathTog').click(function(){
        if (mapToggleClicked[4] == 1) {
          if (mapToggleClicked[3] == 1) {
            mapToggleClicked[4] = 0;
            $('#deathTog').css("color",black);
          }
        }
        else {
          mapToggleClicked[4] = 1;
          $('#deathTog').css("color",orange);
        }
        console.log(mapToggleClicked);
      });

  // CHANGING THE MAP COLOR - IMPORTANT!
  // $('#carceratedTog, #correctionalTog, #healthTog, #caseTog, #deathTog').click(function(){
  //   if (mapToggleClicked[3] == 1 && mapToggleClicked[4] == 0) { // CASES ONLY
      
  //   }
  //   elseif (mapToggleClicked[3] == 1 && mapToggleClicked[4] == 1) { // BOTH CASES & DEATHS

  //   }
  //   elseif (mapToggleClicked[3] == 0 && mapToggleClicked[4] == 1) { // DEATHS ONLY

  //   }
  // });


      for (var i = 0; i < 51; i++) {
          $('#'+stateIdList[i]).css("fill",orange);
          $('#'+stateIdList[i]).css("fill-opacity",caseNumIncarcerated[i]/maxCaseIncarcerated+0.1);
        }
        $('#covidInmatesMap').css("color",orange);

// TEXT THAT DISPLAYS BELOW MAP
      $('path.map-state').on('click', function(e){
        e.preventDefault();
        let stateID = this.id;
        let stateInfo = getObjects(stateList, 'ID', stateID);

        $('#stateCases').text(stateInfo[0].cases);
      });
    });

  // TOOLTIP
   $(".hover-target").hover(function(e) {
    $('.hover-content').css('display','block');
  });

  $(".hover-target").mouseleave(function(e) {
    $('.hover-content').css('display','none');
  });

  $(document).mousemove(function(e) {
    $('.hover-content').css('top',e.pageY-$('.hover-content').height()-30);
    $('.hover-content').css('left',e.pageX-($('.hover-content').width())/2);
  }).mouseover();

  // NO TYPING BELOW HERE
});