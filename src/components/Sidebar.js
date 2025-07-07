import React from 'react';
import { Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

// Import SVGs as React components
import { ReactComponent as TelescopeIcon } from '../assets/telescope.svg';
import { ReactComponent as MapIcon } from '../assets/map.svg';
import { ReactComponent as MeterIcon } from '../assets/meter.svg';
import {ReactComponent as FlagIcon} from '../assets/flag.svg';
const ICON_SIZE = 20;
const ACTIVE_COLOR = "#1773BE"; 
const INACTIVE_COLOR = "#fff";  

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div
      style={{
        background: '#ffffff',
        padding: '16px 12px',
        borderRight: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '8px',
        height: '100vh',
        width: '200px',
        minWidth: '200px',
        maxWidth: '200px'
      }}
    >
      <div style={{ marginBottom: '15px', width: '100%' }}>
        <img
          src="/kimbal-logo.png"
          alt="Logo"
          style={{ width: '80%', objectFit: 'contain' }}
        />
      </div>

      <Button
        type="text"
        icon={
          <TelescopeIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
            style={{ marginRight: 8, verticalAlign: 'middle' }}
            // For most SVGs, fill changes the icon color. If not, try stroke.
            fill={isActive('/') ? ACTIVE_COLOR : INACTIVE_COLOR}
          />
        }
        style={{
          fontSize: '16px',
          textAlign: 'left',
          padding: '8px 12px',
          borderRadius: '8px',
          background: isActive('/') ? '#ECF4FA' : 'transparent',
          color: isActive('/') ? ACTIVE_COLOR : '#000',
          fontWeight: 400,
          fontFamily: 'GT Walsheim Pro'
        }}
        onClick={() => navigate('/')}
      >
        Satellite View
      </Button>

      <Button
        type="text"
        icon={
          <MapIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
            style={{ marginRight: 8, verticalAlign: 'middle' ,
            color: isActive('/Secondpage') ? ACTIVE_COLOR : INACTIVE_COLOR
            }}
          />
        }
        style={{
          fontSize: '16px',
          textAlign: 'left',
          padding: '8px 12px',
          borderRadius: '8px',
          background: isActive('/Secondpage') ? '#ECF4FA' : 'transparent',
          color: isActive('/Secondpage') ? ACTIVE_COLOR : '#000',
          fontWeight: 400,
          fontFamily: 'GT Walsheim Pro'
        }}
        onClick={() => navigate('/Secondpage')}
      >
        Area Details
      </Button>

      <Button
        type="text"
        icon={
          <MeterIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
            style={{ marginRight: 8, verticalAlign: 'middle' }}
            fill={isActive('/Thirdpage') ? ACTIVE_COLOR : INACTIVE_COLOR}
          />
        }
        style={{
          fontSize: '16px',
          textAlign: 'left',
          padding: '8px 12px',
          borderRadius: '8px',
          background: isActive('/Thirdpage') ? '#ECF4FA' : 'transparent',
          color: isActive('/Thirdpage') ? ACTIVE_COLOR : '#000',
          fontWeight: 400,
          fontFamily: 'GT Walsheim Pro'
        }}
        onClick={() => navigate('/Thirdpage')}
      >
        Meter Details
      </Button>
      <Button
        type="text"
        icon={
          <FlagIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
            style={{ marginRight: 8, verticalAlign: 'middle' }}
            // For most SVGs, fill changes the icon color. If not, try stroke.
            fill={isActive('/Fourthpage') ? ACTIVE_COLOR : INACTIVE_COLOR}
          />
        }
        style={{
          fontSize: '16px',
          textAlign: 'left',
          padding: '8px 12px',
          borderRadius: '8px',
          background: isActive('/Fourthpage') ? '#ECF4FA' : 'transparent',
          color: isActive('/Fourthpage') ? ACTIVE_COLOR : '#000',
          fontWeight: 400,
          fontFamily: 'GT Walsheim Pro'
        }}
        onClick={() => navigate('/Fourthpage')}
      >
        Flag View
      </Button>
    </div>
  );
}
