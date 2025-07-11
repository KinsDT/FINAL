import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, message, Popconfirm } from "antd";
import dayjs from "dayjs";

const apiBase = "http://localhost:5000/api/meter-mapping-crud";

const initialForm = {
  meter_id: "",
  time_interval: "",
  area: "",
  lat: "",
  long: "",
  dt_code: "",
  dt_capacity: "",
  e_ct_primary: "",
  e_ct_secondary: "",
  m_ct_primary: "",
  m_ct_secondary: "",
  vt: "",
  from_date: "",
  to_date: "",
  mf: "",
};

export default function MeterMappingCrud() {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingKeys, setEditingKeys] = useState({});

  // Fetch all records
  const fetchAll = async () => {
    const res = await fetch(apiBase);
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Add or Update
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        // Update
        await fetch(`${apiBase}/${editingKeys.meter_id}/${editingKeys.time_interval}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        message.success("Updated!");
      } else {
        // Add
        await fetch(apiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        message.success("Added!");
      }
      setModalOpen(false);
      setEditing(false);
      form.resetFields();
      fetchAll();
    } catch (err) {
      message.error("Error: " + err.message);
    }
  };

  // Delete
  const handleDelete = async (meter_id, time_interval) => {
    await fetch(`${apiBase}/${meter_id}/${time_interval}`, { method: "DELETE" });
    message.success("Deleted!");
    fetchAll();
  };

  // Open modal for editing
  const openEdit = (record) => {
    setEditing(true);
    setEditingKeys({ meter_id: record.meter_id, time_interval: record.time_interval });
    form.setFieldsValue({
      ...record,
      from_date: record.from_date ? dayjs(record.from_date) : null,
      to_date: record.to_date ? dayjs(record.to_date) : null,
    });
    setModalOpen(true);
  };

  // Open modal for adding
  const openAdd = () => {
    setEditing(false);
    setEditingKeys({});
    form.resetFields();
    setModalOpen(true);
  };

  // Table columns
  const columns = [
    { title: "Meter ID", dataIndex: "meter_id", key: "meter_id" },
    { title: "Time Interval", dataIndex: "time_interval", key: "time_interval" },
    { title: "Area", dataIndex: "area", key: "area" },
    { title: "Lat", dataIndex: "lat", key: "lat" },
    { title: "Long", dataIndex: "long", key: "long" },
    { title: "DT Code", dataIndex: "dt_code", key: "dt_code" },
    { title: "DT Capacity", dataIndex: "dt_capacity", key: "dt_capacity" },
    { title: "E CT Primary", dataIndex: "e_ct_primary", key: "e_ct_primary" },
    { title: "E CT Secondary", dataIndex: "e_ct_secondary", key: "e_ct_secondary" },
    { title: "M CT Primary", dataIndex: "m_ct_primary", key: "m_ct_primary" },
    { title: "M CT Secondary", dataIndex: "m_ct_secondary", key: "m_ct_secondary" },
    { title: "VT", dataIndex: "vt", key: "vt" },
    { title: "From Date", dataIndex: "from_date", key: "from_date" },
    { title: "To Date", dataIndex: "to_date", key: "to_date" },
    { title: "MF", dataIndex: "mf", key: "mf" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm
            title="Delete this record?"
            onConfirm={() => handleDelete(record.meter_id, record.time_interval)}
          >
            <Button size="small" danger style={{ marginLeft: 8 }}>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Meter Mapping Management</h2>
      <Button type="primary" onClick={openAdd} style={{ marginBottom: 16 }}>Add Record</Button>
      <Table rowKey={r => r.meter_id + "-" + r.time_interval} dataSource={data} columns={columns} scroll={{ x: 1200 }} />

      <Modal
        open={modalOpen}
        title={editing ? "Edit Meter Mapping" : "Add Meter Mapping"}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        okText={editing ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical" initialValues={initialForm}>
          <Form.Item name="meter_id" label="Meter ID" rules={[{ required: true }]}>
            <Input disabled={editing} />
          </Form.Item>
          <Form.Item name="time_interval" label="Time Interval" rules={[{ required: true }]}>
            <InputNumber disabled={editing} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="area" label="Area"><Input /></Form.Item>
          <Form.Item name="lat" label="Latitude"><InputNumber style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="long" label="Longitude"><InputNumber style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="dt_code" label="DT Code"><Input /></Form.Item>
          <Form.Item name="dt_capacity" label="DT Capacity"><InputNumber style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="e_ct_primary" label="E CT Primary"><InputNumber style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="e_ct_secondary" label="E CT Secondary"><InputNumber style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="m_ct_primary" label="M CT Primary"><InputNumber style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="m_ct_secondary" label="M CT Secondary"><InputNumber style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="vt" label="VT"><InputNumber style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="from_date" label="From Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="to_date" label="To Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="mf" label="MF"><InputNumber style={{ width: "100%" }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
