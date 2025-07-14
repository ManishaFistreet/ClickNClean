import React from 'react';
import {
    Form,
    Input,
    DatePicker,
    Row,
    Col,
    Typography,
    message,
    Select,
} from "antd";
import dayjs from 'dayjs';
import Button from '../../components/Button';

const { Title } = Typography;
const { Option } = Select;

interface RequestFormValues {
    name: string;
    email: string;
    serviceCategory: 'residential' | 'commercial';
    address: string;
    phone: string;
    date: dayjs.Dayjs;
}
const RequestForm: React.FC = () => {
    const [form] = Form.useForm<RequestFormValues>();

    const handleFinish = (values: RequestFormValues) => {
        const payload = {
            ...values,
            date: values.date ? values.date.format('YYYY-MM-DD HH:mm') : null,
        };

        console.table(payload);
        message.success("Request submitted!");
        form.resetFields();
    };

    return (
        <div
            style={{
                maxWidth: 1000,
                margin: "0 auto",
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                height: "75vh",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "16px 24px",
                    borderBottom: "1px solid #f0f0f0",
                    background: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Title level={4} style={{ margin: 0 }}>
                    Request Service
                </Title>
            </div>

            {/* Form */}
            <div style={{ padding: 24, overflowY: "auto" }}>
                <Form layout="vertical" form={form} onFinish={handleFinish}>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="name"
                                label="Customer Name"
                                rules={[{ required: true, message: 'Please enter your name' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email Address"
                                rules={[
                                    { required: true, message: 'Please enter email' },
                                    { type: 'email', message: 'Not a valid email' },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="serviceCategory"
                                label="Cleaning Category"
                                rules={[{ required: true, message: 'Please select a category' }]}
                            >
                                <Select placeholder="Select category">
                                    <Option value="residential">Residential Cleaning</Option>
                                    <Option value="commercial">Commercial Cleaning</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="address"
                                label="Full Address"
                                rules={[{ required: true, message: 'Please enter address' }]}
                            >
                                <Input.TextArea rows={2} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="phone"
                                label="Phone Number"
                                rules={[{ required: true, message: 'Please enter your phone' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="date"
                                label="Preferred Cleaning Date"
                                rules={[{ required: true, message: 'Please pick a date' }]}
                            >
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    style={{ width: '100%' }}
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ textAlign: "left", marginTop: 16 }}>
                        <Button variant='secondary' style={{ padding: "6px 24px" }}>
                            Submit
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => form.resetFields()}
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

export default RequestForm;
