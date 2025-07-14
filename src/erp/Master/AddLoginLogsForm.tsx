import React from "react";
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Row,
  Col,
  Typography,
  message,
  Select,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";

const { Title } = Typography;
const { Option } = Select;

interface AddLoginLogsFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

type FormValues = {
  uniqueId: string;
  ipAddress: string;
  loginDate?: Dayjs;
  loginTime?: Dayjs;
  loginLatitude?: string;
  loginLongitude?: string;
  loggedInBy: "app" | "web";
  loginAddress?: string;
};

const AddLoginLogsForm: React.FC<AddLoginLogsFormProps> = ({ onBack, onSuccess }) => {
  const [form] = Form.useForm<FormValues>();

  const handleFinish = (values: FormValues) => {
    const formatted = {
      ...values,
      loginDate: values.loginDate?.format("YYYY-MM-DD"),
      loginTime: values.loginTime?.format("HH:mm"),
    };

    console.table(formatted);
    message.success("Login log submitted successfully!");
    form.resetFields();
    onSuccess();
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
          Add Login Log Info
        </Title>
        <div style={{ width: 80 }} />
      </div>

      {/* Form */}
      <div style={{ padding: 24, overflowY: "auto" }}>
        <Form layout="vertical" form={form} onFinish={handleFinish} colon={false}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Unique ID"
                name="uniqueId"
                rules={[{ required: true, message: "Please enter unique ID" }]}
              >
                <Input placeholder="e.g. LOG001" style={{ width: 200 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="IP Address"
                name="ipAddress"
                rules={[{ required: true, message: "Enter IP Address" }]}
              >
                <Input placeholder="e.g. 192.168.0.1" style={{ width: 200 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Logged In From"
                name="loggedInBy"
                rules={[{ required: true, message: "Select device" }]}
              >
                <Select placeholder="Select device" style={{ width: 200 }}>
                  <Option value="app">App</Option>
                  <Option value="web">Web</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Login Date"
                name="loginDate"
                rules={[{ required: true, message: "Select login date" }]}
              >
                <DatePicker style={{ width: 200 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Login Time"
                name="loginTime"
                rules={[{ required: true, message: "Select login time" }]}
              >
                <TimePicker format="HH:mm" style={{ width: 200 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Login Address" name="loginAddress">
                <Input.TextArea rows={2} placeholder="Optional full address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Login Latitude" name="loginLatitude">
                <Input placeholder="Optional" style={{ width: 200 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Login Longitude" name="loginLongitude">
                <Input placeholder="Optional" style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

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

export default AddLoginLogsForm;
