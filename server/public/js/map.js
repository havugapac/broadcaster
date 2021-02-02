
// mapboxgl.accessToken = 'pk.eyJ1IjoiaGF2dWdhcGFjIiwiYSI6ImNra2N5cjVwbDAwczIydXFqMG44d2tsaWUifQ.X9gvzfX4X48dV81ADitOfg';
// const map = new mapboxgl.Map({
// container: 'map',
// style: 'mapbox://styles/mapbox/streets-v11',
// zoom: 9,
// center: [-70.930494, 42.85778]
// });

// // //fetch redFlags from api
// // async function redFlags(){
// // const res = await fetch('/api/redFlags');
// // const data = await res.json();

// // console.log(data);
// // }

// // //function loadMap(redFlags)
// function loadMap(){
//     map.on('load', function () {

//         map.addLayer({
//         id: 'points',
//         type: 'symbol',
//         source: {
//             type: 'geojson',
//             data: {
//             type: 'FeatureCollection',

//             // features: redFlags,
//             features: [
//             {
//             type: 'Feature',
//             geometry: {
//             type: 'Point',
//             coordinates: [-70.930494, 42.85778]
//             },
//             properties:{
//                 storedId: '001',
//                 icon: shop
//             }
//             }
//             ]
//             }
//             },
//         layout: {
//         'icon-image': '{icon}-15',
//         'icon-size': 1.5,
//         'text-field':'{storeId}',
//         'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
//         'text-offset': [0, 0.9],
//         'text-anchor': 'top'
//         }
//         });
//     });

//  }

// //redFlags();
// loadMap();

mapboxgl.accessToken = 'pk.eyJ1IjoiaGF2dWdhcGFjIiwiYSI6ImNra2N5cjVwbDAwczIydXFqMG44d2tsaWUifQ.X9gvzfX4X48dV81ADitOfg';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [-70.930494, 42.85778],
zoom: 8
});
 
var marker = new mapboxgl.Marker()
.setLngLat([-70.930494, 42.85778])
.addTo(map);