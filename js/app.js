$(function (){
  var countArr = [],
  costArr = [],
  capArr = [],
  countTotal = 0,
  costTotal = 0,
  capTotal = 0,
  stateName,
  clickCounter = 1,
  lsString = JSON.stringify(localStorage),
  lsObject = JSON.parse(lsString),
  lsArr = [],
  stateData = {},
  states = [
    ['Arizona', 'AZ'],
    ['Alabama', 'AL'],
    ['Alaska', 'AK'],
    ['Arizona', 'AZ'],
    ['Arkansas', 'AR'],
    ['California', 'CA'],
    ['Colorado', 'CO'],
    ['Connecticut', 'CT'],
    ['Delaware', 'DE'],
    ['Florida', 'FL'],
    ['Georgia', 'GA'],
    ['Hawaii', 'HI'],
    ['Idaho', 'ID'],
    ['Illinois', 'IL'],
    ['Indiana', 'IN'],
    ['Iowa', 'IA'],
    ['Kansas', 'KS'],
    ['Kentucky', 'KY'],
    ['Kentucky', 'KY'],
    ['Louisiana', 'LA'],
    ['Maine', 'ME'],
    ['Maryland', 'MD'],
    ['Massachusetts', 'MA'],
    ['Michigan', 'MI'],
    ['Minnesota', 'MN'],
    ['Mississippi', 'MS'],
    ['Missouri', 'MO'],
    ['Montana', 'MT'],
    ['Nebraska', 'NE'],
    ['Nevada', 'NV'],
    ['New Hampshire', 'NH'],
    ['New Jersey', 'NJ'],
    ['New Mexico', 'NM'],
    ['New York', 'NY'],
    ['North Carolina', 'NC'],
    ['North Dakota', 'ND'],
    ['Ohio', 'OH'],
    ['Oklahoma', 'OK'],
    ['Oregon', 'OR'],
    ['Pennsylvania', 'PA'],
    ['Rhode Island', 'RI'],
    ['South Carolina', 'SC'],
    ['South Dakota', 'SD'],
    ['Tennessee', 'TN'],
    ['Texas', 'TX'],
    ['Utah', 'UT'],
    ['Vermont', 'VT'],
    ['Virginia', 'VA'],
    ['Washington', 'WA'],
    ['West Virginia', 'WV'],
    ['Wisconsin', 'WI'],
    ['Wyoming', 'WY'],
  ];

  // hide dropdown menus and pop-up feature
  $('.pu').hide();
  $('.puClose').on('click', function(){
    $('.pu').hide();
    $('.puTitle').remove();
    $('.puList').remove();
  });
  $('#whyHidden').hide();
  // $('#natHidden').hide();
  $('#siteHidden').hide();

  // solar count, cost, capacity API
  $.getJSON('https://developer.nrel.gov/api/solar/open_pv/installs/rankings?api_key=baBQnhHJIUy28EX60XZ2mpnTHSQ4OkRuRE6Ki4yS&format=JSON').then(function(response){
    for ( var i = 0; i < response.result.length; i++ ) {
      stateData[response.result[i].name] = {count: response.result[i].count, cap: response.result[i].count, cost: response.result[i].cost}
    }
  }).then(function(){

    // Jquery map
    $('#map').usmap({
      'stateStyles': {fill: '#'},
      'stateHoverStyles': {fill: '#4b70b6'},
      'stateHoverAnimation': 150,
      'stroke': {fill: '#ffffff'},
      click: function(event, data) {

        // state abbreviation translator
        (function abbrState(abbr){
          for (var j = 0; j < states.length; j++) {
            if (states[j][1] == data.name) {
              stateName = (states[j][0])
            }
          };
        })()

        // persistence function
        if ( localStorage.getItem(stateName) !== 'null'){
          clickCount = +(localStorage.getItem(stateName)) + 1;
          localStorage.setItem(stateName, clickCount)
        } else localStorage.setItem(stateName, clickCounter);

        // pop-out function
        for (var key in stateData){
          if(data.name == key){
            (function pop (){
              $('.pu').show();
              $('.puTitleHolder').append("<div class='puTitle'><h3>" + stateName + "</h3></div>")
              $('.puListHolder').append("<ul class='puList'><li>" + stateData[key].count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " systems installed</li><li>Totalling " + stateData[key].cap.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " kW</li><li>Average Costs: $" + stateData[key].cost.toFixed(2) + " / watt</li></ul>")
            }())
          }
        }

        // available policies API
        $.ajax({
          url: 'https://developer.nrel.gov/api/energy_incentives/v2/dsire.json?api_key=baBQnhHJIUy28EX60XZ2mpnTHSQ4OkRuRE6Ki4yS&address='+data.name+'&technology=solar_photovoltaics',
          type: 'GET',
          dataType: 'json',
          success: function(response){
            var policies = response.result.length;
            (function popAppend (){
              $('.puList').append("<li>" + policies + " solar policies enacted</li>")
            }())
          }
        });
      }
    });

    // Why it matters
    $('#ddWhy').on('click', function(event) {
      $('#whyHidden').show();
      document.getElementById('whyHidden').scrollIntoView();
      $.ajax({
        url: "https://api.watttime.org/api/v1/datapoints/",
        headers: {'authorization': 'token 1a261ce948cce77dcdb4350568f9e6065634da1d'},
        type: "GET",
        dataType: "json",
        success: function(response) {
          for (var i = 0; i < response.results.length; i++) {
            console.log(response.results[i].carbon);
          }
        }
      })
    })

    // national stats
    $('#ddNat').on('click', function(){
      $('#natHidden').show();
      document.getElementById('natHidden').scrollIntoView();
      $('#ddNat').css({'background-color': 'rgb(108, 35, 47)'});
      $.ajax({
        url: 'https://developer.nrel.gov/api/solar/open_pv/installs/rankings?api_key=baBQnhHJIUy28EX60XZ2mpnTHSQ4OkRuRE6Ki4yS&format=JSON',
        type: 'GET',
        dataType: 'json',
        success: function(response){
          for (var i = 0; i < response.result.length; i++) {
            countArr.push(response.result[i].count);
            capArr.push(response.result[i].cap);
            if ( response.result[i].cost > 0 ) {
              costArr.push(response.result[i].cost);
            }
          }
          $.each(countArr, function(){
            countTotal += this;
          });
          $.each(costArr, function(){
            costTotal += this;
          });
          $.each(capArr, function(){
            capTotal += this;
          });
          $('#count').append("<h3>Total Installations Nationwide:</h3><h4>" + countTotal + "</h4>");
          $('#cost').append("<h3>Average National Costs:</h3><h4>$" + (costTotal/costArr.length).toFixed(2) + " / watt</h4>");
          $('#cap').append("<h3>Total Capacity:</h3><h4>" + capTotal.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " kW</h4>")
        }
      })
    })

    // site facts
    $('#ddSite').on('click', function(){
      $('#siteHidden').show();
      document.getElementById('siteHidden').scrollIntoView();
      $('.siteContainer').append("")
      for (var key in lsObject) {
        $('.siteTable').append("<tr><td>" + key + "</td><td>" + lsObject[key] +"</td></tr>");
      }
    })


    //end of .then
  })

})
