import React, { useState } from "react";

const getBackground = (n) => {
  switch (n) {
    case 1:
      return "Минимум";
    case 2:
      return "Открытие";
    case 3:
      return "Закрытие";
    case 4:
      return "Максимум";
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
  let url = "http://127.0.0.1:8000/api/draw_from_request/?";
  const data = formatDictToList(l);
  for (const el in data) {
    const urlParams = new URLSearchParams();
    urlParams.append("data[]", JSON.stringify(data[el]));
    url = url + String(urlParams) + "&";
  }
  return url;
};

const Main = () => {
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
        }
      } catch (TypeError) {
        if (updatedRows.length !== 1) {
          updatedRows.pop();
        }
      }
    }
    setRows(updatedRows);
    setImgUrl(getPicFromData(rows));
  };

  console.log(imgUrl);

  return (
    <div>
      <h1>Привет! Это сайт по рисованию свечных графиков онлайн!</h1>
      <h2>Для использования напиши в форму ниже значения</h2>
      {rows.map((row, rowId) => (
        <div key={rowId} style={{ display: "flex", gap: "10px" }}>
          {row.map(({ id, value }) => (
            <input
              key={id}
              type="text"
              placeholder={getBackground(id)}
              value={value || ""}
              onChange={(e) => handleChange(e, id, rowId)}
            />
          ))}
        </div>
      ))}
      <img src={imgUrl} alt="Введите корректно данные для генерации..." />
    </div>
  );
};

export default Main;
