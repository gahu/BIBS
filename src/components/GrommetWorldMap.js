import React from 'react';
import WorldMap from 'grommet/components/WorldMap';
import '../../node_modules/grommet/grommet.min.css';

const GrommetWorldMap = () => {
    return (
        <div>
            <WorldMap series={[{
                "continent": "NorthAmerica",
                "label": "North America",
                "value": 40,
                "colorIndex": "graph-1",
            }, {
                "continent": "SouthAmerica",
                "label": "South America",
                "value": 30,
                "colorIndex": "accent-2",
            },{
                "continent": "Europe",
                "label": "Europe",
                "value": 20,
                "colorIndex": "unset",
            }, {
                "continent": "Africa",
                "label": "Africa",
                "value": 10,
                "colorIndex": "graph-2",
            }, {
                "continent": "Asia",
                "label": "Asia",
                "value": 15,
                "colorIndex": "graph-3",
            }, {
                "continent": "Australia",
                "label": "Australia",
                "value": 10,
                "colorIndex": "graph-4",
            }]} />
        </div>
    );
};

export default GrommetWorldMap;