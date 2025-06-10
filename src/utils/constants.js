import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const paramToColumnMap = {
  'Voltage Unbalance': 'vu_percent',
  'Current Unbalance': 'iu_percent',
  'Average Power Factor of 3 Phases': 'pfavg3ph',
};

export const parameterOptions = Object.keys(paramToColumnMap);

export const aggregationOptions = [
  { label: 'Max', value: 'max' },
  { label: 'Min', value: 'min' },
  { label: 'Avg', value: 'avg' },
  { label: 'Standard Deviation', value: 'stddev' },
];

