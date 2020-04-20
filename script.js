$(document).ready(function(){

  var orange = '#ef9570';
  var blue = '#0000ff';
  var red = '#ff0000';
  var black = '#000000';
  var mapToggleClicked = [1, 0, 0, 1, 1];
  var dataToggle = [0, 0, 0, 0, 0, 0];
  let allData = [];


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

  function sumArrays(array1, array2) {
    var arrayTotal = []; 
    for (var i = 0; i < array1.length; i++) {  
      arrayTotal.push(array1[i] + array2[i]);
    }
    return arrayTotal;
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
      allData = [caseNumIncarcerated, deathNumIncarcerated, caseNumCorrectional, deathNumCorrectional, caseNumHealth, deathNumHealth];

      // set default map view (incarcerated cases + deaths)
      var arrayTotalDefault = sumArrays(caseNumIncarcerated, deathNumIncarcerated);
      var arrayTotalDefaultMax = Math.max.apply(Math, arrayTotalDefault);
      for (var i = 0; i < 51; i++) {
        $('#'+stateIdList[i]).css("fill",orange);
        $('#'+stateIdList[i]).css("fill-opacity",arrayTotalDefault[i]/arrayTotalDefaultMax+0.1);
      }

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
      });

  // CHANGING THE MAP COLOR - IMPORTANT!
  $('#carceratedTog, #correctionalTog, #healthTog, #caseTog, #deathTog').click(function(){
    dataToggle = [0, 0, 0, 0, 0, 0];
    if (mapToggleClicked[3] == 1) {
      if (mapToggleClicked[4] == 1) { // cases AND deaths
        for (var i = 0; i < 3; i++) {
          if (mapToggleClicked[i] == 1) {
            dataToggle[2*i] = 1;
            dataToggle[2*i + 1] = 1;
          }
          else {
            dataToggle[2*i] = 0;
            dataToggle[2*i + 1] = 0;
          }
        }
      }
      else { // cases ONLY
        for (var i = 0; i < 3; i++) {
          if (mapToggleClicked[i] == 1) {
            dataToggle[2*i] = 1;
          }
          else {
            dataToggle[2*i] = 0;
          }
        }
      }
    }
    else { // deaths ONLY
      for (var i = 0; i < 3; i++) {
        if (mapToggleClicked[i] == 1) {
          dataToggle[2*i+1] = 1;
        }
        else {
          dataToggle[2*i+1] = 0;
        }
      }
    }

    let indexArray = [];
    let arrayTotal = [];

    for (var i = 0; i < dataToggle.length; i++){
      if (dataToggle[i] == 1) {
        indexArray.push(i);
      }
    }

    // function sumArrays(array1, array2) {
    //   var arrayTotal = []; 
    //   for (var i = 0; i < array1.length; i++) {  
    //     arrayTotal.push(array1[i] + array2[i]);
    //   }
    //   return arrayTotal;
    // }

    if (indexArray.length > 1) {
      arrayTotal = sumArrays(allData[indexArray[0]], allData[indexArray[1]]);
      if (indexArray.length > 2) {
        for (var i = 2; i < indexArray.length; i++) {
          arrayTotal = sumArrays(arrayTotal, allData[indexArray[i]]);
        }
      }
    }
    else {
      arrayTotal = allData[indexArray[0]];
    }

    let arrayTotalMax = Math.max.apply(Math, arrayTotal);

  // PERFORMING COLOR CALCULATIONS
    for (var i = 0; i < 51; i++) {
      $('#'+stateIdList[i]).css("fill",orange);
      $('#'+stateIdList[i]).css("fill-opacity",arrayTotal[i]/arrayTotalMax+0.1);
    }
  });


  

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