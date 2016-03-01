$(function (){
  var countArr = [],
  costArr = [],
  capArr = [],
  countTotal = 0,
  costTotal = 0,
  capTotal = 0,
  stateName,
  fuelArr = [];

  // hide dropdown menus and pop-up feature
  $('.pu').hide();
  $('.puClose').on('click', function(){
    $('.pu').hide()
  });
  $('#whyHidden').hide();
  $('#natHidden').hide();
  $('#siteHidden').hide();

  // Jquery map
  $('#map').usmap({
    'stateStyles': {fill: '#'},
    'stateHoverStyles': {fill: '#4b70b6'},
    'stateHoverAnimation': 150,
    'stroke': {fill: '#ffffff'},
    click: function(event, data) {

      // state abbreviation translator
      (function abbrState(abbr){
        var states = [
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
        for (var j = 0; j < states.length; j++) {
          if (states[j][1] == data.name) {
            stateName = (states[j][0])
          }
        };
      })()

      // persistence function
      // if(localStorage.getItem(data.name)){
      //   var temp = localStorage.getItem(data.name);
      //   temp.count++;
      // }else{
      //   localStorage.setItem({state: data.name, count: 1});
      // }

      // solar count & cost API
      $.ajax({
        url: 'https://developer.nrel.gov/api/solar/open_pv/installs/rankings?state='+data.name+'&api_key=baBQnhHJIUy28EX60XZ2mpnTHSQ4OkRuRE6Ki4yS&format=JSON',
        type: 'GET',
        dataType: 'json',
        success: function(response){
          for ( var i = 0; i < response.result.length; i++ ) {
            capArr.push(response.result[i].cap);
            countArr.push(response.result[i].count);
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

          // pop-out function
          (function pop (){
            $('.pu').show()
            $('.puTitle').append("<h3>" + stateName + "</h3>")
            $('#puList').append("<li>" + countTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " systems installed</li><li>" + capTotal.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " MW</li><li>Average Costs: $" + (costTotal/costArr.length).toFixed(2) + " / watt</li>")
          }())
          // (function pop (){
          //   $('.popUp').show();
          //
          // })()
        }
      });

      // available policies API
      $.ajax({
        url: 'https://developer.nrel.gov/api/energy_incentives/v2/dsire.json?api_key=baBQnhHJIUy28EX60XZ2mpnTHSQ4OkRuRE6Ki4yS&address='+data.name+'&technology=solar_photovoltaics',
        type: 'GET',
        dataType: 'json',
        success: function(response){
          var policies = response.result.length;
          (function popAppend (){
            $('#puList').append("<li>" + policies + " solar policies enacted</li>")
          }())
        }
      });
    }
  });

  // Why it counts
  $('#ddWhy').on('click', function(event) {
    $('#whyHidden').show();
    $.ajax({
      url: "https://api.watttime.org/api/v1/fuel_carbon_intensities/",
      headers: {'authorization': 'token 1a261ce948cce77dcdb4350568f9e6065634da1d'},
      type: "GET",
      dataType: "json",
      success: function(response) {
        for (var i = 0; i < response.length; i++) {
          console.log(response[i]);
        }
      }
    })
  })

  // national stats
  $('#ddNat').on('click', function(){
    $('#natHidden').show();
    $.ajax({
      url: 'https://developer.nrel.gov/api/solar/open_pv/installs/rankings?api_key=baBQnhHJIUy28EX60XZ2mpnTHSQ4OkRuRE6Ki4yS&format=JSON',
      type: 'GET',
      dataType: 'json',
      success: function(response){
        for (var i = 0; i < response.result.length; i++) {
          countArr.push(response.result[i].count);
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
        $('.count').append("<h3>Total Installations Nationwide:</h3><h4>" + countTotal + "</h4>");
        $('.cost').append("<h3>Average National Costs:</h3><h4>$" + (costTotal/costArr.length).toFixed(2) + "</h4>");
      }
    })
    // $.ajax({
    //   url: 'https://developer.nrel.gov/api/energy_incentives/v2/dsire.json?api_key=baBQnhHJIUy28EX60XZ2mpnTHSQ4OkRuRE6Ki4yS&address=US&technology=solar_photovoltaics',
    //   type: 'GET',
    //   dataType: 'json',
    //   success: function(response){
    //     var policies = response.result.length;
    //     $('.policy').append("<h3>Total Solar Energy Policies Enacted Nationwide:</h3><h4>" + policies + "</h4>")
    //   }
    // });
    document.getElementById('natHidden').scrollIntoView();
  })
})
