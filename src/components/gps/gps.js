/*global daum*/
import React, { Component } from 'react';
import styles from './gps.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

// const mapContainer = document.getElementById('map'); // 지도를 표시할 div 
// const map = new daum.maps.Map(mapContainer, {
//     center: new daum.maps.LatLng(37.566826, 126.9786567),
//     level: 1 // 지도의 확대 레벨
// }); // 지도를 생성

// const geocoder = new daum.maps.services.Geocoder();
// const marker = new daum.maps.Marker(), // 클릭한 위치를 표시할 마커입니다
//     infowindow = new daum.maps.InfoWindow({zindex:1}); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

class gps extends Component {
    // default State object
    state = {
        contacts: []
    };

    // constructor(props) {
    //     super(props);

    //     this.button1_click = this.button1_click.bind(this);
    //     this.searchDetailAddrFromCoords = this.searchDetailAddrFromCoords.bind(this);
    //   }
    
    componentDidMount() {
        console.log('componentDidMount start');

        const mapContainer = document.getElementById('map'); // 지도를 표시할 div 
        const map = new daum.maps.Map(mapContainer, {
            center: new daum.maps.LatLng(37.6006146, 126.8651469),
            level: 1 // 지도의 확대 레벨
        }); // 지도를 생성

        const geocoder = new daum.maps.services.Geocoder();
        const marker = new daum.maps.Marker(), // 클릭한 위치를 표시할 마커입니다
            infowindow = new daum.maps.InfoWindow({zindex:1}); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

        var lat_1 = 37.4135637;
        var lon_1 = 126.9056144;

        var latlon = new daum.maps.LatLng(lat_1,lon_1);
        
        searchDetailAddrFromCoords(latlon, function(result, status) {
            if (status === daum.maps.services.Status.OK) {
                var detailAddr = !!result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
                    detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';
                        
                var content = '<div className={cx("bAddr")}>' + 
                                    '<span className={cx("title")}>법정동 주소정보</span>' + 
                                detailAddr + '</div>';
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
    //}
    // // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
    // daum.maps.event.addListener(map, 'idle', function() {
    //     searchAddrFromCoords(map.getCenter(), displayCenterInfo);
    // });
                
        // function searchAddrFromCoords(coords, callback) {
        //     // 좌표로 행정동 주소 정보를 요청합니다
        //     geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
        // }
                
        function searchDetailAddrFromCoords(coords, callback) {
            // 좌표로 법정동 상세 주소 정보를 요청합니다
            console.log(coords.getLat(), coords.getLng());
            geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
        }
                
                // function displayCenterInfo(result, status) {
                //     if (status === daum.maps.services.Status.OK) {
                //         var infoDiv = document.getElementById('centerAddr');
            
                //         for(var i = 0; i < result.length; i++) {
                //             // 행정동의 region_type 값은 'H' 이므로
                //             if (result[i].region_type === 'H') {
                //                 infoDiv.innerHTML = result[i].address_name;
                //                 break;
                //             }
                //         }
                //     }
                // }
        
    }

    render() {
        return (
        // <div>
        //     <h1>dㄴㅇㄹㄴㅇㄹ</h1>
        // <div className={cx('InputAddr')}>
        // <div>
        //   <label htmlFor="lat">위도:</label>
        //   <input type="number" id="lat" />
        //   <label htmlFor="lon">경도:</label>
        //   <input type="number" id="lon" />
        // </div>
        // <div>
        //     <button id="name" onClick={this.button1_click}>출력하기</button>
        // </div>
        // </div>

        <div className={cx('map_wrap')}>
          <div id="map" style={{width: '100%', height: '100%', position: 'relative', overflow: 'hidden'}} />
        </div>

        //</div>
        );
    }
}


export default gps;
