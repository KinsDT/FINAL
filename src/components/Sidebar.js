import React from 'react';
import { Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlobalOutlined, EnvironmentOutlined, BarChartOutlined } from '@ant-design/icons';

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
        alignItems: 'center',
        gap: '12px',
        height: '100vh',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <img
          src="/kimbal-logo.png"
          alt="Logo"
          style={{ width: '85%', objectFit: 'contain' }}
        />
      </div>

      <Button
        type="text"
        icon={<EnvironmentOutlined />}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '8px 12px',
          borderRadius: '8px',
          background: isActive('/Secondpage') ? '#bae7ff' : 'transparent',
          color: isActive('/Secondpage') ? '#1890ff' : '#000',
          fontWeight: 500
        }}
        onClick={() => navigate('/Secondpage')}
      >
        Area Details
      </Button>

      <Button
        type="text"
        icon={<BarChartOutlined />}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '8px 12px',
          borderRadius: '8px',
          background: isActive('/Thirdpage') ? '#bae7ff' : 'transparent',
          color: isActive('/Thirdpage') ? '#1890ff' : '#000',
          fontWeight: 500
        }}
        onClick={() => navigate('/Thirdpage')}
      >
        Meter Details
      </Button>

      <Button
        type="text"
        icon={<GlobalOutlined />}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '8px 12px',
          borderRadius: '8px',
          background: isActive('/') ? '#bae7ff' : 'transparent',
          color: isActive('/') ? '#1890ff' : '#000',
          fontWeight: 500
        }}
        onClick={() => navigate('/')}
      >
        Satellite View
      </Button>
    </div>
  );
}
