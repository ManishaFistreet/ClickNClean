import React, { useEffect, useState } from "react";
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
import { addPrice, fetchServices } from "../../api/ServiceApi";
import type { PriceFormValues, ServiceMaster } from "../../types/services";

const { Title } = Typography;
const { Option } = Select;

interface AddPriceFormProps {
  onBack: () => void;
  onSuccess?: () => void;
}

const AddPriceForm: React.FC<AddPriceFormProps> = ({ onBack, onSuccess }) => {
  const [form] = Form.useForm();
  const [services, setServices] = useState<ServiceMaster[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services", error);
      }
    };
    loadServices();
  }, []);

  const handleFinish = async (values: PriceFormValues) => {
    try {
      await addPrice(values);
      message.success("Price added successfully!");
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      console.error("API Error:", error);
      message.error("Failed to add price. Please try again.");
    }
  };

  return (
    <div>
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

      <div style={{ padding: 24, overflowY: "auto" }}>
        <Form layout="vertical" form={form} onFinish={handleFinish} colon={false}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Service Name" name="serviceName" rules={[{ required: true }]}>
                <Select
                  placeholder="Select service"
                  style={{ width: 200 }}
                  onChange={(value) => {
                    const selected = services.find(s => s.serviceName === value);
                    form.setFieldsValue({ serviceCode: selected?.serviceCode });
                  }}
                >
                  {services.map(service => (
                    <Option key={service._id} value={service.serviceName}>
                      {service.serviceName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Service Code" name="serviceCode">
                <Input style={{ width: 200 }} disabled />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Package Unique ID" name="pkgUniqueId">
                <Input style={{ width: 200 }} disabled />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Unique ID" name="uniqueId">
                <Input style={{ width: 200 }} disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Actual Price" name="actualPrice">
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>



            <Col xs={24} md={8}>
              <Form.Item label="Showoff Price" name="showoffPrice">
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Price Type" name="priceType">
                <Select placeholder="Select type" style={{ width: 200 }}>
                  <Option value={true}>Fixed</Option>
                  <Option value={false}>Hourly</Option>
                </Select>
              </Form.Item>
            </Col>
            </Row>
             <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Price Active Status" name="priceActiveStatus">
                <Select placeholder="Select status" style={{ width: 200 }}>
                  <Option value={true}>Active</Option>
                  <Option value={false}>Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Offer Discount (%)" name="offerDiscount">
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Special Discount (%)" name="specialDiscount">
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>

            <Col xs={24} md={8}>
              <Form.Item label="Offer Code" name="offerCode">
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
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
          </Row>

          <Form.Item style={{ marginTop: 16 }}>
            <Button htmlType="submit"  style={{ fontWeight: 500, padding: "6px 24px" }}>
              Submit
            </Button>
            <Button onClick={onBack} style={{ marginLeft: 12, fontWeight: 500, padding: "6px 24px" }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddPriceForm;
