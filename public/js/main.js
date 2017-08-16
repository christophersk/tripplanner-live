$(function initializeMap (){

  var fullstackAcademy = new google.maps.LatLng(41.8884073, -87.6293817);

  var styleArr = [{
    featureType: 'landscape',
    stylers: [{ saturation: -100 }, { lightness: 60 }]
  }, {
    featureType: 'road.local',
    stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
  }, {
    featureType: 'transit',
    stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
  }, {
    featureType: 'administrative.province',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'water',
    stylers: [{ visibility: 'on' }, { lightness: 30 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
  }];

  var mapCanvas = document.getElementById('map-canvas');

  var currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

  // var iconURLs = {
  //   hotel: '/images/lodging_0star.png',
  //   restaurant: '/images/restaurant.png',
  //   activity: '/images/star-3.png'
  // };

  // function drawMarker (type, coords) {
  //   var latLng = new google.maps.LatLng(coords[0], coords[1]);
  //   var iconURL = iconURLs[type];
  //   var marker = new google.maps.Marker({
  //     icon: iconURL,
  //     position: latLng
  //   });
  //   marker.setMap(currentMap);
  // }

  //   drawMarker('hotel', [41.8884073, -87.6293817]);
  //   drawMarker('restaurant', [41.9134555, -87.6503527]);
  //   drawMarker('activity', [41.8675766, -87.6162267])

});

$(document).ready(function() {

  function returnCurrentDay() {
    return +$('.current-day').text();
  }

  const itinerary = [null, {}];

  function createMarker() {
    console.log('createMarker fired');
    const hotels = itinerary[returnCurrentDay()].hotel;
    const restaurants = itinerary[returnCurrentDay()].restaurant;
    const activities = itinerary[returnCurrentDay()].activity;

    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 12,
      center: {lat: 41.8912974, lng: -87.6270254},
      maxZoom: 16
    });

    var bounds = new google.maps.LatLngBounds();
    console.log('bounds object is', bounds);
    console.log('bounds object val is', bounds.b.b);

    setMarkers(map);
    if (bounds.b.b !== 180) {
      map.fitBounds(bounds);
    }
    //map.setCenter({lat: 41.8912974, lng: -87.6270254});

    function setMarkers(map) {
      if (hotels) {
        for (var i = 0; i < hotels.length; i++) {
          var hotel = hotels[i];
          const coordsArray = hotel[1].split(',');
          var marker = new google.maps.Marker({
            position: {lat: +coordsArray[0], lng: +coordsArray[1]},
            map: map,
            icon: '/images/lodging_0star.png',
            title: hotel[0]
          });
          bounds.extend(marker.position);
        }
      }
      if (restaurants) {
        for (var i = 0; i < restaurants.length; i++) {
          var restaurant = restaurants[i];
          const coordsArray = restaurant[1].split(',');
          var marker = new google.maps.Marker({
            position: {lat: +coordsArray[0], lng: +coordsArray[1]},
            map: map,
            icon: '/images/restaurant.png',
            title: restaurant[0]
          });
          bounds.extend(marker.position);
        }
      }
      if (activities) {
        for (var i = 0; i < activities.length; i++) {
          var activity = activities[i];
          const coordsArray = activity[1].split(',');
          var marker = new google.maps.Marker({
            position: {lat: +coordsArray[0], lng: +coordsArray[1]},
            map: map,
            icon: '/images/star-3.png',
            title: activity[0]
          });
          bounds.extend(marker.position);
        }
      }
    }
  }


  // function createMarker(coordinates, image) {
  //   const coordsArray = coordinates.split(',');

  //   var myLatlng = new google.maps.LatLng(+coordsArray[0],+coordsArray[1]);
  //   var mapOptions = {
  //     zoom: 15,
  //     center: myLatlng
  //   }
  //   var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  //   var marker = new google.maps.Marker({
  //       position: myLatlng,
  //       title: "Hello World!",
  //       icon: image
  //   });
  //       // To add the marker to the map, call setMap();
  //       marker.setMap(map);
  // }

  hotels.forEach(hotel => {
    $('#hotel-choices').append(`<option data-coordinates="${hotel.place.location}">${hotel.name}</option>`);
  })
  restaurants.forEach(restaurant => {
    $('#restaurant-choices').append(`<option data-coordinates="${restaurant.place.location}">${restaurant.name}</option>`);
  })
  activities.forEach(activity => {
    $('#activity-choices').append(`<option data-coordinates="${activity.place.location}">${activity.name}</option>`);
  })

  $('#add-hotel').on('click', function() {
    const hotelName = $('#hotel-choices').val();
    const hotelCoordinates = $('#hotel-choices').find(':selected').data('coordinates');
    itinerary[returnCurrentDay()].hotel = [[hotelName, hotelCoordinates]];
    //createMarker($('#hotel-choices').find(':selected').data('coordinates'), '/images/lodging_0star.png');

    $(`#day-${returnCurrentDay()}`).trigger('click');
  })

  $('#add-restaurant').on('click', function() {
    const restaurantName = $('#restaurant-choices').val();
    const restaurantCoordinates = $('#restaurant-choices').find(':selected').data('coordinates');
    if (!itinerary[returnCurrentDay()].hasOwnProperty('restaurant')) {
      itinerary[returnCurrentDay()].restaurant = [[restaurantName, restaurantCoordinates]];
    } else if (itinerary[returnCurrentDay()].restaurant.indexOf(restaurantName) === -1) {
      itinerary[returnCurrentDay()].restaurant.push([restaurantName, restaurantCoordinates]);
    }
    $(`#day-${returnCurrentDay()}`).trigger('click');
  })

  $('#add-activity').on('click', function() {
    console.log($('#activity-choices').val())
    const activityName = $('#activity-choices').val();
    const activityCoordinates = $('#activity-choices').find(':selected').data('coordinates');
    if (!itinerary[returnCurrentDay()].hasOwnProperty('activity')) {
      itinerary[returnCurrentDay()].activity = [[activityName, activityCoordinates]];
    } else if (itinerary[returnCurrentDay()].activity.indexOf(activityName) === -1) {
      itinerary[returnCurrentDay()].activity.push([activityName, activityCoordinates]);
      // createMarker($('#hotel-choices').find(':selected').data('coordinates'), '/images/star-3.png');
    }
    $(`#day-${returnCurrentDay()}`).trigger('click');
  })

  $('.list-group').on('click', '.remove', function(){
    console.log($(this).data('name'));
    const category = $(this).data('category');
    const name = $(this).data('name');
    const categoryArray = itinerary[returnCurrentDay()][category];
    const itemIndex = categoryArray.indexOf(name);
    categoryArray.splice(itemIndex, 1);
    $(this).parent().remove();
    console.log(itinerary);
  })

  $('#day-add').on('click', function() {
    $(this).before(`<button id="day-${itinerary.length}" class="btn btn-circle day-btn">${itinerary.length}</button>`);
    itinerary.push({});
  })

  $('.remove').on('click', function() {
    const deletedDay = returnCurrentDay()
    itinerary.splice(deletedDay, 1);
    const numberOfButtons = $('.day-btn').length - 1;
    $('.day-btn').each(function(index, elem) {
      if (index !== numberOfButtons) {
        $(elem).remove();
      }
    })
    itinerary.forEach((day, index) => {
      if (index !== 0) {
        $('#day-add').before(`<button id="day-${index}" class="btn btn-circle day-btn">${index}</button>`);
      }
    })

    $(`#day-${deletedDay}`).trigger('click');
  })

  $('.day-buttons').on('click', '.day-btn', function() {
    if ($(this)[0].id !== 'day-add') {
      const dayNumber = +$(this).text();
      $('.current-day').removeClass('current-day');
      $(this).addClass('current-day');
      $('#day-title-name').text(`Day ${dayNumber}`);
      console.log(`day ${dayNumber} is`, itinerary[dayNumber]);

      let hotelString = '';
      if (Array.isArray(itinerary[returnCurrentDay()].hotel)) {
        console.log('hotel is', itinerary[returnCurrentDay()].hotel[0][0]);
        hotelString = `<li>${itinerary[returnCurrentDay()].hotel[0][0]}<span data-category="hotel" data-name="${itinerary[returnCurrentDay()].hotel[0][0]}" class="glyphicon glyphicon-remove-circle remove"></span></li>`;
      }
      $('#hotel-list').html(hotelString);

      let restaurantString = '';
      if (Array.isArray(itinerary[returnCurrentDay()].restaurant)) {
        restaurantString = itinerary[returnCurrentDay()].restaurant.reduce((acc, restaurant) => {
          return acc.concat(`<li>${restaurant[0]}<span data-category="restaurant" data-name="${restaurant[0]}" class="glyphicon glyphicon-remove-circle remove"></span></li>`)
        }, '')
      }
      $('#restaurant-list').html(restaurantString);

      let activityString = '';
      if (Array.isArray(itinerary[returnCurrentDay()].activity)) {
        activityString = itinerary[returnCurrentDay()].activity.reduce((acc, activity) => {
          return acc.concat(`<li>${activity[0]}<span data-category="activity" data-name="${activity[0]}" class="glyphicon glyphicon-remove-circle remove"></span></li>`)
        }, '')
      }
      $('#activity-list').html(activityString);
      createMarker();
    }
  })

})
