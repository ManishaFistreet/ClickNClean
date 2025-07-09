import React, { useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Typography,
  Select,
  Row,
  Col,
  message,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { ServicePrice } from "../../types/services";

const { Title } = Typography;
const { Option } = Select;

interface AddPriceFormProps {
  onBack: () => void;
  onSuccess?: () => void;
}

const AddPriceForm: React.FC<AddPriceFormProps> = ({ onBack, onSuccess }) => {
  const [form] = Form.useForm<ServicePrice>();

  const handleFinish = async (values: ServicePrice) => {
    const formattedValues = {
      ...values,
      offerStart: values.offerStart ? (values.offerStart as Dayjs).format("YYYY-MM-DD") : null,
      offerEnd: values.offerEnd ? (values.offerEnd as Dayjs).format("YYYY-MM-DD") : null,
    };

    try {
      await axios.post("http://localhost:5000/api/service-price", formattedValues);
      message.success("Price added successfully!");
      form.resetFields();
      if (onSuccess) onSuccess();
      onBack();
    } catch (error) {
      console.error("API Error:", error);
      message.error("Failed to add price. Please try again.");
    }
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
        <Button icon={<ArrowLeftOutlined />} onClick={onBack} style={{ fontWeight: 500 }}>
          Back
        </Button>
        <Title level={4} style={{ margin: 0 }}>
          Add New Price
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
          {/* Row 1 */}
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Service Code"
                name="serviceCode"
                rules={[{ required: true, message: "Enter service code" }]}
              >
                <Input placeholder="e.g. SVC001" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Package Unique ID" name="pkgUniqueId">
                <Input placeholder="Optional" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Unique ID" name="uniqueId">
                <Input placeholder="e.g. PRC001" style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 2 */}
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Min Discount (%)" name="minDiscount">
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Max Discount (%)" name="maxDiscount">
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Special Discount (%)" name="specialDiscount">
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 3 */}
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Price Type" name="priceType">
                <Select placeholder="Select type" style={{ width: 200 }}>
                  <Option value={true}>Fixed</Option>
                  <Option value={false}>Hourly</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Showoff Price" name="showoffPrice">
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Price Active Status" name="priceActiveStatus">
                <Select placeholder="Select status" style={{ width: 200 }}>
                  <Option value={true}>Active</Option>
                  <Option value={false}>Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Row 4 */}
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Offer Discount (%)" name="offerDiscount">
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Offer Code" name="offerCode">
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Actual Price" name="actualPrice">
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 5 */}
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Offer Starts From" name="offerStart">
                <DatePicker style={{ width: 200 }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Offer Ends On" name="offerEnd">
                <DatePicker style={{ width: 200 }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Persons Required" name="minPersonRequired">
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 6 */}
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Extra Hour Charge" name="proportionalChargesExtraHours">
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Proportional Extra Hours" name="proportionalExtraHours">
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Buttons */}
          <Form.Item style={{ textAlign: "left", marginTop: 16 }}>
            <Button type="primary" htmlType="submit" style={{ padding: "6px 24px" }}>
              Submit
            </Button>
            <Button onClick={onBack} style={{ marginLeft: 12, padding: "6px 24px" }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddPriceForm;
