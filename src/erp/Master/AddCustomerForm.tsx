import React from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Select,
  message,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import type { User } from "../../types/services";

const { Title } = Typography;
const { Option } = Select;

type Props = {
  onBack: () => void;
};

const AddCustomerForm: React.FC<Props> = ({ onBack }) => {
  const [form] = Form.useForm<User>();

  const handleFinish = (values: User) => {
    console.table(values);
    message.success("Customer saved (dummy)!");
    form.resetFields();
    onBack();
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
          Add New Customer
        </Title>
        <div style={{ width: 80 }} />
      </div>

      {/* Form */}
      <div style={{ padding: 24, overflowY: "auto" }}>
        <Form<User> layout="vertical" form={form} onFinish={handleFinish} colon={false}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Phone Number" name="phone" rules={[{ required: true }]}> 
                <Input placeholder="Enter phone number" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Name" name="name">
                <Input placeholder="Enter full name" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Email" name="email">
                <Input placeholder="Enter email" style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Role" name="role" rules={[{ required: true }]}> 
                <Select placeholder="Select role" defaultValue="user" style={{ width: 200 }}>
                  <Option value="user">User</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Verified" name="isVerified">
                <Select placeholder="Select status" style={{ width: 200 }}>
                  <Option value={true}>Verified</Option>
                  <Option value={false}>Unverified</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Profile Photo URL" name="profilePhoto">
                <Input placeholder="Enter URL" style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Street" name={["address", "street"]}>
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="City" name={["address", "city"]}>
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="State" name={["address", "state"]}>
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Zip Code" name={["address", "zipCode"]}>
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Latitude" name={["address", "coordinates", "lat"]}>
                <Input type="number" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Longitude" name={["address", "coordinates", "lng"]}>
                <Input type="number" style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: "left", marginTop: 16 }}>
            <Button type="primary" htmlType="submit" style={{ padding: "6px 24px" }}>
              Submit
            </Button>
            <Button
              onClick={onBack}
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

export default AddCustomerForm;