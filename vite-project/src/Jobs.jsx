import { useEffect, useState } from 'react'
import { SaveOutlined } from "@ant-design/icons";

import thImage from "./th.jpg";
import './App.css'
import { addjobs, getAlljobs } from './api';
import {Avatar, Table, Button, Drawer, Form, Radio, Input} from 'antd'
function Jobs() {

 

 

  const [listWorkers, setListWorkers] = useState()
  const[page, setPage] = useState(1)
  const[pageSize, setPageSize] = useState(10)
  const [toogle, setToogle] = useState(false)

  const[name, setName] = useState('')
  const[code, setCode ]= useState('')
  const[des, setDes] = useState('')
  const[isActive, setIsActive] = useState(true)
  const[isDeleted, setIsDeleted] = useState(true)

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

  const onFinish = (values) => {
    console.log("Form values:", values);
  };
  
  const columns = [
    {
        key: "1",
        title: "STT",
        render: (text, record, index) => index + 1, // index sẽ bắt đầu từ 0, cộng thêm 1 để bắt đầu từ 1
      },
    {
      key:"2", 
      title:'Mã', 
      dataIndex: 'code',
     
    },
    {
      key:"3",
      title:'Tên',
      dataIndex: 'name',
      
    },
    {
      key:"4",
      title:'Trạng thái',
      dataIndex: 'isActive',
      render: (isActive) => (
<>         {isActive  ? <p style={{backgroundColor:'green', width:'120px', textAlign:'center', color:'white'}}>Đang hoạt động</p> : <p>Dừng hoạt động</p> }
</>
      )

      
      
    },
    {
      key:"5",
      title:'Mô tả',
      dataIndex: 'des'
    },
    {
      key:"6",
      
     render: ()=>(
        <button>Chỉnh</button>
     )
      
    },

  ]
  useEffect(() => {
    fetchOne()
  },[])



  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newjob = {name, des, code, isActive, isDeleted };

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
    <div style={{width: '85%', margin: 'auto', display:'flex', justifyContent:'flex-end'}}><Button onClick={() => {
        setToogle(true) 
    }}>
Tạo mới
</Button>
<Button onClick={fetchOne}>Refresh</Button>

</div>
    
   <Table style={{width: '85%', margin: 'auto'}} dataSource={listWorkers} columns={columns} pagination={{
     current: page,
     pageSize: pageSize,
     showSizeChanger: true,
     onChange:(page, pageSize)=> {
      setPage(page),
      setPageSize(pageSize)
     }

   }}/>
    
    <Drawer visible={toogle} title="Vị trí công tác" onClose={() => {
        setToogle(false)
    }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item label="Mã" name="code" value={code} onChange={(e) => setCode(e.target.value)} rules={[{ required: true, message: "Vui lòng nhập mã!" }]}> 
        <Input />
      </Form.Item>

      <Form.Item label="Tên" name="name" value={name } onChange={(e) => setName(e.target.value)} rules={[{ required: true, message: "Vui lòng nhập tên!" }]}> 
        <Input />
      </Form.Item>

      <Form.Item label="Mô tả" name="description" value={des} onChange={(e) => setDes(e.target.value)}> 
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item label="Trạng thái" name="status" initialValue="active">
        <Radio.Group>
          <Radio.Button value="active" onChange={() => setIsActive(true)}>Hoạt động</Radio.Button>
          <Radio.Button value="inactive" onChange={() => setIsDeleted(true)}>Ngừng</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} onClick={handleSubmit} >Lưu</Button>
      </Form.Item>
    </Form>
    </Drawer>
    </>
  
      
   
  )
}

export default Jobs
