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
  sortCost = [],
  sortCount = [],
  sortCap = [],
  costRanking,
  capRanking,
  countRanking,
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
    $('.rowRemove').remove();
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

    //sorting feature
    for ( var key in stateData ) {
      sortCount.push([key, stateData[key].count])
      sortCount.sort(function(a, b){
        return b[1] - a[1]
      });
      sortCost.push([key, stateData[key].cost])
      sortCost.sort(function(a, b){
        return b[1] - a[1]
      });
      sortCap.push([key, stateData[key].cap])
      sortCap.sort(function(a, b){
        return b[1] - a[1]
      });
    }

    // Jquery map
    $('#map').usmap({
      'stateStyles': {fill: '#'},
      'stateHoverStyles': {fill: 'rgb(70, 112, 161)'},
      'stateHoverAnimation': 150,
      'stroke': {fill: '#ffffff'},
      click: function(event, data) {

        // state abbreviation translator
        (function abbrState(abbr){
          for (var j = 0; j < states.length; j++) {
            if (states[j][1] == data.name) stateName = (states[j][0])
          };
        })()

        // sorting function
        function costRank () {
          for (var i = 0; i < sortCost.length; i++) {
            if ( sortCost[i][0] == data.name ) costRanking = i + 1;
          }
        }
        function capRank () {
          for (var i = 0; i < sortCap.length; i++) {
            if ( sortCap[i][0] == data.name ) capRanking = i + 1;
          }
        }
        function countRank () {
          for (var i = 0; i < sortCount.length; i++) {
            if ( sortCount[i][0] == data.name ) countRanking = i + 1;
          }
        }

        // persistence function
        if ( localStorage.getItem(stateName) !== 'null'){
          clickCount = +(localStorage.getItem(stateName)) + 1;
          localStorage.setItem(stateName, clickCount)
        } else localStorage.setItem(stateName, clickCounter);

        // pop-out function
        $.ajax({
          url: 'https://developer.nrel.gov/api/energy_incentives/v2/dsire.json?api_key=zRvnoStLNlMEuI4UIT0hyYzDa5j3p83JKfaVTbKs&address='+data.name+'&technology=solar_photovoltaics',
          dataType: 'JSON',
          type: 'GET',
          success: function(response){
            stateData[data.name].policies = response.result.length;
          },
        }).then(function(){
          countRank(data.name);
          capRank(data.name);
          costRank(data.name);
          for (var key in stateData){
            if(data.name == key){
              (function pop (){
                $('.pu').show();
                $('.puTitleHolder').append("<div class='puTitle'><h3>" + stateName + "</h3></div>");
                $('.puTable').append("<tr class='rowRemove'><td class='rowRemove'>" + stateData[key].count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Systems Installed</td><td class='puCenter rowRemove'>" + countRanking + "</td></tr><tr class='rowRemove'><td class='rowRemove'>" + stateData[key].cap.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " kW Capacity</td><td class='puCenter rowRemove'>" + capRanking + "</td></tr class='rowRemove'><tr><td class='rowRemove'>Avg. Cost: $" + stateData[key].cost.toFixed(2) + " / watt</td><td class='puCenter rowRemove'>" + costRanking + "</td></tr><tr class='rowRemove'><td class='rowRemove' colspan=2>" + stateData[key].policies + " Solar Policies Enacted</td></tr>")
              }())
            }
          }
        })
      }
    })

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
