import { useEffect, useState } from 'react'

import thImage from "./th.jpg";
import './App.css'
import { getAlluser } from './api';
import {Avatar, Button, Table, } from 'antd'
import Teachers from './Teachers';
import Jobs from './Jobs';
function App() {

 const  [toogle1, setToogle1]= useState(true)
 const  [toogle2, setToogle2]= useState(false)

  


  return (
    <>
     <Button onClick={() => {
      setToogle1 (false)
      setToogle2 (true)
     }}>Công Việc</Button>
      <Button onClick={() => {
      setToogle2 (false)
      setToogle1 (true)
     }}>Giáo viên</Button>
     {toogle1 && <Teachers /> }
     {toogle2 && <Jobs /> }
     </>
  
  
      
   
  )
}

export default App
