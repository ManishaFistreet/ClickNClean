// components/AddServicePerson.tsx

import React from "react";
import {
  Form,
  Input,
  Divider,
  Button,
  Row,
  Col,
  Typography,
  message,
  Upload,
  DatePicker,
  
} from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadProps,UploadFile} from "antd";
import type { ServicePersonFormValues } from "../../types/services";


const { Title } = Typography;

interface AddServicePersonProps {
  onBack: () => void;
}

const AddServicePerson: React.FC<AddServicePersonProps> = ({ onBack }) => {
  const [form] = Form.useForm<ServicePersonFormValues>();

  const handleFinish = (values: ServicePersonFormValues) => {
    console.table(values);
    message.success("Service person saved (dummy)!");
    form.resetFields();
    onBack();
  };

  const normFile = (e: any): UploadFile[] => {
    return Array.isArray(e) ? e : e?.fileList;
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
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
          Back
        </Button>
        <Title level={4} style={{ margin: 0 }}>
          Add Service Person
        </Title>
        <div style={{ width: 80 }} />
      </div>

      {/* Form */}
      <div style={{ padding: 24, overflowY: "auto" }}>
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Divider orientation="left">Basic Details</Divider>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter Name" }]}
              >
                <Input placeholder="Enter the Name" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: "Please enter Phone Number" }]}
              >
                <Input placeholder="Enter the Phone" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please enter the email" }]}
              >
                <Input placeholder="Enter the email" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Photo"
                name="profilephoto"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  listType="picture"
                  beforeUpload={() => false}
                  showUploadList={{ showPreviewIcon: false }}
                  itemRender={(originNode, file, fileList, actions) => {
                    const previewUrl = file.originFileObj
                      ? URL.createObjectURL(file.originFileObj)
                      : "";
                    return (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        {file.originFileObj && (
                          <img
                            src={previewUrl}
                            alt="preview"
                            style={{
                              width: 40,
                              height: 40,
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
                        )}
                        <span>{file.name}</span>
                        <a
                          onClick={actions.remove}
                          style={{ color: "red", marginLeft: 8 }}
                        >
                          Remove
                        </a>
                      </div>
                    );
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Address Details</Divider>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please enter the city" }]}
              >
                <Input placeholder="Enter the city" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="State"
                name="state"
                rules={[{ required: true, message: "Please enter the state" }]}
              >
                <Input placeholder="Enter the state" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Street"
                name="street"
                rules={[{ required: true, message: "Please enter the street" }]}
              >
                <Input placeholder="Enter the street" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="ZipCode"
                name="zipCode"
                rules={[{ required: true, message: "Please enter the ZipCode" }]}
              >
                <Input placeholder="Enter the ZipCode" style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Service Details</Divider>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Category"
                name="categories"
                rules={[{ required: true, message: "Please enter the Service Category" }]}
              >
                <Input placeholder="Enter the Service Category" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Date and Time Availability"
                name="dateTime"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Date and Time Availability",
                  },
                ]}
              >
                <DatePicker
                  showTime={{ use12Hours: true, format: "hh:mm A" }}
                  format="DD/MM/YYYY hh:mm A"
                  style={{ width: 200, height: 32 }}
                  placeholder="Select date & time"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: "left", marginTop: 24 }}>
            <Button  htmlType="submit" style={{ padding: "6px 24px" }}>
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

export default AddServicePerson;
