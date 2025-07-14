import React from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Typography,
  Select,
  message,
} from "antd";
import { Paper } from "@mui/material";
import type { User } from "../../types/services";
import Button from "../../components/Button";

const { Title } = Typography;
const { Option } = Select;

const AddUserAndServicePersonForm: React.FC = () => {
  const [form] = Form.useForm<User>();

  const handleFinish = (values: User) => {
    console.table(values);
    message.success("Customer saved (dummy)!");
    form.resetFields();
  };

  return (
    <Paper elevation={2} style={{ padding: 24, margin: 0 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          Add Customer/Service Person
        </Title>
      </div>

      <Form<User> layout="vertical" form={form} onFinish={handleFinish} colon={false} >
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
                <Option value="admin">Service Person</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Status" name="isVerified">
              <Select placeholder="Select status" style={{ width: 200 }}>
                <Option value={true}>Active</Option>
                <Option value={false}>Pending</Option>
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

        <Form.Item style={{ marginTop: 16 }}>
          <Button variant='secondary' style={{ padding: "6px 24px" }}>
            Submit
          </Button>
          <Button variant='outline'style={{ marginLeft: 12, padding: "6px 24px" }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Paper>
  );
};

export default AddUserAndServicePersonForm;
