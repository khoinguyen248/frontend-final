import { useEffect, useState } from 'react'
import { SaveOutlined } from "@ant-design/icons";
import { MdManageSearch } from "react-icons/md";
import { Select, Space } from "antd";
import thImage from "./th.jpg";
import './App.css'
import { Avatar, Table, Button, Drawer, Form, Radio, Input } from 'antd'
import ItemPalette from './ItemPalette';
import DropArea from './DropArea';
import { search } from './api';
import { Option } from 'antd/es/mentions';

function Jobs() {

  // items.js
  const availableItems = [
    { id: 'person', label: 'person', icon: '👤' },
    { id: 'man', label: 'man', icon: '👨' },
    { id: 'woman', label: 'woman', icon: '👩' },
    { id: 'human_face', label: 'human_face', icon: '🙂' },
    { id: 'motorcycle', label: 'motorcycle', icon: '🏍️' },
    { id: 'bicycle', label: 'bicycle', icon: '🚲' },
    { id: 'car', label: 'car', icon: '🚗' },
    { id: 'truck', label: 'truck', icon: '🚚' },
    { id: 'boat', label: 'boat', icon: '⛵' },
    { id: 'airplane', label: 'airplane', icon: '✈️' },
    { id: 'cat', label: 'cat', icon: '🐱' },
    { id: 'dog', label: 'dog', icon: '🐶' },
    { id: 'cow', label: 'cow', icon: '🐄' },
    { id: 'bird', label: 'bird', icon: '🐦' },
    { id: 'umbrella', label: 'umbrella', icon: '☂️' },
    { id: 'chair', label: 'chair', icon: '🪑' },
    { id: 'tv', label: 'tv', icon: '📺' },
    { id: 'laptop', label: 'laptop', icon: '💻' },
    { id: 'house', label: 'house', icon: '🏠' },
    { id: 'cell_phone', label: 'cell_phone', icon: '📱' },
    { id: 'flower', label: 'flower', icon: '🌸' },
    { id: 'tree', label: 'tree', icon: '🌳' },
    { id: 'book', label: 'book', icon: '📖' },
    { id: 'glasses', label: 'glasses', icon: '👓' },
    { id: 'cake', label: 'cake', icon: '🎂' },
    { id: 'horse', label: 'horse', icon: '🐎' },
    { id: 'sports_equipment', label: 'sports_equipment', icon: '🏋️' },
    { id: 'sports_ball', label: 'sports_ball', icon: '⚽' },
    { id: 'bench', label: 'bench', icon: '🪑' },
    { id: 'couch', label: 'couch', icon: '🛋️' },

    // Colors
    { id: 'black', label: 'black', icon: '⚫' },
    { id: 'white', label: 'white', icon: '⚪' },
    { id: 'red', label: 'red', icon: '🔴' },
    { id: 'green', label: 'green', icon: '🟢' },
    { id: 'yellow', label: 'yellow', icon: '🟡' },
    { id: 'blue', label: 'blue', icon: '🔵' },
    { id: 'brown', label: 'brown', icon: '🟤' },
    { id: 'purple', label: 'purple', icon: '🟣' },
    { id: 'pink', label: 'pink', icon: '🌸' },
    { id: 'orange', label: 'orange', icon: '🟠' },
    { id: 'gray', label: 'gray', icon: '⚙️' },
  ];
  const [status, setStatus] = useState("enabled");
  const [logic, setLogic] = useState("");
  const [text, setText] = useState("")
  const [droppedItems, setDroppedItems] = useState([]);
  const [droppedItems2, setDroppedItems2] = useState([]);
  const [listWorkers, setListWorkers] = useState()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [toogle, setToogle] = useState(false)
  const [screen1, setScreen1] = useState("");
  const [screen2, setScreen2] = useState("");
  const [obj, setObj] = useState("")
  const [model, setModel] = useState("")
  const [topk, setTopk] = useState(0)
  const [retrival, setRetrival] = useState([])
  const [isActive, setIsActive] = useState(true)
  const [isDeleted, setIsDeleted] = useState(true)
  const handleDrop = (item, position) => {
    setDroppedItems(prev => [
      ...prev,
      { ...item, position }
    ]);
  };
  const handleDrop2 = (item, position) => {
    setDroppedItems2(prev => [
      ...prev,
      { ...item, position }
    ]);
  };

  const handleRemove = (index) => {
    setDroppedItems(prev =>
      prev.filter((_, i) => i !== index)
    );
  };
  const handleRemove2 = (index) => {
    setDroppedItems2(prev =>
      prev.filter((_, i) => i !== index)
    );
  };
  const fetchOne = async () => {
    try {

      const respone = await getAlljobs()
      const data = await respone.data.data
      console.log(data)
      setListWorkers(data)

    }
    catch {
      console.log('error')
    }

  }

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const status = values.status;

    const newJob = {
      name: values.name,
      code: values.code,
      des: values.description,
      is_active: status === "active",
      is_deleted: status === "inactive",
    };

    try {
      const response = await addjobs(newJob);
      console.log(response.data);
      alert('Job created!');
      setToogle(false);
      form.resetFields();
      fetchOne();
    } catch (err) {
      console.error("Add job failed:", err.response?.data || err.message);
    }
  };




  // chuẩn hóa data thành từng hàng gồm 5 item
  const rows = [];
  for (let i = 0; i < retrival.length; i += 5) {
    rows.push(retrival.slice(i, i + 5));
  }

  // columns động: 5 cột
  const columns = Array.from({ length: 5 }, (_, idx) => ({
    title: `Item ${idx + 1}`,
    dataIndex: idx,
    key: idx,
    render: (item) =>
      item ? (
        <div style={{ textAlign: "center" }}>
          <img
            src={`http://localhost:8080/${item.path}`} // đường dẫn ảnh
            alt={`frame-${item.frame_id}`}
            style={{ width: 300, height: 150, objectFit: "cover" }}
          />
          <div>{`L: ${item.L} - V: ${item.V} - ${item.frame_id}`}</div>
        </div>
      ) : null,
  }));

  const dataSource = rows.map((row, index) => {
    const obj = { key: index };
    row.forEach((item, i) => {
      obj[i] = item;
    });
    return obj;
  });
  const [detection, setDetection] = useState(""); // detection từ DropArea

  // Gom object mỗi khi thay đổi





  const handleSubmit = async (e) => {
    e.preventDefault();
    const newjob = { name, des, code, isActive, isDeleted };

    try {


      const response = await addjobs(newjob);
      console.log(response.data);
      alert('job created !')


    } catch (err) {

      console.error("Signup failed:", err.response?.data || err.message);


    }
  }

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '23%' }}>
          <div style={{


            height: '100vh',
            backgroundColor: '#fff',
            borderRight: '1px solid #ddd',
            overflowY: 'auto',
            width: '100%',

          }}>
            <div className='header' style={{ width: '100%', height: '10%', borderBottom: "1px solid #d9d9d9", borderTop: "none", borderLeft: "none", borderRight: "none" }}>      <h1 style={{ fontFamily: 'sans-serif', marginLeft: '10px' }}>Advanced Searching</h1></div>


            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                fontFamily: 'sans-serif'
              }}
            >
              <ItemPalette items={availableItems} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {/* Group Enabled / Disabled */}

                <Radio.Group
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                >
                  <Space >


                    <Radio value="enabled">Enabled</Radio>
                    <Radio value="disabled">Disabled</Radio>
                  </Space>
                </Radio.Group>

                {/* Group AND / OR */}
                <div>

                  <Radio.Group
                    onChange={(e) => setLogic(e.target.value)}
                    value={logic}
                  >
                    <Space >
                      <Radio value="AND">AND</Radio>
                      <Radio value="OR">OR</Radio>
                    </Space>
                  </Radio.Group>
                </div>
              </div>
              <DropArea

                droppedItems={droppedItems}
                onDrop={handleDrop}
                onRemove={handleRemove}
                onStateChange={setDetection}
              />
              <Input
                style={{ width: '93%' }}
                placeholder='Object fillin'
                value={obj}
                onChange={(e) => {
                  setObj(e.target.value);
                  console.log("Obj:", e.target.value);
                }}
              />

              <Input
                style={{ width: '93%' }}
                placeholder='Text indicator'
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  console.log("text:", e.target.value);
                }}
              />

            </div>
          </div>

        </div>
        <div style={{ width: '76%', paddingLeft: '10px' }}>
          <div style={{ width: '100%', margin: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>



            <Input
              style={{ width: '35%' }}
              placeholder='Screen 1'
              value={screen1}
              onChange={(e) => {
                setScreen1(e.target.value);
                console.log("Screen1:", e.target.value);
              }}
            />

            <Input
              style={{ width: '35%' }}
              placeholder='Screen 2'
              value={screen2}
              onChange={(e) => {
                setScreen2(e.target.value);
                console.log("Screen2:", e.target.value);
              }}
            />
            <Input
              style={{ width: '10%' }}
              placeholder='set top-K'
              value={topk}
              onChange={(e) => {
                setTopk(e.target.value);
                console.log("Topk: ", e.target.value);
              }}
            />
            <Select
              style={{ width: '10%' }}
              value={model}
              onChange={(value) => setModel(value)}
            >
              <Option value="beit3">beit3</Option>
              <Option value="clip">clip</Option>
            </Select>
            <Button onClick={async (e) => {
              e.preventDefault();


              if (screen1 === "" && screen2 === "") {
                const searchObject = {
                  k: topk,
                  detection: detection,
                  objects: obj,
                  device: "cpu",
                  operator: logic,
                  page: 1,
                  page_size: 10,
                  model: model,
                  augment: false
                }
                console.log("Search Object:", searchObject);
                try {

                  const respone = await search(searchObject)
                  const result = respone.data
                  setRetrival(result)
                  console.log(result)
                } catch (err) {
                  console.error("Signup failed:", err.response?.data || err.message);

                }

              } else {
                const searchObject = {
                  query1: screen1,
                  query2: screen2,
                  model: model,
                  k: topk,
                  augment: false,
                  detection: detection,   // lấy từ DropArea
                  objects: obj,
                  device: "cpu",
                  operator: logic,
                  page: 1,
                  page_size: 10
                };
                console.log("Search Object:", searchObject);
                try {

                  const respone = await search(searchObject)
                  const result = respone.data.paths
                  setRetrival(result)
                  console.log(result)
                } catch (err) {
                  console.error("Signup failed:", err.response?.data || err.message);

                }

              }



            }} title="Activate advanced searching">
              <MdManageSearch size={20} />

            </Button>


          </div>

          <div>
            {/*trong retrival có bao nhiêu item thì hiển thị 5 item 1 hàng, nội dung của từng cột sẽ là ảnh 120X60 lấy từ path của mỗi item, phía dưới mỗi ảnh sẽ để L - V*/}
            <Table
              style={{ width: "100%", margin: "auto" }}
              dataSource={dataSource}
              columns={columns}
              pagination={{
                current: page,
                pageSize: pageSize,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                  setPage(page);
                  setPageSize(pageSize);
                },
              }}
            />

          </div>

        </div>
      </div>










    </>



  )
}

export default Jobs
