import { EditOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import { BiBookReader } from "react-icons/bi";
import { toast } from "react-toastify";
import MetalForm from "../../../components/modal/MetalForm";
import { getAllMetal, updateMetal } from "../../../service/metalPriceService";
import "./metal.css";

const Metal = () => {
    const [visible, setVisible] = useState(false);
    const [dataMetal, setDataMetal] = useState([]);
    const [dataUpdate, setDataUpdate] = useState();
    const [indexView, setIndexView] = useState(0);
    useEffect(() => {
        const fetchMetal = async () => {
            const response = await getAllMetal();
            setDataMetal(response.data);
        };
        fetchMetal();
    }, []);
    const showModal = (record) => {
        setVisible(true);
        setDataUpdate(record);
    };

    const handleCancel = () => {
        setDataUpdate(null);
        setVisible(false);
    };

    const handleSave = async (values) => {
        try {
            const response = await updateMetal({ formData: values });
            if (response.data) {
                toast.success("Cập nhật thành công");
                const newMetal = await getAllMetal();
                setDataMetal(newMetal.data);
            }
        } catch (err) {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
        } finally {
            setVisible(false);
        }
    };
    const columns = [
        {
            title: "ID",
            dataIndex: "metalPriceId",
            key: "metalPriceId",
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updateDate",
            key: "updateDate",
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text) => (
                <span> {text ? "Hoạt động" : "Ngưng hoạt động"}</span>
            ),
        },
        {
            title: "Danh sách metals",
            dataIndex: "typeOfMetals",
            key: "typeOfMetals",
            render: (text) => <span> {text.length} metal</span>,
        },
        {
            title: "Action",
            key: "actions",
            render: (text, record) => (
                <>
                    <Button
                        onClick={() => showModal(record)}
                        type="link"
                        icon={<EditOutlined />}
                    />
                    <Button
                        style={{
                            border: "none",
                            textDecoration: "underline",
                            padding: 0,
                        }}
                        type="link"
                        onClick={() => {
                            setIndexView(record);
                            toast.info("bạn vừa chuyển sang chi tiết metal");
                        }}
                    >
                        Chi tiết
                    </Button>
                </>
            ),
        },
    ];
    const columnsTypeOfMetals = [
        {
            title: "ID",
            dataIndex: "metalPriceId",
            key: "metalPriceId",
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updateDate",
            key: "updateDate",
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text) => (
                <span> {text ? "Hoạt động" : "Ngưng hoạt động"}</span>
            ),
        },
        {
            title: "metalType",
            dataIndex: "metalType",
            key: "metalType",
        },
        {
            title: "sellPrice",
            dataIndex: "sellPrice",
            key: "sellPrice",
        },
        {
            title: "buyPrice",
            dataIndex: "buyPrice",
            key: "buyPrice",
        },
    ];
    return (
        <>
            {indexView.typeOfMetals ? (
                <>
                    <button
                        className="btn-add"
                        onClick={() => {
                            setIndexView([]);
                            toast.info("bạn vừa trở về xem danh sách");
                        }}
                    >
                        trở lại
                    </button>
                    <Table
                        Headers={"Chi tiết"}
                        dataSource={indexView.typeOfMetals}
                        columns={columnsTypeOfMetals}
                    />
                </>
            ) : (
                <Table
                    dataSource={dataMetal.reverse()}
                    columns={columns}
                    pagination={{ defaultPageSize: 3 }}
                />
            )}

            <MetalForm
                onCancel={handleCancel}
                onSave={handleSave}
                visible={visible}
                initialData={dataUpdate}
            />
        </>
    );
};

export default Metal;
