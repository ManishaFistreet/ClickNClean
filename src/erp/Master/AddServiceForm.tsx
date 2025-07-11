import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button as AntButton,
  Row,
  Col,
  Typography,
  message,
  Upload,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined, CloseOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import CreatableSelect from "react-select/creatable";
import type { SingleValue } from "react-select";
import { addServices } from "../../api/ServiceApi";
import type { ServiceMaster } from "../../types/services";
import Button from "../../components/Button";

const { Title } = Typography;

type serviceFormValues = Omit<ServiceMaster, "_id"> & {
  serviceWebImage: UploadFile[];
  serviceAppIcon: UploadFile[];
};

interface AddServiceFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const AddServiceForm: React.FC<AddServiceFormProps> = ({ onBack, onSuccess }) => {
  const [form] = Form.useForm<serviceFormValues>();

  const defaultCategories = [
    { value: "Residential Cleaning", label: "Residential Cleaning" },
    { value: "Commercial Cleaning", label: "Commercial Cleaning" },
  ];

  const [categoryOptions, setCategoryOptions] = useState(defaultCategories);

  const handleAdd = async (values: serviceFormValues) => {
    const formData = new FormData();

    for (const key in values) {
      if (key !== "serviceAppIcon" && key !== "serviceWebImage") {
        const val = values[key as keyof serviceFormValues];
        if (val !== undefined && val !== null) {
          formData.append(key, val as string);
        }
      }
    }

    const appFile = values.serviceAppIcon?.[0]?.originFileObj;
    const webFile = values.serviceWebImage?.[0]?.originFileObj;

    if (appFile instanceof File) formData.append("serviceAppIcon", appFile);
    if (webFile instanceof File) formData.append("serviceWebImage", webFile);

    await addServices(formData);

    message.success("Service added successfully!");
    form.resetFields();
    onSuccess();
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
        <AntButton icon={<ArrowLeftOutlined />} onClick={onBack} style={{ fontWeight: 500 }}>
          Back
        </AntButton>
        <Title level={4} style={{ margin: 0 }}>
          Add New Service
        </Title>
        <div style={{ width: 80 }} />
      </div>

      <div style={{ padding: 24, overflowY: "auto" }}>
        <Form layout="vertical" form={form} onFinish={handleAdd} colon={false}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="App Icon"
                name="serviceAppIcon"
                valuePropName="fileList"
                getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
              >
                <Upload listType="picture" beforeUpload={() => false}>
                  <AntButton icon={<UploadOutlined />}>Upload</AntButton>
                </Upload>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Service Code"
                name="serviceCode"
                rules={[{ required: true, message: "Enter service code" }]}
              >
                <Input placeholder="Enter the Service Code" style={{ width: 200 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Service Category"
                shouldUpdate
                rules={[{ required: true, message: "Select or enter category" }]}
              >
                {() => {
                  return (
                    <CreatableSelect
                      isClearable
                      options={categoryOptions}
                      onChange={(
                        newValue: SingleValue<{ value: string; label: string }>
                      ) => {
                        if (newValue) {
                          const exists = categoryOptions.find(
                            (opt) => opt.value === newValue.value
                          );
                          if (!exists) {
                            setCategoryOptions((prev) => [...prev, newValue]);
                          }
                          form.setFieldsValue({ serviceCategory: newValue.value });
                        } else {
                          form.setFieldsValue({ serviceCategory: undefined });
                        }
                      }}
                      onCreateOption={(inputValue: string) => {
                        const newOption = { value: inputValue, label: inputValue };
                        setCategoryOptions((prev) => [...prev, newOption]);
                        form.setFieldsValue({ serviceCategory: inputValue });
                      }}
                      formatOptionLabel={(data: any, { context }: any) => {
                        const isDefault = defaultCategories.some(
                          (d) => d.value === data.value
                        );
                        return context === "menu" ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>{data.label}</span>
                            {!isDefault && (
                              <CloseOutlined
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCategoryOptions((prev) =>
                                    prev.filter((option) => option.value !== data.value)
                                  );
                                  if (
                                    form.getFieldValue("serviceCategory") === data.value
                                  ) {
                                    form.setFieldsValue({
                                      serviceCategory: undefined,
                                    });
                                  }
                                }}
                                style={{
                                  fontSize: 12,
                                  color: "#999",
                                  marginLeft: 8,
                                  cursor: "pointer",
                                }}
                              />
                            )}
                          </div>
                        ) : (
                          data.label
                        );
                      }}
                    />
                  );
                }}
              </Form.Item>
              <Form.Item
                name="serviceCategory"
                noStyle
                rules={[{ required: true, message: "Service category is required" }]}
              >
                <Input type="hidden" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Web Images"
                name="serviceWebImage"
                valuePropName="fileList"
                getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
              >
                <Upload listType="picture" beforeUpload={() => false}>
                  <AntButton icon={<UploadOutlined />}>Upload</AntButton>
                </Upload>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Service Name"
                name="serviceName"
                rules={[{ required: true, message: "Enter service name" }]}
              >
                <Input placeholder="Enter the Service Name" style={{ width: 200 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Active Status"
                name="serviceActiveStatus"
                rules={[{ required: true, message: "Select status" }]}
              >
                <Select placeholder="Select status" style={{ width: 200 }}>
                  <Select.Option value={true}>Active</Select.Option>
                  <Select.Option value={false}>Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Price Type"
                name="priceType"
                rules={[{ required: true, message: "Select price type" }]}
              >
                <Select placeholder="Select price type" style={{ width: 200 }}>
                  <Select.Option value={true}>Hourly</Select.Option>
                  <Select.Option value={false}>Flat Rate</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Show‑off Price Tag" name="showoffPriceTag">
                <Input placeholder="Enter display price" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Current Active Price" name="currentActivePrice">
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Min Hours" name="minHours">
                <Input placeholder="e.g. 2" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Max Hours" name="maxHours">
                <Input placeholder="e.g. 4" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Min Persons Required"
                name="minPersonRequired"
                rules={[{ required: true, message: "Enter minimum persons" }]}
              >
                <Input placeholder="e.g. 1" style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Advertisement ID" name="serviceMappedAdvertisementUniqueId">
                <Input placeholder="Optional" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={16}>
              <Form.Item label="Service Detail" name="serviceDetail">
                <Input.TextArea rows={2} placeholder="Optional description" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: "left", marginTop: 16 }}>
            <Button variant="secondary" style={{ fontWeight: 500, padding: "6px 24px" }}>
              Submit
            </Button>
            <Button variant="outline" onClick={onBack} style={{ marginLeft: 12, fontWeight: 500, padding: "6px 24px" }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddServiceForm;
