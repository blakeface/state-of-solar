$('#modal').hide();

$(function (){
  $('#map').usmap({
    'stateStyles': {fill: 'rgb(74, 137, 163)'},
    'stateHoverStyles': {fill: 'rgb(171, 73, 73)'},
    'stateHoverAnimation': 300,
    click: function(event, data) {
      $.ajax({
        url: 'https://developer.nrel.gov/api/solar/open_pv/installs/rankings?state='+data.name+'&api_key=baBQnhHJIUy28EX60XZ2mpnTHSQ4OkRuRE6Ki4yS&format=JSON',
        type: 'GET',
        dataType: 'json',
        success: function(response){
          console.log(response)
          $('#name').text = response.state;
          $('#modal').show();
        }
      })
    }
  })
})


$('#close').on('click', function(){
  $('#modal').hide();
})
