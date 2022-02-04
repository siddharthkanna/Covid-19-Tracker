import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import "./App.css";
import InfoBox from "./Components/InfoBox/InfoBox";
import Map from "./Components/Map/Map";
import Table from "./Components/Table/Table";
import { prettyPrintStat, sortData } from "./util";
import LineGraph from "./Components/Graph/LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState([20, 77]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  const url = "https://disease.sh/v3/covid-19/countries";

  useEffect(() => {
    //async

    const getCountriesData = async () => {
      await fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          setMapCountries(data);
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    let countryCode = e.target.value;
    // console.log("selected country is ", countryCode);
    setCountry(countryCode);

    const all = "https://disease.sh/v3/covid-19/all";
    let oneCountry = `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    const urlData = countryCode === "worldwide" ? all : oneCountry;

    await fetch(urlData)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        // console.log(data.countryInfo);

        countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        countryCode === "worldwide" ? setMapZoom(3) : setMapZoom(4);
      });
  };

  // console.log("country info ", countryInfo);
  // console.log(countries);

  return (
    <div className="App">
      <div className="app__left">
        <div className="app__header">
          <h1>
            <strong>Covid19 Tracker</strong>
          </h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country, index) => (
                <MenuItem key={`country.value+${index}`} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={countryInfo.cases}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType}  />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
