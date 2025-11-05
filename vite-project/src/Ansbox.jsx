import React, { useState } from 'react'
import "./Infor.css";
import { Button, Input } from 'antd';
import { answer } from './api';

function Ansbox({ inf, close }) {
    const ans = {
        answerSets: [{
            answers: [{
                mediaItemName: "",
                start: "",
                end: ""
            }]
        }]
    }
        const infor = inf

    const [med, setMed] = useState(`${parseInt(infor.L) <= 20 ? "K" : "L"}${infor.L}_V${infor.V}`)
    const [end, setEnd] = useState(`${infor.mstime}`)

    return (
        <div className="overlay" style={{ zIndex: 9999 }}>
            <div className="content" style={{ width: "840px", height: "660px" }}>
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
                    placeholder="set mediaItemName"
                    value={med}
                    onChange={(e) => {
                        setMed(e.target.value)

                    }}
                />
                <Input
                    style={{ width: '320px', borderRadius: 8 }}
                    placeholder="set start-end"

                    onChange={(e) => {
                        setEnd(e.target.value)
                    }}
                />
                <Button onClick={async (e) => {
                    ans.answerSets[0].answers[0].mediaItemName = med
                    ans.answerSets[0].answers[0].start = end
                    ans.answerSets[0].answers[0].end = end
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

export default Ansbox