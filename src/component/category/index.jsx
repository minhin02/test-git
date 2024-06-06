import { Button, Form, Input, Modal, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CgSlack } from "react-icons/cg";

function Category() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = async (values) => {
    console.log("Success:", values);
    const response = await axios.post(
      "https://665d6f09e88051d604068e77.mockapi.io/category",
      values
    );
    setData([...data, response.data]);
    console.log(response.data);
    setIsModalOpen(false);
    //add xong render lai man hinh data moi nhat thi state phai thay doi
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];
  const [data, setData] = useState([]);
  const fetchData = async () => {
    const response = await axios.get(
      "https://665d6f09e88051d604068e77.mockapi.io/category"
    );

    console.log(response.data);
    setData(response.data);
  };
  // chay moi khi load trong web ,chạy 1 lần duy nhất
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleDelete = async (values) => {
    console.log(values);
    const response = await axios.delete(
      `https://665d6f09e88051d604068e77.mockapi.io/category/${values.id}`
    );
    setData(data.filter((data) => data.id != values.id));
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "category name",
    },
    {
      title: "Action",
      render: (values) => (
        <Button onClick={() => handleDelete(values)} danger type="primary">
          Delete
        </Button>
      ),
    },
  ];
  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Add New category
      </Button>
      <Modal
        footer={false}
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Category name"
            name="categoryName"
            rules={[
              {
                required: true,
                message: "Please input your category name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table dataSource={data} columns={columns} />;
    </div>
  );
}

export default Category;
