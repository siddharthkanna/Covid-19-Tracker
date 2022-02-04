import numeral from "numeral";
import React from "react";
import "./Table.css";

const Table = ({ countries }) => {
  // console.log(countries);
  return (
    <div className="table">
      {/* <table>
        <tbody> */}
      {countries.map(({ country, cases }, index) => (
        <tr key={index}>
          <td>{country}</td>
          <td>
            <strong>{numeral(cases).format("0,0")}</strong>
          </td>
        </tr>
      ))}
      {/* </tbody>
      </table> */}
    </div>
  );
};

export default Table;