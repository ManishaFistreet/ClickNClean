import React from "react";
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Upload,
  Button as AntButton,
  Row,
  Col,
  Typography,
  message,
  Select,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { Dayjs } from "dayjs";
import type { ServiceShowcase } from "../../types/services";
import { addShowcaseAd } from "../../api/ServiceApi";
import Button from "../../components/Button";

const { Title } = Typography;
const { Option } = Select;

interface AddAdvertisementFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

type FormValues = Omit<ServiceShowcase, "_id" | "adImageApp" | "adImageWeb" | "showcaseStartDate" | "showcaseEndDate" | "showcaseStartTime" | "showcaseEndTime"> & {
  adImageApp?: UploadFile[];
  adImageWeb?: UploadFile[];
  showcaseStartDate?: Dayjs;
  showcaseEndDate?: Dayjs;
  showcaseStartTime?: Dayjs;
  showcaseEndTime?: Dayjs;
};

export interface AddShowcasePayload extends Omit<ServiceShowcase, "_id" | "showcaseStartDate" | "showcaseEndDate" | "showcaseStartTime" | "showcaseEndTime"> {
  showcaseStartDate: string | null;
  showcaseEndDate: string | null;
  showcaseStartTime: string | null;
  showcaseEndTime: string | null;
};


const AddAdvertisementForm: React.FC<AddAdvertisementFormProps> = ({ onBack, onSuccess }) => {
  const [form] = Form.useForm<FormValues>();

const handleFinish = async (values: FormValues) => {
  try {
    const payload = {
      uniqueId: values.uniqueId,
      adTitle: values.adTitle,
      adDetail: values.adDetail || "",
      adActiveStatus: values.adActiveStatus,
      showcaseStartTime: values.showcaseStartTime?.format("HH:mm") || null,
      showcaseEndTime: values.showcaseEndTime?.format("HH:mm") || null,
      showcaseStartDate: values.showcaseStartDate?.format("YYYY-MM-DD") || null,
      showcaseEndDate: values.showcaseEndDate?.format("YYYY-MM-DD") || null,
      adPriceId: values.adPriceId || "",
      adImageApp: values.adImageApp?.[0]?.originFileObj?.name || "",
      adImageWeb: values.adImageWeb?.[0]?.originFileObj?.name || "",
    };

    await addShowcaseAd(payload);
    message.success("Advertisement submitted successfully!");
    form.resetFields();
    onBack();
    onSuccess();
  } catch (error) {
    console.error("Submission Error:", error);
    message.error("Failed to submit advertisement.");
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
        <AntButton icon={<ArrowLeftOutlined />} onClick={onBack} style={{ fontWeight: 500 }}>
          Back
        </AntButton>
        <Title level={4} style={{ margin: 0 }}>
          Add New Advertisement
        </Title>
        <div style={{ width: 80 }} />
      </div>

      {/* Form */}
      <div style={{ padding: 24, overflowY: "auto" }}>
        <Form layout="vertical" form={form} onFinish={handleFinish} colon={false}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Ad Image (Web)"
                name="adImageWeb"
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
                label="Unique ID"
                name="uniqueId"
                rules={[{ required: true, message: "Please enter unique ID" }]}
              >
                <Input placeholder="Unique ID" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Ad Active Status" name="adActiveStatus">
                <Select placeholder="Select status" style={{ width: 200 }}>
                  <Option value={true}>Active</Option>
                  <Option value={false}>Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Ad Image (App)"
                name="adImageApp"
                valuePropName="fileList"
                getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
              >
                <Upload listType="picture" beforeUpload={() => false}>
                  <AntButton icon={<UploadOutlined />}>Upload</AntButton>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Ad Price ID" name="adPriceId">
                <Input placeholder="Linked Price Master ID" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Ad Title"
                name="adTitle"
                rules={[{ required: true, message: "Please enter title" }]}
              >
                <Input placeholder="Ad Title" style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Showcase Start Time" name="showcaseStartTime">
                <TimePicker format="HH:mm" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Showcase End Time" name="showcaseEndTime">
                <TimePicker format="HH:mm" style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Showcase Start Date" name="showcaseStartDate">
                <DatePicker style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Showcase End Date" name="showcaseEndDate">
                <DatePicker style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={16}>
              <Form.Item label="Ad Detail" name="adDetail">
                <Input.TextArea
                  rows={2}
                  placeholder="e.g. 50% off for new users!"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: "left", marginTop: 16 }}>
            <Button variant="secondary"style={{ padding: "6px 24px" }}>
              Submit
            </Button>
            <Button  variant="outline" onClick={onBack} style={{ marginLeft: 12, padding: "6px 24px" }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddAdvertisementForm;