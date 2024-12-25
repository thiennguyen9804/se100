import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, Visibility, Print } from "@mui/icons-material";

const Inbound = ({ isSidebarOpen }) => {
  const [searchWord, setSearchWord] = useState("");

  const data = [
    {
      asnCode: "ASN202412251",
      asnStatus: "Pre Delivery",
      totalWeight: 18.031,
      totalVolume: 0.0919,
      supplierName: "Supplier Name-1",
      creater: "GreaterWMS",
      createTime: "2024-12-25 15:28:24",
      updateTime: "December 24, 2024 at 9:56:43 PM UTC+7",
    },
    {
      asnCode: "ASN202412233",
      asnStatus: "Pre Load",
      totalWeight: 50.657,
      totalVolume: 0.0747,
      supplierName: "Supplier Name-10",
      creater: "GreaterWMS",
      createTime: "2024-12-23 20:58:25",
      updateTime: "December 24, 2024 at 9:56:43 PM UTC+7",
    },
    {
      asnCode: "ASN202412231",
      asnStatus: "Sorting",
      totalWeight: 8.914,
      totalVolume: 0.0847,
      supplierName: "Supplier Name-1",
      creater: "GreaterWMS",
      createTime: "2024-12-23 20:57:03",
      updateTime: "December 24, 2024 at 9:56:43 PM UTC+7",
    },
  ];

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchWord.toLowerCase())
    )
  );

  return (
    <div style={{ display: "grid", height: "calc(100vh - 96px)" }}>
      <div style={{ overflowX: "auto", height: "100%" }}>
        {/* Thanh công cụ */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <Button variant="contained" color="primary">
              + NEW
            </Button>
            <Button variant="outlined" color="primary" className="ml-2">
              REFRESH
            </Button>
          </div>
          <TextField
            label="Search Word"
            variant="outlined"
            size="small"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            InputProps={{
              endAdornment: <IconButton>{/* thêm icon search ở đây */}</IconButton>,
            }}
          />
        </div>

        {/* Bảng dữ liệu */}
        <TableContainer component={Paper} style={{ height: "calc(100% - 48px)" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>ASN Code</TableCell>
                <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>ASN Status</TableCell>
                <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>Total Weight (Unit: KG)</TableCell>
                <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>Total Volume (Unit: Cubic Metres)</TableCell>
                <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>Supplier Name</TableCell>
                <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>Creater</TableCell>
                <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>Create Time</TableCell>
                <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>Update Time</TableCell> 
                <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.asnCode}>
                  <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>{row.asnCode}</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>{row.asnStatus}</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>{row.totalWeight}</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>{row.totalVolume}</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>{row.supplierName}</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>{row.creater}</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>{row.createTime}</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>{row.updateTime}</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap", borderRight: "1px solid #ccc" }}>
                  <div className="flex">
                    <Tooltip title="View">
                      <IconButton>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print">
                      <IconButton>
                        <Print />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredData.length === 0 && <div className="text-center mt-4">NO MORE DATA</div>}
      </div>
    </div>
  );
};

export default Inbound;