$(function (){
  $('.popUp').hide();
  $('.popUpClose').on('click', function(){
    $('.popUp').hide()
  });

  $('#map').usmap({
    'stateStyles': {fill: '#'},
    'stateHoverStyles': {fill: '#4b70b6'},
    'stateHoverAnimation': 150,
    click: function(event, data) {
      // persistence function
      // if(localStorage.getItem(data.name)){
      //   var temp = localStorage.getItem(data.name);
      //   temp.count++;
      // }else{
      //   localStorage.setItem({state: data.name, count: 1});
      // }


      // solar count & cost API
      countArr = [];
      costArr = [];

      countTotal = 0;
      countTotalFormatted = countTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      costTotal = 0;
      costTotalAveraged = (costTotal/costArr.length).toFixed(2);

      $.ajax({
        url: 'https://developer.nrel.gov/api/solar/open_pv/installs/rankings?state='+data.name+'&api_key=baBQnhHJIUy28EX60XZ2mpnTHSQ4OkRuRE6Ki4yS&format=JSON',
        type: 'GET',
        dataType: 'json',
        success: function(response){
          for ( var i = 0; i < response.result.length; i++ ) {
            countArr.push(response.result[i].count);
            if ( response.result[i].cost > 0 ) {
              costArr.push(response.result[i].cost);
            }
          }
          $.each(countArr, function(){
            countTotal += this;
          })
          $.each(costArr, function(){
              costTotal += this;
          })

          console.log('countTotal', countTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") );
          console.log( 'costTotal', (costTotal/costArr.length).toFixed(2) );
        }
      });

      // available policies API
      $.ajax({
        url: 'https://developer.nrel.gov/api/energy_incentives/v2/dsire.json?api_key=baBQnhHJIUy28EX60XZ2mpnTHSQ4OkRuRE6Ki4yS&address='+data.name+'&technology=solar_photovoltaics',
        type: 'GET',
        dataType: 'json',
        success: function(response){
          console.log('policies', response.result.length)
        }
      });

      (function pop (){
        $('.popUp').show()
        $('.popUpInner').append("<p>Total Installations: " + countTotalFormatted + "</p>")
      }())

    }
  })

})
