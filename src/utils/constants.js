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

  'SAIFI (Consumers)': 'saifi_cons',
  'SAIDI (Consumers)': 'saidi_cons',
  'CAIFI (Consumers)': 'caifi_cons',
  'CAIDI (Consumers)': 'caidi_cons',
  'CIII (Consumers)': 'ciii_cons',
  'ASAI (Consumers)': 'asai_cons',
  'MAIFI (Consumers)': 'maifi_cons',
  'MAIDI (Consumers)': 'maidi_cons',

  'Import Load Factor':'import_lf',
  'Active Maximum Demand during Import':'active_md_import',
  'Apparent Maximum Demand during Import':'apparent_md_import'
};


export const parameterOptions = Object.keys(paramToColumnMap);

export const aggregationOptions = [
  { label: 'Max', value: 'max' },
  { label: 'Min', value: 'min' },
  { label: 'Avg', value: 'avg' },
  { label: 'Standard Deviation', value: 'stddev' },
];

