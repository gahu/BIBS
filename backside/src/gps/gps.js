const mapContainer = document.getElementById('map'); // 지도를 표시할 div 
// const map = new daum.maps.Map(mapContainer, {
//     center: new daum.maps.LatLng(37.6006146, 126.8651469),
//     level: 1 // 지도의 확대 레벨
// }); // 지도를 생성

const geocoder = new daum.maps.services.Geocoder();
// const marker = new daum.maps.Marker(), // 클릭한 위치를 표시할 마커입니다
//     infowindow = new daum.maps.InfoWindow({zindex:1}); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

// var lat_1 = 37.4135637;
// var lon_1 = 126.9056144;

// var latlon = new daum.maps.LatLng(lat_1,lon_1);
        
// searchDetailAddrFromCoords(lat, lon, function(result, status) {
//     var sd = geocoder.coord2Address(lon, lat, callback);
//     if (sd === daum.maps.services.Status.OK) {
//         var detailAddr = !!result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
//         detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';
                        
//         var content = '<div className={cx("bAddr")}>' + 
//                             '<span className={cx("title")}>법정동 주소정보</span>' + 
//                         detailAddr + '</div>';
//             // 중심위치 설정
// //                  map = new daum.maps.Map(mapContainer, mapOption); //지도를 생성합니다.
//         // map.setCenter(latlon);
                        
//                 // 마커를 클릭한 위치에 표시합니다 
//         // marker.setPosition(latlon);
//         // marker.setMap(map);
        
//                 // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
// //                 infowindow.setContent(null);
//         // infowindow.setContent(content);
//         // infowindow.open(map, marker);
//     }
// });
                
function searchDetailAddrFromCoords(lat, lon, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(lon, lat, callback);
}

module.exports;