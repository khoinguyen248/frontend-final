// Jobs.jsx
import { useEffect, useState } from 'react'
import { MdManageSearch } from "react-icons/md";
import { Select, Space } from "antd";
import './App.css'
import { Table, Button, Drawer, Form, Radio, Input } from 'antd'
import ItemPalette from './ItemPalette';
import DropArea from './DropArea';
import { search } from './api';
import { Option } from 'antd/es/mentions';
import { MenuOutlined } from "@ant-design/icons";
import { CiLink } from "react-icons/ci";
import Infor from './Infor';
import { FaFolderOpen } from "react-icons/fa";

function Jobs() {
  const [drawerOpen, setDrawerOpen] = useState(true); // mở mặc định
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  // palette items
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
    { id: 'traffic_sign', label: 'traffic_sign', icon: '🚸' }
  ];

  // UI state
  const [status, setStatus] = useState(false);
  const [logic, setLogic] = useState("AND");
  const [text, setText] = useState("")
  const [droppedItems, setDroppedItems] = useState([]);
  const [droppedItems2, setDroppedItems2] = useState([]);
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [screen1, setScreen1] = useState("");
  const [screen2, setScreen2] = useState("");
  const [screen3, setScreen3] = useState("");
  const [buttonflag, setButtonflag] = useState(false)
  const [tempFuzzy, setTempFuzzy] = useState(-1)

  const [selectedFrame, setSelectedFrame] = useState(null);

  const [mondalFLag, setModalFlag] = useState(false)

  const [obj, setObj] = useState("")
  const [model, setModel] = useState("beit3")
  const [topk, setTopk] = useState(100)
  const [retrival, setRetrival] = useState([]) // array of objects {path, L, V, frame_id, ...}
  const [detection, setDetection] = useState(""); // detection từ DropArea

  // Drop handlers
  const handleDrop = (item, position) => {
    setDroppedItems(prev => [...prev, { ...item, position }]);
  };
  const handleDrop2 = (item, position) => {
    setDroppedItems2(prev => [...prev, { ...item, position }]);
  };
  const handleRemove = (index) => setDroppedItems(prev => prev.filter((_, i) => i !== index));
  const handleRemove2 = (index) => setDroppedItems2(prev => prev.filter((_, i) => i !== index));

  const [form] = Form.useForm();

  // normalize retrieval into rows of 5
  const rows = [];
  for (let i = 0; i < retrival.length; i += 5) {
    rows.push(retrival.slice(i, i + 5));
  }

  // columns dynamic: 5 columns
  const columns = Array.from({ length: 5 }, (_, idx) => ({
    title: `Item ${idx + 1}`,
    dataIndex: idx,
    key: idx,
    render: (item) => {
      if (!item) return null;

      // Normalize different possible shapes:
      // - string path: "keyframes/..."
      // - object: { path: "...", L: "21", V: "001", frame_id: 26, ... }
      // - sometimes backend might return absolute url in path
      const isString = typeof item === "string";
      let pathVal = isString ? item : (item.path || item.url || item.path_full || item.src || "");
      // If item is something like { idx: 123 } and metadata path missing, we can't render image
      // pathVal could also accidentally be an object; coerce to string
      if (pathVal && typeof pathVal !== "string") pathVal = String(pathVal);

      const imageUrl = pathVal
        ? (pathVal.startsWith("http://") || pathVal.startsWith("https://")
          ? pathVal
          : `http://localhost:8080/${pathVal.replace(/^\/+/, '')}`)
        : null;

      // metadata fields
      const L = !isString && item && item.L ? item.L : "";
      const V = !isString && item && item.V ? item.V : "";
      const frame_id = !isString && item && item.frame_id ? item.frame_id : (pathVal ? pathVal.split('/').pop() : "");
      const url = item.video_url
      const time = item.frame_stamp
      const mathfloor = Math.floor(time)
      let minute = Math.floor(time / 60)
      let sec = (time - 60 * minute)

      return (
        <div style={{ textAlign: "center" }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`frame-${frame_id}`}
              style={{ width: 300, height: 150, objectFit: "cover" }}
              onError={(e) => { e.currentTarget.src = ""; }}
            />
          ) : (
            <div style={{ width: 300, height: 150, display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f0f0" }}>
              No preview
            </div>
          )}
          <div>{`${parseInt(L) <= 20 ? "K" : "L"}: ${L}${V ? " - V: " + V : ""} ${frame_id ? "- " + frame_id : ""} - ${minute}m${sec.toFixed(0)}s `}  <a href={`${url}&t=${time}s`} target="_blank"
            rel="noopener noreferrer"><CiLink /></a></div>
          <FaFolderOpen onClick={() => {
            setModalFlag(true);
            setSelectedFrame({
              idx: item.idx,
              L: item.L,
              V: item.V
            });
          }} />





        </div>
      );
    }
  }));

  const dataSource = rows.map((row, index) => {
    const obj = { key: index };
    row.forEach((item, i) => {
      obj[i] = item;
    });
    return obj;
  });

  // Helper to call backend and normalize response
  const doSearch = async (payload) => {
    try {
      console.log("Sending search payload:", payload);
      const resp = await search(payload);

      // normalize possible response locations
      console.log(resp)
      const data = resp?.data ?? {};
      console.log("Raw server response:", data);

      // Prefer 'paths', fallback to 'data.paths', 'result', or top-level array
      let result = data.paths ?? data.result ?? data.data ?? data;

      // If result is object that contains paths
      if (result && typeof result === 'object' && !Array.isArray(result)) {
        // maybe structure { paths: [...], topk: [...] }
        if (Array.isArray(result.paths)) {
          result = result.paths;
        } else if (Array.isArray(data.paths)) {
          result = data.paths;
        } else if (Array.isArray(data.topk)) {
          // sometimes topk is indices; then we can't build paths
          result = [];
        } else {
          // not an array -> unknown; try to find any array inside
          const foundArray = Object.values(result).find(v => Array.isArray(v));
          result = foundArray ?? [];
        }
      }

      if (!Array.isArray(result)) {
        // try resp.data directly if it's array
        if (Array.isArray(resp?.data)) {
          result = resp.data;
        } else {
          result = [];
        }
      }

      // Normalize each entry to object with 'path' if necessary
      const normalized = result.map(r => {
        if (!r) return null;
        if (typeof r === "string") {
          return { path: r };
        } else if (typeof r === "object") {
          // If r contains only path-like string keys, keep as-is
          return r;
        } else {
          return null;
        }
      }).filter(Boolean);

      console.log("Normalized result count:", normalized.length, normalized.slice(0, 3));
      setRetrival(normalized);
      return normalized;
    } catch (err) {
      console.error("Search failed:", err?.response?.data ?? err.message ?? err);
      setRetrival([]);
      return [];
    }
  };

  // Handler for the search button(s)
  const handleSearchClick = async (withScreens = false) => {
    // ensure topk is a number
    const kNum = Number(topk) || 100;

    const basePayload = {
      k: kNum,
      detection: detection || "",
      objects: obj || "",
      device: "cpu",
      operator: logic || "AND",
      page: 1,
      page_size: pageSize || 10,
      text: text || "",
      temporal_fuzzy: tempFuzzy || -1

    };

    const payload = withScreens ? {
      ...basePayload,
      query1: screen1 || undefined,
      query2: screen2 || undefined,
      query3: screen3 || undefined,
      model: model || "beit3",
      k: kNum,
      device: "cpu",
      augment: status,
      page: 1,
      page_size: pageSize || 10,
      temporal_fuzzy: tempFuzzy || -1
    } : basePayload;

    await doSearch(payload);
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        {/* Sidebar Drawer */}
        <Drawer
          title={<h2 style={{ margin: 0, fontFamily: "sans-serif" }}>Advanced Searching</h2>}
          placement="left"
          onClose={closeDrawer}
          open={drawerOpen}
          width={360}
          mask={false}
          closable={true}
          bodyStyle={{ padding: 20 }}
          style={{ height: "100vh", overflow: "hidden" }}
          getContainer={false}
        >
          <div style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            overflowY: "auto",
            background: "#fff",
          }}>
            <ItemPalette items={availableItems} />

            <div style={{ display: "flex", flexDirection: "column" }}>


              <div style={{ marginTop: 8 }}>
                <Radio.Group onChange={(e) => setLogic(e.target.value)} value={logic}>
                  <Space>
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
              style={{ width: "93%" }}
              placeholder="Object fillin"
              value={obj}
              onChange={(e) => setObj(e.target.value)}
            />

            <Input
              style={{ width: "93%" }}
              placeholder="Text indicator"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <Select
              style={{ width: '20%' }}
              value={tempFuzzy}
              onChange={(value) => setTempFuzzy(value)}
            >
              <Option value={-1}>-1</Option>
              <Option value={1}>1</Option>
              <Option value={2}>2</Option>

              <Option value={3}>3</Option>

            </Select>
          </div>

        </Drawer>

        {/* Main area */}
        <div style={{ width: '100%', paddingLeft: '10px' }}>
          <div style={{ width: '100%', margin: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

            <Input
              style={{ width: '25%' }}
              placeholder='Screen 1'
              value={screen1}
              onChange={(e) => setScreen1(e.target.value)}
            />

            <Input
              style={{ width: '25%' }}
              placeholder='Screen 2'
              value={screen2}
              onChange={(e) => setScreen2(e.target.value)}
            />

            <Input
              style={{ width: '25%' }}
              placeholder='Screen 3'
              value={screen3}
              onChange={(e) => setScreen3(e.target.value)}
            />

            <Input
              style={{ width: '5%' }}
              placeholder='set top-K'
              value={topk}
              onChange={(e) => {
                const v = e.target.value;
                const n = Number(v);
                setTopk(Number.isNaN(n) ? v : n);
              }}
            />

            <Select
              style={{ width: '6%' }}
              value={model}
              onChange={(value) => setModel(value)}
            >
              <Option value="beit3">BEIT3</Option>
              <Option value="clip">CLIP</Option>
            </Select>


            <Button onClick={async (e) => { e.preventDefault(); await handleSearchClick(screen1 !== "" || screen2 !== ""); }} title="Activate advanced searching">
              <MdManageSearch size={20} />
            </Button>

            <Button type="text" onClick={openDrawer} icon={<MenuOutlined />} />
            <Button onClick={() => {
              setButtonflag(!buttonflag)
              setStatus(!status)
            }} style={buttonflag === false ? { color: 'white', backgroundColor: 'red' } : { color: 'white', backgroundColor: 'green' }} >{buttonflag === false ? `Off` : `On`}</Button>

          </div>

          <div style={{ marginTop: 12 }}>
            {retrival.length > 0 ? <>
              <Table
                style={{ width: "100%", margin: "0" }}
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

            </> : <>
              <div style={{ fontFamily: 'Lexend', width: '100%', display: 'flex', flexDirection: "column", alignItems: 'center', height: '600px', justifyContent: 'center' }}>

                <h1 style={{ fontSize: '65px' }}>EEIOT HCMUT</h1>
                <h2 style={{ fontSize: '45px', color: 'grey' }}>AIC 2025</h2>

              </div>



            </>}

          </div>
        </div>
      </div>

      {mondalFLag && (
        <Infor
          setModalFlag={setModalFlag}

          selectedFrame={selectedFrame}
        />
      )}

    </>
  )
}

export default Jobs
