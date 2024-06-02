import React, { useState } from "react";
import { useCookie } from "./customHooks";

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function getLang() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`lang=`));
  return cookie ? cookie.split("=")[1] : "en";
}

const getBackground = (n) => {
  switch (n) {
    case 1:
      return CWBL("Minimum", "Минимум", getLang());
    case 2:
      return CWBL("Open", "Открытие", getLang());
    case 3:
      return CWBL("Close", "Закрытие", getLang());
    case 4:
      return CWBL("Max", "Максимум", getLang());
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

const CWBL = (en_v, ru_v, lang) => {
  // Choose word by language
  switch (lang) {
    case "ru":
      return ru_v;
    case "en":
      return en_v;
  }
};

const LanguageButton = (props) => {
  const [value, setValue] = useCookie("lang", "en");
  const changeLang = (newValue) => {
    setValue(newValue);
    props.update(Math.random());
  };
  return (
    <div className="langButtons">
      {getLang() === "en" && (
        <button
          onClick={() => {
            changeLang("ru");
          }}
        >
          Ru
        </button>
      )}
      {getLang() === "ru" && (
        <button
          onClick={() => {
            changeLang("en");
          }}
        >
          En
        </button>
      )}
    </div>
  );
};

const Main = () => {
  const [update, DoUpdateComponent] = useState("");
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
      <LanguageButton update={DoUpdateComponent} />
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
          {CWBL("Generate", "Генерировать", getLang())}
        </button>
      </div>
      <div className="center">
        {imgUrl && (
          <img
            src={imgUrl}
            alt={CWBL(
              "Error while generating!",
              "Ошибка во время генерации!",
              getLang()
            )}
          />
        )}
      </div>

      <div className="center">
        {imgUrl && (
          <a download="График.png" href={imgUrl}>
            <button className="download-button">
              {CWBL("Download", "Скачать", getLang())}
            </button>
          </a>
        )}
      </div>
    </div>
  );
};

export default Main;
