import React from "react";
import {
  Form,
  Input,
  Select,
  Typography,
  Row,
  Col,
  message,
  Button as AntButton
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import type { OrderBookingFormValues } from "../../types/services";
import Button from "../../components/Button";

const { Title } = Typography;
const { Option } = Select;

interface AddOrderBookingFormProps {
  onBack: () => void;
  onSuccess?: () => void;
}

const AddOrderBookingForm: React.FC<AddOrderBookingFormProps> = ({
  onBack,
  onSuccess,
}) => {
  const [form] = Form.useForm<OrderBookingFormValues>();

  const handleFinish = (values: OrderBookingFormValues) => {
    console.table(values);
    message.success("Order/Booking submitted successfully!");
    form.resetFields();
    onBack();
    if (onSuccess) onSuccess();
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #f0f0f0",
          background: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <AntButton icon={<ArrowLeftOutlined />} onClick={onBack}>
          Back
        </AntButton>
        <Title level={4} style={{ margin: 0 }}>
          Add Order & Booking
        </Title>
        <div style={{ width: 80 }} />
      </div>

      {/* Form */}
      <div style={{ padding: 24, overflowY: "auto" }}>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleFinish}
          colon={false}
        >
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Unique ID"
                name="uniqueId"
                rules={[{ required: true }]}
              >
                <Input placeholder="Unique ID" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Booking ID"
                name="bookingId"
                rules={[{ required: true }]}
              >
                <Input placeholder="Booking ID" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Service Category" name="serviceCategory">
                <Select placeholder="Select category" style={{ width: 200 }}>
                  <Option value="residential">Residential</Option>
                  <Option value="commercial">Commercial</Option>
                  <Option value="professional">Professional</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Service Code" name="serviceCode">
                <Input placeholder="Service Code" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Offer Code" name="offerCode">
                <Input placeholder="Offer Code" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Package Code" name="packageCode">
                <Input placeholder="Package Code" style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Price Type" name="priceType">
                <Select placeholder="Select type" style={{ width: 200 }}>
                  <Option value="fixed">Fixed</Option>
                  <Option value="hourly">Hourly</Option>
                  <Option value="package">Package</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Final Discount" name="finalDiscount">
                <Input placeholder="Discount" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Taxable Value" name="taxableValue">
                <Input placeholder="Taxable Value" style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Total Value (Inc. Tax)" name="totalValueIncTax">
                <Input placeholder="Total w/ Tax" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Total Value Per Service"
                name="totalValuePerService"
              >
                <Input placeholder="Total/Service" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="GST Value" name="gstValue">
                <Input placeholder="GST Value" style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="GST Percent" name="gstPercent">
                <Input placeholder="GST %" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Grand Total" name="grandTotal">
                <Input placeholder="Grand Total" style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: "left", marginTop: 16 }}>
            <Button
              variant="secondary"
              
              style={{ padding: "6px 24px" }}
            >
              Submit
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              style={{ marginLeft: 12, padding: "6px 24px" }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddOrderBookingForm;
