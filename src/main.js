import React, { useState } from "react";
import { useCookie } from "./customHooks";

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const getBackground = (n) => {
  switch (n) {
    case 1:
      return "Minimum";
    case 2:
      return "Open";
    case 3:
      return "Close";
    case 4:
      return "Max";
  }
};

const formatDictToList = (d) => {
  let l = [];
  for (const i in d) {
    if (d[i][0]["value"] !== "") {
      l.push({
        Open: Number(d[i][1]["value"]),
        High: Number(d[i][0]["value"]),
        Low: Number(d[i][3]["value"]),
        Close: Number(d[i][2]["value"]),
      });
    }
  }
  return l;
};

const getPicFromData = (l) => {
  let url = "";
  if (process.env.REACT_APP_BUILD_MODE === "development") {
    url = "http://127.0.0.1:8000/api/draw_from_request/?";
  } else {
    url = "/api/draw_from_request/?";
  }

  const data = formatDictToList(l);
  for (const el in data) {
    const urlParams = new URLSearchParams();
    urlParams.append("data[]", JSON.stringify(data[el]));
    url = url + String(urlParams) + "&";
  }
  return url;
};

const Main = () => {
  const [value, setValue] = useCookie("lang", "en");
  const [rows, setRows] = useState([
    [
      { id: 1, value: "" },
      { id: 2, value: "" },
      { id: 3, value: "" },
      { id: 4, value: "" },
    ],
  ]);
  const [imgUrl, setImgUrl] = useState();

  const handleChange = (e, id, rowId) => {
    const updatedRows = [...rows];
    updatedRows[rowId][id - 1].value = e.target.value;
    if (rowId == rows.length - 1 && e.target.value !== "") {
      const newRow = [
        { id: 1, value: "" },
        { id: 2, value: "" },
        { id: 3, value: "" },
        { id: 4, value: "" },
      ];
      document.querySelector(".button").classList.add("down_button");
      sleep(800).then(() => {
        document.querySelector(".button").classList.remove("down_button");
      });
      updatedRows.push(newRow);
    }
    if (rowId == rows.length - 2 && e.target.value == "") {
      try {
        for (let i = updatedRows.length - 1; i >= 0; i--) {
          const lastRow = updatedRows[i];
          const secondLastRow = updatedRows[i - 1];
          if (
            lastRow.every(({ value }) => value === "") &&
            secondLastRow.every(({ value }) => value === "")
          ) {
            updatedRows.pop();
          }
          document.querySelector(".button").classList.add("up_button");
          sleep(800).then(() => {
            document.querySelector(".button").classList.remove("up_button");
          });
        }
      } catch (TypeError) {
        if (updatedRows.length !== 1) {
          updatedRows.pop();
        }
      }
    }
    setRows(updatedRows);
  };
  const inputs = document.querySelectorAll(".input");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (input.value) {
        input.classList.add("has-value");
      } else {
        input.classList.remove("has-value");
      }
    });
  });
  return (
    <div>
      {rows.map((row, rowId) => (
        <div
          className="input-container"
          key={rowId}
          style={{ display: "flex", gap: "10px" }}
        >
          <div className="center">
            {row.map(({ id, value }) => (
              <div className="input-wrapper center">
                <input
                  key={id}
                  type="text"
                  className="input"
                  placeholder={getBackground(id)}
                  value={value || ""}
                  onChange={(e) => handleChange(e, id, rowId)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="center">
        <button
          className="button"
          onClick={() => setImgUrl(getPicFromData(rows))}
        >
          Generate
        </button>
      </div>
      <div className="center">
<<<<<<< HEAD
        {imgUrl && <img src={imgUrl} alt="Error while generating!" />}
      </div>

      <div className="center">
        <a download="График.png" href={imgUrl}>
          <button className="download-button">Скачать</button>
        </a>
=======
        {imgUrl && <img src={imgUrl} alt="" className="img" />}
      </div>
      <div className="center">
        {imgUrl && (
          <a download="График.png" href={imgUrl}>
            <button className="download-button">Download</button>
          </a>
        )}
>>>>>>> f7e8be98ef789703ddca5297b1d1db2cbbf19f73
      </div>
    </div>
  );
};

export default Main;
