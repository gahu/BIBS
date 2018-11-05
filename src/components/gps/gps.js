/*global daum*/
import React, { Component } from 'react';
import styles from './gps.scss';
import axios from "axios";

class gps extends Component {
    // default State object
    state = {
        contacts: []
    };

    componentDidMount() {
        axios
        .get("//dapi.kakao.com/v2/maps/sdk.js?appkey=97c4e1273dc30c8fe8fea947677b5904&libraries=services")
        .then(response => {

            // create an array of contacts only with relevant data
            const newContacts = response.data.map(c => {
            return {
                id: c.id,
                name: c.name
              };
            });

            // create a new "State" object without mutating 
            // the original State object. 
            const newState = Object.assign({}, this.state, {
            contacts: newContacts
            });

            // store the new state object in the component's state
            this.setState(newState);
        })
        .catch(error => console.log(error));
        console.log('componentDidMount start');
        let mapContainer = document.getElementById('map'); // 지도를 표시할 div 
        let map = new window.daum.maps.Map(mapContainer, {
            center: new window.daum.maps.LatLng(37.566826, 126.9786567),
            level: 1 // 지도의 확대 레벨
        }); // 지도를 생성

        let geocoder = new window.daum.maps.services.Geocoder();
        let marker = new window.daum.maps.Marker(), // 클릭한 위치를 표시할 마커입니다
            infowindow = new window.daum.maps.InfoWindow({zindex:1}); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

        function button1_click(){
            var lat_1 = document.getElementById("lat").value; 
            var lon_1 = document.getElementById("lon").value;
            // 입력받는 부분을 정보를 받아서 넣도록 한다.
            var latlon = new axios.daum.maps.LatLng(lat_1,lon_1);

            searchDetailAddrFromCoords(latlon, function(result, status) {
                if (status === window.daum.maps.services.Status.OK) {
                    var detailAddr = !!result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
                    detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';
                    
                    var content = '<div class="bAddr">' +
                                    '<span class="title">법정동 주소정보</span>' + 
                                detailAddr + 
                                '</div>';
                    // 중심위치 설정
//                  map = new daum.maps.Map(mapContainer, mapOption); //지도를 생성합니다.
                    map.setCenter(latlon);
                    
                    // 마커를 클릭한 위치에 표시합니다 
                    marker.setPosition(latlon);
                    marker.setMap(map);

                    // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
 //                 infowindow.setContent(null);
                    infowindow.setContent(content);
                    infowindow.open(map, marker);
                }   
            });
        }

        // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
        daum.maps.event.addListener(map, 'idle', function() {
            searchAddrFromCoords(map.getCenter(), displayCenterInfo);
        });
        
        function searchAddrFromCoords(coords, callback) {
            // 좌표로 행정동 주소 정보를 요청합니다
            geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
        }
        
        function searchDetailAddrFromCoords(coords, callback) {
            // 좌표로 법정동 상세 주소 정보를 요청합니다
            console.log(coords.getLat(), coords.getLng());
            geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
        }
        
        function displayCenterInfo(result, status) {
            if (status === window.daum.maps.services.Status.OK) {
                var infoDiv = document.getElementById('centerAddr');
    
                for(var i = 0; i < result.length; i++) {
                    // 행정동의 region_type 값은 'H' 이므로
                    if (result[i].region_type === 'H') {
                        infoDiv.innerHTML = result[i].address_name;
                        break;
                    }
                }
            }
        }
    }

    render() {
        return (
        <div className="gps" id="map">
        <div>
            <label for="lat">위도:</label>
            <input type="number" id="lat"/>
            <label for="lon">경도:</label>
            <input type="number" id="lon"/>
        </div>
        <div>
            <button id="button1" onClick= "button1_click();">출력하기</button>
        </div>

        <div className="map_wrap">
            <div id="map" style="width:100%;height:100%;position:relative;overflow:hidden;"></div>
        </div>
        </div>
        );
    }
}

export default gps;