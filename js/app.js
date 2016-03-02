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
    ['Washington DC', 'DC'],
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
  $('.mapContainer').hide();

  // loading screen
  setTimeout(function () {
    $('.mapContainer').show();
    $('.loader').hide();
    $('.info').css({'position': 'relative', 'bottom': ''})
  }, 3500);

  // solar count, cost, capacity API
  $.getJSON('https://developer.nrel.gov/api/solar/open_pv/installs/rankings?api_key=zRvnoStLNlMEuI4UIT0hyYzDa5j3p83JKfaVTbKs&format=JSON').then(function(response){
    for ( var i = 0; i < response.result.length; i++ ) {
      stateData[response.result[i].name] = {count: response.result[i].count, cap: response.result[i].count, cost: response.result[i].cost}
    }
  }).then(function(){
    for (var key in stateData) {
      console.log('key', key);
      $.ajax({
        url: 'https://developer.nrel.gov/api/energy_incentives/v2/dsire.json?api_key=zRvnoStLNlMEuI4UIT0hyYzDa5j3p83JKfaVTbKs&address='+key+'&technology=solar_photovoltaics',
        dataType: 'JSON',
        type: 'GET',
        success: function(response){
          console.log('key ', key , 'res ', response.result.length)
          stateData[key].policies = response.result.length;
        }.bind(this)
      })
      // console.log('inside api for loop =', stateData);
    }

    //   $.getJSON('https://developer.nrel.gov/api/energy_incentives/v2/dsire.json?api_key=zRvnoStLNlMEuI4UIT0hyYzDa5j3p83JKfaVTbKs&address='+key+'&technology=solar_photovoltaics', function(response){
    //     stateData[key].policies = response.result.length;
    //     console.log('within api request =', stateData);
    //   })
    // }
    console.log('outside api request =', stateData);
    // Jquery map
    $('#map').usmap({
      'stateStyles': {fill: '#'},
      'stateHoverStyles': {fill: 'rgb(70, 112, 161)'},
      'stateHoverAnimation': 150,
      'stroke': {fill: '#ffffff'},
      // for (key in stateData){
      //   if ( stateData[key].count > 100) {
      //     'stateSpecificStyles': {
      //       stateData[key]: {fill: 'yellow'}
      //     }
      //   }
      // },
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
          console.log('key within popup', key);
          if(data.name == key){
            (function pop (){
              console.log('stateData[key] within popup =', stateData[key]);
              $('.pu').show();
              $('.puTitleHolder').append("<div class='puTitle'><h3>" + stateName + "</h3></div>")
              $('.puListHolder').append("<ul class='puList'><li>" + stateData[key].count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " systems installed</li><li>Totalling " + stateData[key].cap.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " kW</li><li>Average Costs: $" + stateData[key].cost.toFixed(2) + " / watt</li><li>" + stateData[key].policies + " solar policies enacted</li></ul>")
            }())
          }
        }
      }
    });

    // Why it matters
    $('#ddWhy').on('click', function(event) {
      $('#whyHidden').show();
      $('#natHidden').hide();
      $('#siteHidden').hide();
      $('#ddWhy').css({'background-color': '#83A3C6'});
      $('#ddSite').css({'background-color': ''});
      $('#ddNat').css({'background-color': ''});
      document.getElementById('whyHidden').scrollIntoView();
      $.ajax({
        url: "https://api.watttime.org/api/v1/datapoints/",
        headers: {'authorization': 'token 1a261ce948cce77dcdb4350568f9e6065634da1d'},
        type: "GET",
        dataType: "json",
        success: function(response) {
          for (var i = 0; i < response.results.length; i++) {
          }
        }
      })
    })

    // national stats
    $('#ddNat').on('click', function(){
      $('#natHidden').show();
      $('#whyHidden').hide();
      $('#siteHidden').hide();
      $('#ddNat').css({'background-color': '#83A3C6'});
      $('#ddSite').css({'background-color': ''});
      $('#ddWhy').css({'background-color': ''});
      document.getElementById('natHidden').scrollIntoView();
      $('#count').append("<h3>Total Installations Nationwide:</h3><h4>" + stateData[key].count + "</h4>");
      $('#cost').append("<h3>Average National Costs:</h3><h4>$" + stateData[key].cost.toFixed(2) + " / watt</h4>");
      $('#cap').append("<h3>Total Capacity:</h3><h4>" + stateData[key].cap.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " kW</h4>");
    })

    // site facts
    $('#ddSite').on('click', function(){
      $('#siteHidden').show();
      $('#whyHidden').hide();
      $('#natHidden').hide();
      $('#ddSite').css({'background-color': '#83A3C6'});
      $('#ddNat').css({'background-color': ''});
      $('#ddWhy').css({'background-color': ''});
      document.getElementById('siteHidden').scrollIntoView();
      $('.siteContainer').append("")
      for (var key in lsObject) {
        $('.tableContent').append("<tr><td>" + key + "</td><td>" + lsObject[key] +"</td></tr>");
      }
    })

    //end of .then
  })
})
