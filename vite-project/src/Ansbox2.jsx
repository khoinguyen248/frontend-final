import React, { useState } from 'react'
import "./Infor.css";
import { Button, Input } from 'antd';
import { answer } from './api';

function Ansbox1({inf, close}) {
    const ans = {
        answerSets: [{
            answers: [{
                text: "TR-<VIDEO_ID>-<FRAME_ID1>,<FRAME_ID2>,..."
            }]
        }]
    }
    
    const infor = inf
    const [med, setMed] = useState(`${parseInt(infor.L) <= 20 ? "K" : "L"}${infor.L}_V${infor.V}`)
    const [frameIds, setFrameIds] = useState([""]) // Mảng chứa các frame ID
    const [anse, setAnse] = useState("")

    // Thêm ô input mới cho frame ID
    const addFrameInput = () => {
        setFrameIds([...frameIds, ""])
    }

    // Cập nhật frame ID cụ thể
    const updateFrameId = (index, value) => {
        const newFrameIds = [...frameIds]
        newFrameIds[index] = value
        setFrameIds(newFrameIds)
    }

    // Xóa ô input frame ID
    const removeFrameInput = (index) => {
        if (frameIds.length > 1) {
            const newFrameIds = frameIds.filter((_, i) => i !== index)
            setFrameIds(newFrameIds)
        }
    }

    // Lấy danh sách frame IDs đã nhập (loại bỏ các ô trống)
    const getFrameIdsString = () => {
        return frameIds.filter(id => id.trim() !== "").join(",")
    }

    return (
        <div className="overlay" style={{ zIndex: 9999 }}>
            <div className="content" style={{ width: "840px", height: "660px", overflowY: 'auto' }}>
                <Button
                    style={{ alignSelf: "flex-end" }}
                    onClick={() => close(false)}
                >
                    Close
                </Button>
                <p>{`${parseInt(infor.L) <= 20 ? "K" : "L"}${infor.L}_V${infor.V}`}</p>
                <p>{`${infor.mstime}`}</p>
                <div>{`${parseInt(infor.L) <= 20 ? "K" : "L"}: ${infor.L}${infor.V ? " - V: " + infor.V : ""} ${infor.frame_id ? "- " +infor.frame_id : ""} - ${infor.minute}m${infor.sec.toFixed(0)}s ${infor.fps} `} </div>
                
                <Input
                    style={{ width: '320px', borderRadius: 8, marginBottom: '20px' }}
                    placeholder="set video id"
                    value={med}
                    onChange={(e) => {
                        setMed(e.target.value)
                    }}
                />
                
                <Input
                    style={{ width: '320px', borderRadius: 8, marginBottom: '20px' }}
                    placeholder="set answer"
                    value={anse}
                    onChange={(e) => {
                        setAnse(e.target.value)
                    }}
                />

                {/* Phần quản lý multiple frame IDs */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <h4 style={{ margin: '0 10px 0 0' }}>Frame IDs:</h4>
                        <Button 
                            type="primary" 
                            size="small" 
                            onClick={addFrameInput}
                            style={{ marginRight: '10px' }}
                        >
                            + Thêm Frame
                        </Button>
                    </div>
                    
                    {frameIds.map((frameId, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <Input
                                style={{ width: '280px', borderRadius: 8, marginRight: '8px' }}
                                placeholder={`Frame ID ${index + 1}`}
                                value={frameId}
                                onChange={(e) => updateFrameId(index, e.target.value)}
                            />
                            <Button 
                                type="link" 
                                danger 
                                onClick={() => removeFrameInput(index)}
                                disabled={frameIds.length === 1}
                            >
                                Xóa
                            </Button>
                        </div>
                    ))}
                </div>

                <Button onClick={async (e) => {
                    const frameIdsString = getFrameIdsString()
                    ans.answerSets[0].answers[0].text = `TR-${med}-${frameIdsString}`
                    console.log(ans)
                    e.preventDefault();
                    const resp = await answer(ans)
                    const result = resp?.data
                    console.log(result)
                }}>
                    <p>Nộp nha ku</p>
                </Button>

            </div>
        </div>
    )
}

export default Ansbox1