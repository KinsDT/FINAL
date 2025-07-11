import React from 'react';
import { Layout } from 'antd';
import MeterMappingCrud from '../components/MeterMappingCrud';
import Sidebar from '../components/Sidebar';

const { Sider, Content } = Layout;

export default function Thirdpage() {
  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={200}>
        <Sidebar />
      </Sider>
      <Layout style={{ padding: '0 0px' }}>
        <Content style={{ marginTop: 0 }}>
          <MeterMappingCrud />
        </Content>
      </Layout>
    </Layout>
  );
}
