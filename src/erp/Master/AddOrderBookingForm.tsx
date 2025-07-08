import React from 'react';
import { Button, Form, Input, Select, Typography, Row, Col, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { OrderBookingFormValues } from '../../types/services';

const { Title } = Typography;
const { Option } = Select;

interface AddOrderBookingFormProps {
  onBack: () => void;
}

const AddOrderBookingForm: React.FC<AddOrderBookingFormProps> = ({ onBack }) => {
  const [form] = Form.useForm();

  const handleFinish = (values : OrderBookingFormValues) => {
    console.table(values);
    message.success("Order/Booking saved (dummy)!");
    form.resetFields();
    onBack();
  };

  return (
    <div>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #f0f0f0", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>Back</Button>
        <Title level={4} style={{ margin: 0 }}>Add Order & Booking</Title>
        <div style={{ width: 80 }} />
      </div>
      <div style={{ padding: 24, overflowY: "auto" }}>
        <Form layout="vertical" form={form} onFinish={handleFinish} colon={false}>
          <Row gutter={16}>
            <Col xs={24} md={8}><Form.Item label="Unique ID" name="uniqueId" rules={[{ required: true }]}><Input style={{ width: 200 }} /></Form.Item></Col>
            <Col xs={24} md={8}><Form.Item label="Booking ID" name="bookingId" rules={[{ required: true }]}><Input style={{ width: 200 }} /></Form.Item></Col>
            <Col xs={24} md={8}><Form.Item label="Service Category" name="serviceCategory"><Select placeholder="Select category" style={{ width: 200 }}><Option value="residential">Residential</Option><Option value="commercial">Commercial</Option><Option value="professional">Professional</Option></Select></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8}><Form.Item label="Service Code" name="serviceCode"><Input style={{ width: 200 }} /></Form.Item></Col>
            <Col xs={24} md={8}><Form.Item label="Offer Code" name="offerCode"><Input style={{ width: 200 }} /></Form.Item></Col>
            <Col xs={24} md={8}><Form.Item label="Package Code" name="packageCode"><Input style={{ width: 200 }} /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8}><Form.Item label="Price Type" name="priceType"><Select placeholder="Select type" style={{ width: 200 }}><Option value="fixed">Fixed</Option><Option value="hourly">Hourly</Option><Option value="package">Package</Option></Select></Form.Item></Col>
            <Col xs={24} md={8}><Form.Item label="Final Discount" name="finalDiscount"><Input style={{ width: 200 }} /></Form.Item></Col>
            <Col xs={24} md={8}><Form.Item label="Taxable Value" name="taxableValue"><Input style={{ width: 200 }} /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8}><Form.Item label="Total Value (Inc Taxes)" name="totalValueIncTax"><Input style={{ width: 200 }} /></Form.Item></Col>
            <Col xs={24} md={8}><Form.Item label="Total Value per Service" name="totalValuePerService"><Input style={{ width: 200 }} /></Form.Item></Col>
            <Col xs={24} md={8}><Form.Item label="GST per Service (Value)" name="gstValue"><Input style={{ width: 200 }} /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8}><Form.Item label="GST per Service (%)" name="gstPercent"><Input style={{ width: 200 }} /></Form.Item></Col>
            <Col xs={24} md={8}><Form.Item label="Grand Total" name="grandTotal"><Input style={{ width: 200 }} /></Form.Item></Col>
          </Row>
          <Form.Item style={{ textAlign: "left", marginTop: 16 }}>
            <Button type="primary" htmlType="submit" style={{ padding: "6px 24px" }}>Submit</Button>
            <Button onClick={onBack} style={{ marginLeft: 12, padding: "6px 24px" }}>Cancel</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddOrderBookingForm;
