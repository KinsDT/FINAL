import React from 'react';
import { Layout } from 'antd';
import Flag from '../components/Flag';
import Sidebar from '../components/Sidebar';

const { Sider, Content } = Layout;

export default function FourthPage() {
  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={200}>
        <Sidebar />
      </Sider>
      <Layout style={{ padding: '0 0px', width: '100%' }}>
        <Content style={{ marginTop: 0 }}>
          <Flag />
        </Content>
      </Layout>
    </Layout>
  );
}
