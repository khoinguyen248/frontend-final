import { useEffect, useState } from 'react'
import thImage from "./th.jpg";
import './App.css'
import { addteacher, getAlluser } from './api';
import {Avatar, Table, Drawer, Button} from 'antd'
import { Form, Input, DatePicker, Select, Upload, Checkbox, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import moment from 'moment';

function Teachers() {

 

  const [form] = Form.useForm();

  const [listWorkers, setListWorkers] = useState()
  const[page, setPage] = useState(1)
  const[pageSize, setPageSize] = useState(10)

   
  const handleSubmit = async (values) => {
    const formattedData = {
      name: values.name,
      email: values.email,
      phoneNumber: values.phoneNumber,
      address: values.address,
      identity: values.identity,
      dob: moment(values.dob).format('YYYY-MM-DD'),
      code: values.code?.[0] || '', // Lấy giá trị đầu tiên nếu là mảng
      degrees: values.degrees?.map(degree => ({
        type: degree.type,
        school: degree.school,
        major: degree.major,
        year: parseInt(degree.year, 10),
        isGraduated: degree.isGraduated || false
      })) || []
    };
    
    console.log(formattedData);
    try{
      await addteacher(formattedData);
    
      await fetchOne();
      
      setToogle(false);
      form.resetFields();
    }catch(err){
      
    }
    
  };
 
  const fetchOne = async () => {
    try {
      
      const respone = await getAlluser()
      const data = await respone.data.data
      console.log(data)
      setListWorkers(data)
      
    }
    catch {
      console.log('error')
    }

  }
  
  const [toogle, setToogle] = useState(false)

  const columns = [
    {
      key:"1",
      title:'Mã',
      dataIndex: 'identity'
    },
    {
      key:"2", 
      title:'Giáo viên', 
      dataIndex: 'inf',
      render: (inf) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar src={thImage} style={{ marginRight: 8 }} />
          <div style={{ display: "flex", flexDirection: 'column' }}>
            <div style={{ fontWeight: "bold" }}>{inf.name}</div>
            <div style={{ color: "#888" }}>{inf.email}</div>
            <div>{inf.phone}</div>
          </div>
        </div>
      ),
    },
    {
      key:"3",
      title:'Trình độ (cao nhất)',
      dataIndex: 'degrees',
      render: (degrees) => (
        <>
        <div style={{ display: "flex", flexDirection: 'column' }}>
          <p>Bậc: {degrees[0].type}</p>
          <p>Chuyên ngành: {degrees[0].major}</p>
        </div>
        </>
      )
    },
    {
      key:"4",
      title:'TT Công tác',
      dataIndex: 'positions'
    },
    {
      key:"5",
      title:'Địa chỉ',
      dataIndex: 'address'
    },
    {
      key:"6",
      title: "Tình trạng",
      dataIndex:"isDeleted",
      render: (isDeleted) => (
        <>
        {!isDeleted  ? <p style={{backgroundColor:'green', width:'120px', textAlign:'center', color:'white'}}>Đang hoạt động</p> : <p>Dừng hoạt động</p> }
        </>
      )
    },

    {
      key:"6",
      title: "Hiệu chỉnh",
      dataIndex:"",
      render: () => (
        <>
        <button>Chi tiết</button>
        </>
      )
    }
  ]
  useEffect(() => {
    fetchOne()
  },[])

  const { Option } = Select;
  const [fields, setFields] = useState([{ id: 0 }]);
  const [name, setName] = useState()
  const [email, setEmail]= useState()
  const [address, setAddress]= useState()
  const [cmnd, setCmnd]= useState()

  const [code, setCode]= useState()
  const [dob , setDob]= useState()
  const [startDate, setStartDate]= useState()

  const [degrees, setDegrees] = useState()

  
  
  

  const addField = () => {
    setFields([...fields, { id: Date.now() }]);
  };

  const removeField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const [hooks, setHooks] = useState(false)

  return (
    <>

     
<div style={{width: '85%', margin: 'auto', display:'flex', justifyContent:'flex-end'}}><Button onClick={() => {
        setToogle(true) 
    }}>
Tạo mới
</Button></div>
    
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
    }} style={{ margin: "auto" }}  width={window.innerWidth / 1.5}>
          <Form layout="vertical" style={{ maxWidth: 800, margin: "auto" }} onFinish={handleSubmit}>
      <Form.Item label="Upload file" valuePropName="fileList">
        <Upload action="/upload.do" listType="picture">
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      </Form.Item>
      
      <Form.Item 
  label="Họ và tên" 
  name="name" // Thay đổi từ fullname -> name
  rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
>
  <Input placeholder="VD: Nguyễn Văn A" />
</Form.Item>

      <Form.Item label="Ngày sinh" name="dob" rules={[{ required: true }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item 
  label="Số điện thoại" 
  name="phoneNumber" // Thay đổi từ phone -> phoneNumber
  rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
>
  <Input placeholder="Nhập số điện thoại" />
</Form.Item>

      <Form.Item label="Email" name="email" rules={[{ required: true, message: "Vui lòng nhập email" }]}>
        <Input placeholder="example@school.edu.vn" />
      </Form.Item>

      <Form.Item 
  label="Số CCCD" 
  name="identity" // Thay đổi từ cccd -> identity
  rules={[{ required: true, message: "Vui lòng nhập số CCCD" }]}
>
  <Input placeholder="Nhập số CCCD" />
</Form.Item>

      <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Vui lòng nhập Địa chỉ thường trú" }]}>
        <Input placeholder="Địa chỉ thường trú" />
      </Form.Item>

      <Form.Item label="Vị trí công tác" name="code">
        <Select mode="multiple" placeholder="Chọn các vị trí công tác">
          <Option value="TTS">TTS - Thực tập sinh</Option>
          <Option value="GVBM">GVBM - Giáo viên bộ môn</Option>
          <Option value="TBM">TBM - Trưởng bộ môn</Option>
          <Option value="HT">HT - Hiệu trưởng</Option>
          <Option value="HP">HP - Hiệu phó</Option>
          <Option value="CBYT">CBYT - Cán bộ y tế</Option>
        </Select>
      </Form.Item>

      <Form.List name="degrees">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'type']}
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Bậc">
                        <Option value="Thạc sĩ">Thạc sĩ</Option>
                        <Option value="Cử nhân">Cử nhân</Option>
                      </Select>
                    </Form.Item>
                    
                    <Form.Item
                      {...restField}
                      name={[name, 'school']}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Trường" />
                    </Form.Item>
                    
                    <Form.Item
                      {...restField}
                      name={[name, 'major']}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Chuyên ngành" />
                    </Form.Item>
                    
                    <Form.Item
                      {...restField}
                      name={[name, 'year']}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Năm" type="number" />
                    </Form.Item>
                    
                    <Form.Item
                      {...restField}
                      name={[name, 'isGraduated']}
                      valuePropName="checked"
                    >
                      <Checkbox>Hoàn thành</Checkbox>
                    </Form.Item>
                    
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Thêm học vị
                </Button>
              </>
            )}
          </Form.List>


          <Form.Item>
            <Button type="primary" htmlType="submit">Gửi</Button>
          </Form.Item>
    </Form>
    </Drawer>
    
    </>
  
      
   
  )
}

export default Teachers
