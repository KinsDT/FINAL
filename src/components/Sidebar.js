import React from 'react';
import { Layout, Radio } from 'antd';
import { parameterOptions } from '../utils/constants';

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed, selectedParam, onRadioChange }) => {
  return (
    <Sider
      width={280}
      collapsible
      collapsed={collapsed}
      collapsedWidth={0}
      trigger={null}
      style={{ background: '#fff', padding: '0px', position: 'relative' }}
    >
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute',
          top: 8,
          left: collapsed ? 10 : 280,
          width: 24,
          height: 24,
          borderRadius: '4px',
          backgroundColor: '#1890ff',
          color: 'white',
          fontWeight: 'bold',
          fontSize: 18,
          lineHeight: '24px',
          textAlign: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          boxShadow: '0 0 6px rgba(0,0,0,0.15)',
          zIndex: 10,
          transition: 'left 0.3s',
        }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '›' : '‹'}
      </div>

      {!collapsed && (
        <Layout style={{ padding: '10px' }}>
          <h2>Parameters</h2>
          <Radio.Group
            onChange={onRadioChange}
            value={selectedParam}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {parameterOptions.map((param) => (
              <Radio key={param} value={param}>
                {param}
              </Radio>
            ))}
          </Radio.Group>

          <div style={{ marginTop: '20px' }}>
            <strong>Selected:</strong>
            <div>{selectedParam || 'None'}</div>
          </div>
        </Layout>
      )}
    </Sider>
  );
};

export default Sidebar;
