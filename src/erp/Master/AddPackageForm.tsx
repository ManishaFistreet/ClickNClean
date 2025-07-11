import React from "react";
import {
  Form,
  Input,
  Upload,
  Button as AntButton,
  Row,
  Col,
  Typography,
  message,
  Select,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import type { UploadFile } from "antd/es/upload/interface";
import Button from "../../components/Button";

const { Title } = Typography;
const { Option } = Select;

interface AddPackageFormProps {
  onBack: () => void;
}

interface PackageFormValues {
  UniqueId: string;
  mappedServiceCode: string;
  packageName: string;
  packageDetail?: string;
  packagePriceId: string;
  mappedPriceMaster?: string;
  packagePrice?: string;
  packageImageWeb?: UploadFile[];
  packageImageApp?: UploadFile[];
}

const AddPackageForm: React.FC<AddPackageFormProps> = ({ onBack }) => {
  const [form] = Form.useForm<PackageFormValues>();

  const handleFinish = async (values: PackageFormValues) => {
    try {
      const formData = new FormData();
      formData.append("UniqueId", values.UniqueId);
      formData.append("mappedServiceCode", values.mappedServiceCode);
      formData.append("packageName", values.packageName);
      formData.append("packageDetail", values.packageDetail || "");
      formData.append("packagePriceId", values.packagePriceId);
      formData.append("mappedPriceMaster", values.mappedPriceMaster || "");
      formData.append("packagePrice", values.packagePrice || "");

      if (values.packageImageWeb?.[0]?.originFileObj) {
        formData.append("packageImageWeb", values.packageImageWeb[0].originFileObj);
      }

      if (values.packageImageApp?.[0]?.originFileObj) {
        formData.append("packageImageApp", values.packageImageApp[0].originFileObj);
      }

      await axios.post("http://localhost:5000/api/package", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Package saved successfully!");
      form.resetFields();
      onBack();
    } catch (error) {
      console.error("API Error:", error);
      message.error("Failed to save package.");
    }
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
        <AntButton icon={<ArrowLeftOutlined />} onClick={onBack} style={{ fontWeight: 500 }}>
          Back
        </AntButton>
        <Title level={4} style={{ margin: 0 }}>
          Add New Package
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
                label="Package Image for Web"
                name="packageImageWeb"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload listType="picture" beforeUpload={() => false}>
                  <AntButton icon={<UploadOutlined />}>Upload Web Image</AntButton>
                </Upload>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Unique ID"
                name="UniqueId"
                rules={[{ required: true, message: "Enter unique ID" }]}
              >
                <Input placeholder="e.g. PKG001" style={{ width: 200 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Package Price Unique ID"
                name="packagePriceId"
                rules={[{ required: true, message: "Select package price ID" }]}
              >
                <Select placeholder="Select pricing ID" style={{ width: 200 }}>
                  <Option value="PRICE001">PRICE001</Option>
                  <Option value="PRICE002">PRICE002</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Package Image for App"
                name="packageImageApp"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload listType="picture" beforeUpload={() => false}>
                  <AntButton icon={<UploadOutlined />}>Upload App Image</AntButton>
                </Upload>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Mapped Service Code"
                name="mappedServiceCode"
                rules={[{ required: true, message: "Select service code" }]}
              >
                <Select placeholder="Select service code" style={{ width: 200 }}>
                  <Option value="SVC001">SVC001</Option>
                  <Option value="SVC002">SVC002</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Mapped Price Master" name="mappedPriceMaster">
                <Input placeholder="Optional link to pricing" style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Package Name"
                name="packageName"
                rules={[{ required: true, message: "Enter package name" }]}
              >
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>

            <Col xs={40} md={13}>
              <Form.Item label="Package Detail" name="packageDetail">
                <Input.TextArea rows={2} placeholder="Optional description" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Package Price"
                name="packagePrice"
                rules={[{ required: true, message: "Enter package price" }]}
              >
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Buttons */}
          <Form.Item style={{ textAlign: "left", marginTop: 16 }}>
            <Button variant="secondary" style={{ padding: "6px 24px" }}>
              Submit
            </Button>
            <Button variant="outline" onClick={onBack} style={{ marginLeft: 12, padding: "6px 24px" }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddPackageForm;
