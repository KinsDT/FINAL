import React from 'react';
import { Layout } from 'antd';
import Sidebar from '../components/Sidebar';
import SubdivisionSelector from '../components/SubdivisionSelector';

const { Sider, Content } = Layout;

export default function Secondpage() {
  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={200} style={{ background: '#ffffff' }}>
        <Sidebar />
      </Sider>

      <Layout style={{ padding: '0 24px 24px', width: '100%' }}>
        <Content>
          <SubdivisionSelector />
        </Content>
      </Layout>
    </Layout>
  );
}
