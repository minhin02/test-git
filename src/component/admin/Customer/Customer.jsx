// src/components/CustomTable/CustomTable.js

import { Flex, Table } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import HeaderSearch from "../../../components/Header/HeaderSearch/HeaderSearch";
import CreateCustomerForm from "../../../components/modal/CreateCustomerForm";
import {
    createCustomer,
    getAllCustomer,
    getCustomerByPhone,
} from "../../../service/customer";
import useDebounce from "../../../hook/debound";

const TableStall = () => {
    const [customerData, setCustomerData] = useState([]);
    const [searchCustomer, setSearchCustomer] = useState("");
    const debouncedSearcCustomer = useDebounce(searchCustomer, 500);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!debouncedSearcCustomer.lenght)
            getAllCustomer()
                .then((data) => data.data)
                .then((data) => setCustomerData(data));
    }, [debouncedSearcCustomer]);
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "NAME",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "PHONE",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "CREATE TIME",
            dataIndex: "createTime",
            key: "createTime",
            render: (text) => new Date(text).toLocaleString("vi-VN"),
        },
        {
            title: "RANK",
            dataIndex: "rankCus",
            key: "rankCus",
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            render: (text, record) => (
                <Flex align="center" gap={6} justify="center">
                    <span
                        style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: text ? "green" : "red",
                        }}
                    >
                        {record.status ? "ON" : "OFF"}
                    </span>
                </Flex>
            ),
        },
    ];
    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleSave = async (values) => {
        const formData = {
            name: values.name,
            phone: values.phone,
        };

        try {
            const res = await createCustomer(formData);
            if (res) {
                toast.success("Create customer successfully");
                await getAllCustomer()
                    .then((data) => data.data)
                    .then((data) => setCustomerData(data));
            }
        } catch (error) {
            toast.error(
                error.response?.data?.phone ||
                    error.response?.data?.name ||
                    "Create customer failed"
            );
        } finally {
            setVisible(false);
        }
    };
    const handleChange = async (value) => {
        setSearchCustomer(value);
    };
    useEffect(() => {
        try {
            console.log(debouncedSearcCustomer);
            if (debouncedSearcCustomer) {
                getCustomerByPhone({ phone: debouncedSearcCustomer })
                    .then((res) => res.data)
                    .then((data) => setCustomerData([data]));
            }
        } catch (error) {}
    }, [debouncedSearcCustomer]);
    return (
        <>
            <HeaderSearch
                onChange={handleChange}
                searchValue={searchCustomer}
            />
            <button className="btn-add" onClick={showModal}>
                Add new customer
            </button>
            <Table
                dataSource={customerData.reverse()}
                columns={columns}
                pagination={{ defaultPageSize: 4 }}
            />
            <CreateCustomerForm
                visible={visible}
                onCancel={handleCancel}
                onSave={handleSave}
            />
        </>
    );
};

export default TableStall;
